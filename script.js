document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    document.getElementById(targetId)?.scrollIntoView({ behavior: 'smooth' });
  });
});

const burgerMenu = document.getElementById('burgerMenu');
const menu = document.getElementById('menu');

burgerMenu.addEventListener('click', () => {
  menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
});

menu.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    menu.style.display = 'none';
  }
});
  