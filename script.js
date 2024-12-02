// Add interactivity if needed, e.g., smooth scrolling
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = e.target.getAttribute('href').slice(1);
      const targetSection = document.getElementById(targetId);
      targetSection.scrollIntoView({ behavior: 'smooth' });
    });

// Get references to the burger menu and the menu
const burgerMenu = document.getElementById('burgerMenu');
const menu = document.getElementById('menu');

// Add click event listener to the burger menu
burgerMenu.addEventListener('click', () => {
  // Toggle the visibility of the menu
  if (menu.style.display === 'flex') {
    menu.style.display = 'none'; // Hide the menu
  } else {
    menu.style.display = 'flex'; // Show the menu
  }
});

// Optional: Close the menu when clicking a menu link (for better user experience)
menu.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    menu.style.display = 'none'; // Hide the menu after clicking a link
  }
});

  });
  