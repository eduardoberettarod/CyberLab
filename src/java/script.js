const olho = document.querySelector('.olho');
const retina = olho.querySelector('.retina');
const pupila = olho.querySelector('.pupila');

const maxMoveRetina = 7;  // quanto a retina pode se mover do centro do olho
const maxMovePupila = 30;   // quanto a pupila pode se mover do centro do olho

// Movimento retina e pupila seguindo o mouse, com limites diferentes
window.addEventListener('mousemove', e => {
  const rect = olho.getBoundingClientRect();
  const olhoCenterX = rect.left + rect.width / 2;
  const olhoCenterY = rect.top + rect.height / 2;

  let deltaX = e.clientX - olhoCenterX;
  let deltaY = e.clientY - olhoCenterY;

  // Calcula distância e limita para retina
  const distRetina = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  if (distRetina > maxMoveRetina) {
    const ratio = maxMoveRetina / distRetina;
    deltaX = deltaX * ratio;
    deltaY = deltaY * ratio;
  }

  // Move retina livremente dentro do limite maior
  retina.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  // Agora limita movimento pupila (menor)
  let deltaXPupila = e.clientX - olhoCenterX;
  let deltaYPupila = e.clientY - olhoCenterY;

  const distPupila = Math.sqrt(deltaXPupila * deltaXPupila + deltaYPupila * deltaYPupila);
  if (distPupila > maxMovePupila) {
    const ratioPupila = maxMovePupila / distPupila;
    deltaXPupila = deltaXPupila * ratioPupila;
    deltaYPupila = deltaYPupila * ratioPupila;
  }

  pupila.style.transform = `translate(${deltaXPupila}px, ${deltaYPupila}px)`;
});

// Olho treme quando mouse passa em cima dele
olho.addEventListener('mouseenter', () => {
  olho.classList.add('tremendo');
});

olho.addEventListener('mouseleave', () => {
  olho.classList.remove('tremendo');
});

// Piscar automático do olho a cada 4 segundos
function piscar() {
  olho.classList.add('piscando');
  setTimeout(() => {
    olho.classList.remove('piscando');
  }, 300); // duração do piscar (mesmo tempo da animação no CSS)
}

// Começa o piscar automático repetindo a cada 4s
setInterval(piscar, 4000);