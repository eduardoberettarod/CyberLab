// Importa a biblioteca THREE.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Crie uma cena do Three.JS
const scene = new THREE.Scene();

// Crie uma nova câmera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

// Variáveis globais
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let object;
let objToRender = 'eye'; // Nome do modelo

// Carregador GLTF
const loader = new GLTFLoader();
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;
    // Reseta rotações e centraliza
    object.traverse(function(child) {
      if (child.isMesh) {
        child.rotation.set(0, -0.2, 0);
        child.position.set(0, 0, 0);
      }
    });
    // POSIÇÃO CORRETA
    object.position.set(550, 180, -300); // Ajuste conforme necessário

    // ROTACIONA PARA FICAR DE FRENTE (Apenas 180° no eixo Y)
    object.rotation.set(0, Math.PI, 0);

    // ESCALA CORRETA
    object.scale.set(1, 1, 1);

    // Adiciona à cena
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

// Renderizador
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Câmera inicial
camera.position.set(280, 80, 500); // De frente ao modelo

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

// Movimentação do olho
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

// Animação
function animate() {
  requestAnimationFrame(animate);

  if (object && objToRender === "eye") {
    // Normaliza o mouse: -1 no canto esquerdo/superior, +1 no canto direito/inferior
    const normX = (mouseX / window.innerWidth - 0.5) * 2;
    const normY = (mouseY / window.innerHeight - 0.5) * 2;

    // Define os limites de rotação para manter o movimento natural
    const maxRotationY = 0.4; // Aproximadamente 23°
    const maxRotationX = 0.3; // Aproximadamente 14°

    // Aplica a rotação suavemente (centrada)
    object.rotation.y = Math.PI + normX * maxRotationY;
    object.rotation.x = normY * maxRotationX;
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
