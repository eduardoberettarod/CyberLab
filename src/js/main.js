//Importe a biblioteca THREE.js
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
// Para permitir que a câmera se mova ao redor da cena
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
// Para permitir a importação do arquivo .gltf
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

//Crie uma cena do Three.JS
const scene = new THREE.Scene();
//Crie uma nova câmera com posições e ângulos
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);

// Função para atualizar escala e posição da câmera
function updateObjectScale() {
  if (!object) return; // Garante que o objeto esteja carregado
  if (window.innerWidth < 600) {
    object.scale.set(0.5, 0.5, 0.5);
    camera.position.z = 300;
  } else {
    object.scale.set(1, 1, 1);
    camera.position.z = 500;
  }
}

//Acompanhe a posição do mouse, para que possamos fazer o olho se mover
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

//Mantenha o objeto 3D em uma variável global para que possamos acessá-lo mais tarde
let object;

//OrbitControls permite que a câmera se mova ao redor da cena
let controls;

//Defina qual objeto renderizar
let objToRender = 'eye';

//Instancie um carregador para o arquivo .gltf
const loader = new GLTFLoader();

//Carregue o arquivo
loader.load(
  `./models/${objToRender}/scene.gltf`,
  function (gltf) {
    //Se o arquivo for carregado, adicione-o à cena
    object = gltf.scene;
    object.position.set(470, 70, -100);
    scene.add(object);
    
    // Chama a função para ajustar a escala inicial
    updateObjectScale();
  },
  function (xhr) {
    //Enquanto estiver carregando, registre o progresso
    console.log((xhr.loaded / xhr.total * 100) + '% carregado');
  },
  function (error) {
    //Se houver um erro, registre-o
    console.error(error);
  }
);

//Instancie um novo renderizador e defina seu tamanho
const renderer = new THREE.WebGLRenderer({ alpha: true }); //Alpha: true permite o fundo transparente
renderer.setSize(window.innerWidth, window.innerHeight);

//Adicione o renderizador ao DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Defina quão longe a câmera estará do modelo 3D
camera.position.z = objToRender === "dino" ? 25 : 500;

//Adicione luzes à cena, para que possamos realmente ver o modelo 3D
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (cor, intensidade)
topLight.position.set(500, 500, 500) //topo-esquerda-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0x333333, objToRender === "dino" ? 5 : 1);
scene.add(ambientLight);

//Isso adiciona controles à câmera, para que possamos rotacionar / dar zoom com o mouse
if (objToRender === "dino") {
  controls = new OrbitControls(camera, renderer.domElement);
}

//Renderize a cena
function animate() {
  requestAnimationFrame(animate);

  //Faça o olho se mover
  if (object && objToRender === "eye") {
    object.rotation.y = -3 + mouseX / window.innerWidth * 3;
    object.rotation.x = -1.2 + mouseY * 2.5 / window.innerHeight;
  }

  renderer.render(scene, camera);
}

//Adicione um ouvinte à janela, para que possamos redimensionar a janela e a câmera
window.addEventListener("resize", function () {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Chama a função para atualizar a escala
  updateObjectScale();
});

//Adicione um ouvinte de posição do mouse, para que possamos fazer o olho se mover
document.onmousemove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

//Inicie a renderização 3D
animate();
