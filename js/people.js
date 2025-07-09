let scene, camera, renderer, particles;
  let mouse = { x: 0, y: 0 };
  const mouseRadius = 100;
  const gap = 4;

  // Variáveis para dados das partículas
  let particlePositions, particleVelocities, particleBasePositions, particleSizes, particleSizeOffsets;

  init();

  function init() {
    scene = new THREE.Scene();

    const fov = 75;
    const aspect = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 2000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: createCanvas() });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // transparente

    loadImageAndCreateParticles();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
  }

  function createCanvas() {
    let existingCanvas = document.getElementById('three-canvas');
    if (existingCanvas) {
      return existingCanvas;
    }
    const canvas = document.createElement('canvas');
    canvas.id = 'three-canvas';
    document.body.appendChild(canvas);
    return canvas;
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function onMouseMove(event) {
    const canvas = renderer.domElement;
    const rect = canvas.getBoundingClientRect();
    mouse.x = event.clientX - rect.left;
    mouse.y = rect.height - (event.clientY - rect.top);
  }

  function loadImageAndCreateParticles() {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = 'imgs/people.png'; // coloque sua imagem aqui

    img.onload = () => {
      const canvasImg = document.createElement('canvas');
      const ctxImg = canvasImg.getContext('2d');
      const imgWidth = 200;  // diminui tamanho da imagem
      const imgHeight = 200;
      canvasImg.width = imgWidth;
      canvasImg.height = imgHeight;
      ctxImg.drawImage(img, 0, 0, imgWidth, imgHeight);

      const imgData = ctxImg.getImageData(0, 0, imgWidth, imgHeight);

      const positions = [];
      const velocities = [];
      const basePositions = [];
      const sizes = [];
      const sizeOffsets = [];

      const offsetX = -imgWidth / 2 + 400; // ajuste posição horizontal
      const offsetY = -imgHeight / 2 + 300; // ajuste posição vertical

      for (let y = 0; y < imgHeight; y += gap) {
        for (let x = 0; x < imgWidth; x += gap) {
          const i = (y * imgWidth + x) * 4;
          const alpha = imgData.data[i + 3];
          if (alpha > 128) {
            const margin = 10;
            const randomAngle = Math.random() * Math.PI * 2;
            const randomRadius = Math.random() * margin;
            const posX = x + offsetX + Math.cos(randomAngle) * randomRadius;
            const posY = -y + offsetY + Math.sin(randomAngle) * randomRadius;
            const posZ = (Math.random() - 0.5) * 10;

            positions.push(posX, posY, posZ);
            basePositions.push(posX, posY, posZ);

            velocities.push(0, 0, 0);

            sizes.push(1 + Math.random() * 3);
            sizeOffsets.push(Math.random() * Math.PI * 2);
          }
        }
      }

      particlePositions = new Float32Array(positions);
      particleBasePositions = new Float32Array(basePositions);
      particleVelocities = velocities;
      particleSizes = sizes;
      particleSizeOffsets = sizeOffsets;

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
      geometry.setAttribute('size', new THREE.Float32BufferAttribute(particleSizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: {
          color: { value: new THREE.Color(0x00ffff) },
          time: { value: 0 }
        },
        vertexShader: `
          attribute float size;
          uniform float time;
          varying float vOpacity;
          void main() {
            float animatedSize = size + 1.0 * sin(time + size);
            vOpacity = 0.7 + 0.3 * sin(time + size * 2.0);
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = animatedSize * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying float vOpacity;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            gl_FragColor = vec4(color, vOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      animate();
    };
  }

  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!particles) {
      renderer.render(scene, camera);
      return;
    }

    const positions = particles.geometry.attributes.position.array;
    const velocities = particleVelocities;
    const basePositions = particleBasePositions;

    particles.material.uniforms.time.value = clock.getElapsedTime() * 5;

    const canvasWidth = renderer.domElement.width;
    const canvasHeight = renderer.domElement.height;

    for (let i = 0; i < positions.length; i += 3) {
      const px = positions[i];
      const py = positions[i + 1];

      const dx = mouse.x - (px + canvasWidth / 2);
      const dy = mouse.y - (py + canvasHeight / 2);
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouseRadius - dist) / mouseRadius;
        const moveX = Math.cos(angle) * force * 5;
        const moveY = Math.sin(angle) * force * 5;

        velocities[i] -= moveX;
        velocities[i + 1] -= moveY;
        velocities[i + 2] -= (Math.random() - 0.5) * force * 2;
      }

      velocities[i] *= 0.9;
      velocities[i + 1] *= 0.9;
      velocities[i + 2] *= 0.9;

      positions[i] += velocities[i] + (basePositions[i] - positions[i]) * 0.05;
      positions[i + 1] += velocities[i + 1] + (basePositions[i + 1] - positions[i + 1]) * 0.05;
      positions[i + 2] += velocities[i + 2] + (basePositions[i + 2] - positions[i + 2]) * 0.05;
    }

    particles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }