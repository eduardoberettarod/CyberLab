const olho = document.querySelector('.olho');
const retina = olho.querySelector('.retina');
const pupila = olho.querySelector('.pupila');

const maxMoveRetina = 5;
const maxMovePupila = 20;

let mouseX = 0, mouseY = 0;
let animFrame;

// Atualiza as posições do olho (retina e pupila) com limites
function atualizarOlho() {
  const rect = olho.getBoundingClientRect();
  const olhoCenterX = rect.left + rect.width / 2;
  const olhoCenterY = rect.top + rect.height / 2;

  let deltaX = mouseX - olhoCenterX;
  let deltaY = mouseY - olhoCenterY;

  // Retina
  const distRetina = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  if (distRetina > maxMoveRetina) {
    const ratio = maxMoveRetina / distRetina;
    deltaX *= ratio;
    deltaY *= ratio;
  }
  retina.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

  // Pupila
  let deltaXPupila = mouseX - olhoCenterX;
  let deltaYPupila = mouseY - olhoCenterY;
  const distPupila = Math.sqrt(deltaXPupila * deltaXPupila + deltaYPupila * deltaYPupila);
  if (distPupila > maxMovePupila) {
    const ratioPupila = maxMovePupila / distPupila;
    deltaXPupila *= ratioPupila;
    deltaYPupila *= ratioPupila;
  }
  pupila.style.transform = `translate(${deltaXPupila}px, ${deltaYPupila}px)`;
}

// Throttle usando requestAnimationFrame
window.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  if (!animFrame) {
    animFrame = requestAnimationFrame(() => {
      atualizarOlho();
      animFrame = null;
    });
  }
});

// Tremor no olho
olho.addEventListener('mouseenter', () => {
  olho.classList.add('tremendo');
});
olho.addEventListener('mouseleave', () => {
  olho.classList.remove('tremendo');
});

// Piscar automático
function piscar() {
  olho.classList.add('piscando');
  setTimeout(() => {
    olho.classList.remove('piscando');
  }, 300);
}
setInterval(piscar, 4000);

// Movimento aleatório do olho
olho.style.transition = 'left 1s cubic-bezier(.68,-0.55,.27,1.55), top 1s cubic-bezier(.68,-0.55,.27,1.55)';
olho.style.position = 'fixed';

let isDragging = false;

function moverOlhoAleatoriamente() {
  if (isDragging) return;

  const larguraJanela = window.innerWidth;
  const alturaJanela = window.innerHeight;
  const olhoLargura = olho.offsetWidth;
  const olhoAltura = olho.offsetHeight;

  const maxLeft = larguraJanela - olhoLargura;
  const maxTop = alturaJanela - olhoAltura;

  const left = Math.random() * maxLeft;
  const top = Math.random() * maxTop;

  olho.style.left = `${left}px`;
  olho.style.top = `${top}px`;
}

setInterval(moverOlhoAleatoriamente, 15000);
moverOlhoAleatoriamente();

// Olho arrastável
let offsetX = 0;
let offsetY = 0;

olho.addEventListener('mousedown', function(e) {
  isDragging = true;
  offsetX = e.clientX - olho.offsetLeft;
  offsetY = e.clientY - olho.offsetTop;
  olho.style.transition = 'none';
  olho.classList.add('arrastando');
  document.body.style.userSelect = 'none';
});

document.addEventListener('mousemove', function(e) {
  if (isDragging) {
    const larguraJanela = window.innerWidth;
    const alturaJanela = window.innerHeight;
    const olhoLargura = olho.offsetWidth;
    const olhoAltura = olho.offsetHeight;

    let left = e.clientX - offsetX;
    let top = e.clientY - offsetY;

    left = Math.max(0, Math.min(left, larguraJanela - olhoLargura));
    top = Math.max(0, Math.min(top, alturaJanela - olhoAltura));

    olho.style.left = `${left}px`;
    olho.style.top = `${top}px`;
  }
});

document.addEventListener('mouseup', function() {
  isDragging = false;
  olho.style.transition = 'left 1s cubic-bezier(.68,-0.55,.27,1.55), top 1s cubic-bezier(.68,-0.55,.27,1.55)';
  olho.classList.remove('arrastando');
  document.body.style.userSelect = '';
});
document.querySelectorAll('.little-spheres').forEach((el) => {
  const randomX = Math.random(); // de 0 a 1
  el.style.setProperty('--rand-x', randomX);
});
document.querySelectorAll('.little-spheres').forEach((el) => {
  const randomX = Math.random();
  const randomSize = Math.random() * 5 + 5; // 5px a 10px
  const randomSpeed = Math.random() * 5 + 1; // 1 a 6

  el.style.setProperty('--rand-x', randomX);
  el.style.width = `${randomSize}px`;
  el.style.height = `${randomSize}px`;
  el.style.setProperty('--i', randomSpeed);
});
