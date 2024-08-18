const Services = require('../models/services');
const Postari = require('../models/postari');
const Angajati = require('../models/Angajati');
const prog = require('../models/programari');
const moment = require('moment');
const axios = require('axios');

const ore = ['8:00','9:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];

// Function to fetch holidays from Date.nager.at API
async function fetchHolidays(year) {
    try {
        const response = await axios.get(`https://date.nager.at/Api/v2/PublicHolidays/${year}/RO`);
        return response.data.map(holiday => holiday.date);
    } catch (error) {
        console.error('Error fetching holidays:', error);
        return [];
    }
}

// Function to check if a date is a weekend or holiday
async function isValidDate(date) {
    const day = moment(date).day();
    const formattedDate = moment(date).format('YYYY-MM-DD');

    // Check if it's a Saturday or Sunday
    if (day === 0 || day === 6) {
        return false;
    }

    // Fetch holidays dynamically for the current year
    const year = moment().year();
    const holidays = await fetchHolidays(year);

    // Check if it's a national holiday
    if (holidays.includes(formattedDate)) {
        return false;
    }

    return true;
}

// Function to generate the next 7 valid dates
async function generateValidDates() {
    const validDates = [];
    let currentDate = moment().startOf('day'); // Start from today

    while (validDates.length < 7) {
        if (await isValidDate(currentDate)) {
            validDates.push(currentDate.format('YYYY-MM-DD'));
        }
        currentDate.add(1, 'day'); // Move to the next day
    }

    return validDates;
}

module.exports.Homepage = async (req, res) => {
    try {
        const services = await Services.find({});
        const postari = await Postari.find({});
        const an = await Angajati.find({});
        const programari = await prog.find({});

        // Fetch all booked appointments
        const bookedAppointments = await prog.find({ booked: true });

        // Generate valid dates
        const dates = await generateValidDates();
        // Extract booked hours
        const bookedHours = bookedAppointments.map(appointment => appointment.ora);

        // Filter out the booked hours from the available hours
        const availableHours = ore.filter(hour => !bookedHours.includes(hour));

        res.render('home', {
            services,
            postari,
            an,
            programari,
            ore: availableHours,
            dates: dates // Add valid dates to the rendered view
        });
    } catch (error) {
        console.error('Error in Homepage function:', error);
        res.status(500).send('Internal Server Error');
    }
};