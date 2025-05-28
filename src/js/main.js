// Importa a biblioteca THREE.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Permite que a câmera se mova pela cena
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Permite importar arquivos .gltf
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Cria uma cena Three.JS
const scene = new THREE.Scene();
// Cria uma nova câmera com posições e ângulos
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Mantém o controle da posição do mouse para mover o olho
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Inicializa targetX com 180 graus para o modelo começar de frente
let targetX = Math.PI;
let targetY = 0;

// Mantém o objeto 3D em uma variável global para acesso posterior
let object;

// OrbitControls permite que a câmera se mova pela cena
let controls;

// Define qual objeto renderizar
let objToRender = 'eye';

// Instancia um loader para o arquivo .gltf
const loader = new GLTFLoader();

// Carrega o arquivo
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    object = gltf.scene;

    // Corrige a rotação para o modelo não ficar de costas (apenas no início)
    object.rotation.y = Math.PI; // 180 graus
    object.scale.set(1, 1, 1);   // Ajuste se necessário
    object.position.set(470, 70, -100); // Centraliza

    scene.add(object);
  },
  function (xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% carregado');
  },
  function (error) {
    console.error(error);
  }
);

// Instancia um novo renderizador e define o tamanho
const renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha: true permite fundo transparente
renderer.setSize(window.innerWidth, window.innerHeight);

// Adiciona o renderizador ao DOM
document.getElementById("container3D").appendChild(renderer.domElement);

// Define a distância da câmera ao modelo 3D
camera.position.z = objToRender === "dino" ? 25 : 500;

// Adiciona luzes à cena para visualizar o modelo 3D
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 500, 500);
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

// Adiciona controles à câmera para rotacionar/zoom com o mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

// Função para converter posição do mouse em coordenadas normalizadas (-1 a 1)
function getNormalizedMouse(x, y) {
  return {
    x: (x / window.innerWidth) * 2 - 2, // -1 à esquerda, +1 à direita
    y: -((y / window.innerHeight) * 2 - 1) // -1 em cima, +1 embaixo
  };
}

// Listener de mouse
document.onmousemove = (e) => {
  const norm = getNormalizedMouse(e.clientX, e.clientY);
  
  if (norm.x > 0) {
    targetX = Math.PI + norm.x * 0.4;  // menos rotação para direita
  } else {
    targetX = Math.PI + norm.x * 0.8;  // mais rotação para esquerda
  }
  
  targetY = norm.y * 0.4; // Mantém a rotação vertical
};


// Adiciona um leve efeito de profundidade (parallax)
if (object && objToRender === "eye") {
  const distanceFromCenter = Math.sqrt(norm.x * norm.x + norm.y * norm.y);
  object.position.z = -100 + distanceFromCenter * 50; // Exemplo de leve variação
}

// Renderiza a cena
function animate() {
  requestAnimationFrame(animate);

  // Faz o olho seguir o mouse de forma suave
  if (object && objToRender === "eye") {
    object.rotation.y += (targetX - object.rotation.y) * 0.5;
    object.rotation.x += (targetY - object.rotation.x) * 0.5;
  }

  renderer.render(scene, camera);
}

// Adiciona listener para redimensionar a janela e ajustar a câmera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Adiciona listener para posição do mouse e mover o olho
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  const norm = getNormalizedMouse(mouseX, mouseY);
  targetX = Math.PI + norm.x * 0.7; // Ajuste para manter de frente
  targetY = norm.y * 0.4;
};

// Inicia a renderização 3D
animate();
