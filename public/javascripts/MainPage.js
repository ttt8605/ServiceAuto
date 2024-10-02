
//other stuff


function limitWords(selector, wordLimit) {
  const paragraphs = document.querySelectorAll(selector);  // Select all matching elements

  paragraphs.forEach(paragraph => {
      const words = paragraph.innerText.split(' ');  // Split the paragraph text into words

      if (words.length > wordLimit) {
          paragraph.innerText = words.slice(0, wordLimit).join(' ') + '...';  // Limit the words
      }
  });
}

// Apply this to all paragraphs inside cards with a word limit of 50
limitWords('.card p', 30);



// Get all cards
const cards = document.querySelectorAll('.card');

// Loop through each card and set top with 20px increments
cards.forEach((card, index) => {
  let topValue = index * 20;  // 0px for first card, 20px for second, 40px for third, etc.
  card.style.top = topValue + 'px';
});







const prevButtons = document.querySelectorAll('.prev');
const nextButtons = document.querySelectorAll('.next');
const angajatiCards = document.querySelectorAll('.AngajatiCard');
const carouselContainer = document.querySelector('.carousel-container');

let currentIndex = 0;

// Function to update the carousel position
function updateCarousel() {
  const cardWidth = angajatiCards[0].clientWidth; // Get the width of one card
  const offset = currentIndex * -cardWidth; // Calculate the offset
  carouselContainer.style.transform = `translateX(${offset}px)`; // Slide the carousel
}

// Event listener for "prev" buttons
prevButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : angajatiCards.length - 1; // Loop to last card
    updateCarousel();
    console.log('Prev button clicked. Current index:', currentIndex); // Debugging log
  });
});

// Event listener for "next" buttons
nextButtons.forEach(button => {
  button.addEventListener('click', () => {
    currentIndex = (currentIndex < angajatiCards.length - 1) ? currentIndex + 1 : 0; // Loop to first card
    updateCarousel();
    console.log('Next button clicked. Current index:', currentIndex); // Debugging log
  });
});

// Initialize the carousel position
updateCarousel();
