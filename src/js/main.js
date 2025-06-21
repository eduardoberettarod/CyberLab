// Importa a biblioteca THREE.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Crie uma cena do Three.JS
const scene = new THREE.Scene();

// Crie uma nova câmera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(280, 80, 500); // De frente ao modelo

// Renderizador
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Raycaster para "seguir" o mouse
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const targetPoint = new THREE.Vector3(0, 0, 0); // Ponto onde o olho vai olhar

// Variáveis globais
let object;
let objToRender = 'eye'; // Nome do modelo

// Carregador GLTF
const loader = new GLTFLoader();
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    object.traverse(function (child) {
      if (child.isMesh) {
        child.rotation.set(0, 3.5, 0);
      }
    });
    object.position.set(550, 180, -300); // Ajuste conforme necessário
    object.rotation.set(0, Math.PI, 0);
    object.scale.set(1, 1, 1);
    scene.add(object);
    updateObjectScale();
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% carregado');
  },
  function (error) {
    console.error(error);
  }
);

// Luzes
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, 1);
scene.add(ambientLight);

// Função de responsividade
function updateObjectScale() {
  if (!object) return;
  if (window.innerWidth < 600) {
    object.scale.set(0.5, 0.5, 0.5);
    camera.position.z = 300;
  } else {
    object.scale.set(1, 1, 1);
    camera.position.z = 500;
  }
}

// Atualiza o mouse normalizado
window.addEventListener('mousemove', (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Animação
function animate() {
  requestAnimationFrame(animate);

  if (object) {
    // Projeta o raycaster a partir do mouse e da câmera
    raycaster.setFromCamera(mouse, camera);

    // Cria um plano invisível na frente da câmera para onde o olho deve olhar
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), -100); // Posição do plano a ~100 unidades na frente da câmera
    raycaster.ray.intersectPlane(planeZ, targetPoint);

    // Faz o olho "olhar" para o targetPoint
    object.lookAt(targetPoint);
  }

  renderer.render(scene, camera);
}

animate();

// Responsividade
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  updateObjectScale();
});

// Efeito nos cards
document.querySelectorAll('.card-sobre, .card-sobre-ep').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });

  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--mouse-x', `50%`);
    card.style.setProperty('--mouse-y', `50%`);
  });
});
const section = document.getElementById('home');
const cursor = section.querySelector('.cursor-personalizado');

section.addEventListener('mousemove', (e) => {
  const rect = section.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Move o cursor personalizado dentro da section
  cursor.style.left = `${x}px`;
  cursor.style.top = `${y}px`;

  // Cria o rastro na posição do mouse dentro da section
  const rastro = document.createElement('div');
  rastro.classList.add('rastro');
  rastro.style.left = `${x}px`;
  rastro.style.top = `${y}px`;
  section.appendChild(rastro);

  rastro.addEventListener('animationend', () => {
    rastro.remove();
  });
});

section.addEventListener('mouseleave', () => {
  cursor.style.display = 'none';
});

section.addEventListener('mouseenter', () => {
  cursor.style.display = 'block';
});

//pre-loader
const loaderContainer = document.querySelector('.loader-container');
const conteudo = document.getElementById('conteudo');

if (sessionStorage.getItem('visitouCyberLab')) {
  // Já visitou: mostra conteúdo direto
  loaderContainer?.remove();
  conteudo.style.opacity = 1;
} else {
  // Primeira visita: mostra loader e inicia animações
  sessionStorage.setItem('visitouCyberLab', 'true');

  // ✅ Mostra o loader
  loaderContainer.style.display = 'flex'; // ou block, conforme seu layout
  setTimeout(() => {
    loaderContainer.style.opacity = 1;
  }, 50); // Pequeno atraso para garantir transição


  // ----------------------------- LOADER ANIMATION ORIGINAL -----------------------------

  const loaderBar = document.querySelector('.loader-bar');
  const cadeado = document.querySelector('.cadeado');
  const loaderTxt = document.querySelector('.loader-cyber');
  const clickText = document.querySelector('.click-text');
  const clickText2 = document.querySelector('.click-text2');
  const conteudo = document.getElementById('conteudo');

  const totalDuration = 3;
  const expandDuration = 1.7;
  const antecipacao = 0.5;
  const fadeOutDuration = 0.6;

  const timeline = gsap.timeline();

  timeline.to(loaderBar, {
    duration: totalDuration,
    ease: "linear",
    css: { '--scaleX': 1 }
  }, 0);

  timeline.to(loaderBar, {
    duration: totalDuration,
    ease: "linear",
    css: {
      '--posX': '249vh',
      '--boxShadow': '0 0 0 4px rgba(8, 228, 228, 0.2), 0 0 0 10px rgba(8, 228, 228, 0.2), 0 0 20px rgba(8, 228, 228, 1), 0 0 40px 5px rgba(8, 228, 228, 1), 0 0 60px 10px rgba(8, 228, 228, 1)',
      '--scaleX': 1
    }
  }, 0);

  timeline.to([loaderBar, loaderTxt], {
    opacity: 0,
    pointerEvents: 'none',
    duration: 1.2,
    ease: "power1.out"
  }, totalDuration - antecipacao);

  timeline.set([cadeado, clickText, clickText2], {
    opacity: 1,
    pointerEvents: 'auto'
  }, totalDuration);


  cadeado.addEventListener('click', () => {
    // Ativa o bloqueio

    const som = new Audio('js/intro.wav');
    som.play();

    gsap.to([clickText, clickText2], {
      opacity: 0,
      duration: 0.4,
      ease: "power1.out"
    });

    gsap.to(cadeado, {
      scale: 200,
      transformOrigin: "50% 65%",
      pointerEvents: 'none',
      duration: expandDuration,
      ease: "power2.in",
      onComplete: () => {
        gsap.to(conteudo, {
          opacity: 1,
          duration: 0.8,
          ease: "power1.out"
        });

        gsap.to('.loader-container', {
          opacity: 0,
          duration: fadeOutDuration,
          onComplete: () => {
            document.querySelector('.loader-container').remove();
          }
        });
      }
    });
  })
}
//navbar
const navbar = document.getElementById('navbar-custom');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});
//botao e musica ambiente
const audio = document.getElementById('background-music');
const btn = document.getElementById('toggle-music-btn');
const muteLine = document.getElementById('mute-line');

let isPlaying = false;

btn.addEventListener('click', () => {
  if (!isPlaying) {
    audio.play();
    muteLine.classList.remove('active');
    isPlaying = true;
  } else {
    audio.pause();
    muteLine.classList.add('active');
    isPlaying = false;
  }
});

// Pausar ao sair ou mudar de aba
document.addEventListener('visibilitychange', () => {
  if (document.hidden && isPlaying) {
    audio.pause();
    muteLine.classList.add('active');
    isPlaying = false;
  }
});

window.addEventListener('beforeunload', () => {
  audio.pause();
  audio.currentTime = 0;
});
// Scroll vertical move o carrossel horizontalmente
const carouselContainer = document.querySelector('.carousel-container');

window.addEventListener('scroll', () => {
  const offsetTop = carouselContainer.offsetTop;
  const scrollY = window.scrollY;
  if (scrollY >= offsetTop && scrollY <= offsetTop + window.innerHeight) {
    carouselContainer.scrollLeft = scrollY - offsetTop;
  }
});