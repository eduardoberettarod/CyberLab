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
    object.traverse(function(child) {
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