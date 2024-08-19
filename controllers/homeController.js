const Services = require('../models/services');
const Postari = require('../models/postari');
const Angajati = require('../models/Angajati');
const prog = require('../models/programari');
const moment = require('moment');
const axios = require('axios');

// Hours for weekdays
const ore = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00','12:30','13:00','13:30','14:00','14:30','15:00','15:30','16:00'];
// Hours for Saturdays
const oreSaturday = ['8:00','8:30','9:00','9:30','10:00','10:30','11:00','11:30','12:00'];

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
    const day = moment(date).day(); // Get day of the week
    const formattedDate = moment(date).format('YYYY-MM-DD'); // Ensure ISO format
    const today = moment().format('YYYY-MM-DD'); // Ensure ISO format
    const currentTime = moment(); // Current time
    
    // Fetch holidays dynamically for the current year
    const year = moment().year();
    const holidays = await fetchHolidays(year);

    // Check if it's a Sunday or a national holiday
    if (day === 0 || holidays.includes(formattedDate)) {
        return false; // Not valid for booking
    }

    let availableHours = [];

    // If it's Saturday, return Saturday hours
    if (day === 6) {
        availableHours = oreSaturday;
    } else {
        // For weekdays, return full hours
        availableHours = ore;
    }

    // If the date is today, filter out past hours
    if (formattedDate === today) {
        availableHours = availableHours.filter(hour => moment(hour, 'HH:mm').isAfter(currentTime));
    }

    return availableHours;
}

// Function to generate the next 7 valid dates
async function generateValidDates() {
    const validDates = [];
    let currentDate = moment().startOf('day'); // Start from today

    while (validDates.length < 7) {
        const availableHours = await isValidDate(currentDate);
        if (availableHours) {
            validDates.push({
                date: currentDate.format('YYYY-MM-DD'), // Ensure ISO format
                hours: availableHours
            });
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

        // Generate valid dates with available hours
        const dates = await generateValidDates();

        // Map booked hours to the corresponding date
        const bookedHoursByDate = bookedAppointments.reduce((acc, appointment) => {
            const date = moment(appointment.date).format('YYYY-MM-DD'); // Ensure ISO format
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(appointment.ora);
            return acc;
        }, {});

        // Filter out the booked hours for each date
        const datesWithAvailableHours = dates.map(dateObj => {
            const bookedHours = bookedHoursByDate[dateObj.date] || [];
            const availableHours = dateObj.hours.filter(hour => !bookedHours.includes(hour));
            return {
                date: dateObj.date,
                hours: availableHours
            };
        });

        res.render('home', {
            services,
            postari,
            an,
            programari,
            datesWithAvailableHours // Pass valid dates with available hours to the rendered view
        });
    } catch (error) {
        console.error('Error in Homepage function:', error);
        res.status(500).send('Internal Server Error');
    }
};
