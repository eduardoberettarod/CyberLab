const olho = document.querySelector('.olho');
const retina = olho.querySelector('.retina');
const pupila = olho.querySelector('.pupila');

<<<<<<< Updated upstream
const maxMoveRetina = 5;
const maxMovePupila = 20;
=======
const maxMoveRetina = 7;  // quanto a retina pode se mover do centro do olho
const maxMovePupila = 30;   // quanto a pupila pode se mover do centro do olho
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
=======
  // Move retina livremente dentro do limite maior
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  }, 300);
}
setInterval(piscar, 4000);

// ----------- Movimento aleatório do olho pela tela -----------

olho.style.transition = 'left 1s cubic-bezier(.68,-0.55,.27,1.55), top 1s cubic-bezier(.68,-0.55,.27,1.55)';
olho.style.position = 'fixed';

let isDragging = false;

// Função para mover o olho aleatoriamente pela tela
function moverOlhoAleatoriamente() {
  if (isDragging) return; // Não move se estiver arrastando

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

// Move o olho a cada 10 segundos
const intervaloOlho = setInterval(moverOlhoAleatoriamente, 15000);
moverOlhoAleatoriamente();

// ----------- Torna o olho arrastável -----------

let offsetX = 0;
let offsetY = 0;

olho.addEventListener('mousedown', function(e) {
  isDragging = true;
  offsetX = e.clientX - olho.offsetLeft;
  offsetY = e.clientY - olho.offsetTop;
  olho.style.transition = 'none'; // Desativa a transição ao arrastar
  olho.classList.add('arrastando'); // Adiciona classe para cursor grabbing
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
  olho.style.transition = 'left 1s cubic-bezier(.68,-0.55,.27,1.55), top 1s cubic-bezier(.68,-0.55,.27,1.55)'; // Ativa novamente a transição
  olho.classList.remove('arrastando'); // Remove classe do cursor grabbing
  document.body.style.userSelect = '';
});
=======
  }, 300); // duração do piscar (mesmo tempo da animação no CSS)
}

// Começa o piscar automático repetindo a cada 4s
setInterval(piscar, 4000);
>>>>>>> Stashed changes
