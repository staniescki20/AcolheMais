// Menu mobile
const toggle = document.getElementById('nav-toggle');
const menu = document.getElementById('nav-menu');

toggle.addEventListener('click', function() {
  const aberto = toggle.getAttribute('aria-expanded') === 'true';
  toggle.setAttribute('aria-expanded', String(!aberto));
  menu.classList.toggle('aberto', !aberto);
});

// Fecha o menu ao clicar em um link
menu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('aberto');
  });
});

// Fecha o menu com Escape
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && menu.classList.contains('aberto')) {
    toggle.setAttribute('aria-expanded', 'false');
    menu.classList.remove('aberto');
    toggle.focus();
  }
});
