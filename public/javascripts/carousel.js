
const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.querySelector('.prev');
const nextButton = document.querySelector('.next');
let currentIndex = 0;
const totalSlides = slides.length;
let autoSlideInterval;

// Function to update carousel position using transform: translateX
function updateCarousel() {
  const container = document.querySelector('.carousel-container');
  container.style.transform = `translateX(-${currentIndex * 100}%)`;
}

// Function to go to the next slide
function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateCarousel();
}

// Function to go to the previous slide
function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateCarousel();
}

// Event Listeners for buttons
nextButton.addEventListener('click', () => {
  nextSlide();
});

prevButton.addEventListener('click', () => {
  prevSlide();
});

updateCarousel(); // Ensure the first slide is visible initially