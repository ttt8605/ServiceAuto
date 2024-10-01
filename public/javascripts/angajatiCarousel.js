const prevButtons = document.querySelectorAll('.prev'); // Changed to querySelectorAll
const nextButtons = document.querySelectorAll('.next'); // Changed to querySelectorAll
const angajatiCards = document.querySelectorAll('.AngajatiCard'); // Renamed to 'angajatiCards'
const carouselContainer = document.querySelector('.carousel-container');

let currentIndex = 0; // Keep track of the current visible card

// Function to update card visibility
function updateCardVisibility() {
  angajatiCards.forEach((card, index) => {
    if (index === currentIndex) {
      card.classList.add('visible');
      card.classList.remove('invisible');
    } else {
      card.classList.add('invisible');
      card.classList.remove('visible');
    }
  });
   // Calculate the card width based on screen size
   let cardWidth;

   // Check the window width to determine the card width
   if (window.innerWidth <= 768) {
     cardWidth = 400; // Fixed width for screens smaller than 768px
   } if(window.innerWidth <= 500){
    cardWidth = 360;
   } if(window.innerWidth <= 400){
    cardWidth = 340;
   } if(window.innerWidth <= 360){
    cardWidth = 320;
   }else {
     cardWidth = window.innerWidth; // Full width for screens 768px and larger
   }
 
   const offset = currentIndex * -cardWidth; // Calculate the offset
   carouselContainer.style.transform = `translateX(${offset}px)`; // Use pixels for fixed width
}

// Initialize visibility
updateCardVisibility();

// Event listeners for "prev" buttons
prevButtons.forEach(prevButton => {
  prevButton.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
    } else {
      currentIndex = angajatiCards.length - 1; // Loop back to the last card
    }
    updateCardVisibility();
    console.log('Prev button clicked. Current index:', currentIndex); // Debugging log
  });
});

// Event listeners for "next" buttons
nextButtons.forEach(nextButton => {
  nextButton.addEventListener('click', () => {
    if (currentIndex < angajatiCards.length - 1) {
      currentIndex++;
    } else {
      currentIndex = 0; // Loop back to the first card
    }
    updateCardVisibility();
    console.log('Next button clicked. Current index:', currentIndex); // Debugging log
  });
});
