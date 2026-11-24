const mount = document.querySelector('#table-scene');
const frame = document.querySelector('#table-scene-frame');
const status = document.querySelector('#scene-status');

if (mount && frame && status) {
  const controlsGroup = document.querySelector('.scene-controls');

  async function createTableScene() {
    try {
      const [THREE, { OrbitControls }] = await Promise.all([
        import('three'),
        import('three/addons/controls/OrbitControls.js'),
      ]);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color('#171511');

      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 60);
      camera.position.set(6.6, 5.6, 7.2);

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.domElement.setAttribute('aria-hidden', 'true');
      mount.appendChild(renderer.domElement);

      const orbit = new OrbitControls(camera, renderer.domElement);
      orbit.target.set(0, 1, 0);
      orbit.enableDamping = true;
      orbit.dampingFactor = 0.065;
      orbit.minDistance = 5.2;
      orbit.maxDistance = 11;
      orbit.minPolarAngle = 0.48;
      orbit.maxPolarAngle = 1.42;
      orbit.enablePan = false;
      orbit.update();

      scene.add(new THREE.HemisphereLight(0xf7e8cf, 0x201811, 1.55));

      const keyLight = new THREE.DirectionalLight(0xffe0af, 2.7);
      keyLight.position.set(-4, 8, 5);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1536, 1536);
      keyLight.shadow.camera.left = -6;
      keyLight.shadow.camera.right = 6;
      keyLight.shadow.camera.top = 7;
      keyLight.shadow.camera.bottom = -5;
      scene.add(keyLight);

      const fillLight = new THREE.PointLight(0xc98243, 18, 8, 2);
      fillLight.position.set(1.7, 2.5, -1.2);
      scene.add(fillLight);

      const materials = {
        wood: new THREE.MeshStandardMaterial({ color: 0x3d2b20, roughness: 0.58, metalness: 0.02 }),
        darkWood: new THREE.MeshStandardMaterial({ color: 0x33271f, roughness: 0.64 }),
        chair: new THREE.MeshStandardMaterial({ color: 0x40352d, roughness: 0.86 }),
        linen: new THREE.MeshStandardMaterial({ color: 0xb8aa90, roughness: 0.94 }),
        porcelain: new THREE.MeshStandardMaterial({ color: 0xe9e1d2, roughness: 0.19, metalness: 0.04 }),
        gold: new THREE.MeshStandardMaterial({ color: 0xc4a067, roughness: 0.25, metalness: 0.76 }),
        steel: new THREE.MeshStandardMaterial({ color: 0xaaa99f, roughness: 0.2, metalness: 0.88 }),
        glass: new THREE.MeshPhysicalMaterial({ color: 0xd3d9d2, roughness: 0.08, metalness: 0, transparent: true, opacity: 0.3, transmission: 0.35, thickness: 0.2, side: THREE.DoubleSide, depthWrite: false }),
        wine: new THREE.MeshPhysicalMaterial({ color: 0x551a1f, roughness: 0.18, metalness: 0.03 }),
        greens: new THREE.MeshStandardMaterial({ color: 0x657345, roughness: 0.8 }),
        tomato: new THREE.MeshStandardMaterial({ color: 0xb44d35, roughness: 0.4 }),
        candle: new THREE.MeshStandardMaterial({ color: 0xe4d1a7, roughness: 0.7 }),
      };

      const addMesh = (geometry, material, position, parent = scene) => {
        const item = new THREE.Mesh(geometry, material);
        item.position.set(...position);
        item.castShadow = true;
        item.receiveShadow = true;
        parent.add(item);
        return item;
      };

      const floor = addMesh(
        new THREE.PlaneGeometry(40, 40),
        new THREE.MeshStandardMaterial({ color: 0x171511, roughness: 0.9 }),
        [0, 0.015, 0],
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      floor.castShadow = false;

      addMesh(new THREE.CylinderGeometry(2.25, 2.25, 0.18, 80), materials.wood, [0, 1, 0]);
      const tableRim = addMesh(new THREE.TorusGeometry(2.22, 0.012, 8, 96), materials.gold, [0, 1.08, 0]);
      tableRim.rotation.x = Math.PI / 2;

      const addChair = (x, z, rotation = 0) => {
        const chair = new THREE.Group();
        chair.position.set(x, 0, z);
        chair.rotation.y = rotation;
        scene.add(chair);
        const box = (size, position, material) => {
          const part = addMesh(new THREE.BoxGeometry(...size), material, position, chair);
          return part;
        };
        box([0.92, 0.14, 0.82], [0, 0.78, 0], materials.chair);
        box([0.92, 0.88, 0.13], [0, 1.27, -0.34], materials.chair);
        [-0.36, 0.36].forEach((xPos) => {
          [-0.3, 0.3].forEach((zPos) => box([0.09, 0.77, 0.09], [xPos, 0.39, zPos], materials.darkWood));
        });
        [-0.28, 0, 0.28].forEach((xPos) => box([0.055, 0.53, 0.055], [xPos, 1.25, -0.34], materials.gold));
      };

      addChair(0, -2.48, 0);
      addChair(-2.65, 0.5, Math.PI / 2);
      addChair(2.65, 0.5, -Math.PI / 2);

      addMesh(new THREE.CylinderGeometry(0.98, 1.04, 0.075, 64), materials.porcelain, [0, 1.17, 0]);
      addMesh(new THREE.CylinderGeometry(0.82, 0.86, 0.035, 64), materials.porcelain, [0, 1.225, 0]);
      const plateRim = addMesh(new THREE.TorusGeometry(0.88, 0.012, 8, 64), materials.gold, [0, 1.245, 0]);
      plateRim.rotation.x = Math.PI / 2;

      const centerpiece = addMesh(
        new THREE.SphereGeometry(1, 28, 18),
        new THREE.MeshStandardMaterial({ color: 0x8b5b3a, roughness: 0.62 }),
        [0, 1.31, 0],
      );
      centerpiece.scale.set(0.32, 0.075, 0.22);
      [
        [-0.3, 0.02, -0.17, 0.075], [-0.22, 0.01, 0.2, 0.06],
        [0.25, 0.015, -0.18, 0.065], [0.32, 0.01, 0.13, 0.055],
        [-0.04, 0.025, 0.29, 0.05], [0.08, 0.02, -0.31, 0.052],
      ].forEach(([x, y, z, size], index) => {
        const garnish = addMesh(new THREE.SphereGeometry(1, 16, 12), index % 3 === 0 ? materials.tomato : materials.greens, [x, 1.39 + y, z]);
        garnish.scale.set(size * 1.25, size * 0.34, size);
      });

      const glassProfile = [
        [0, 0.025], [0.16, 0.025], [0.055, 0.075], [0.045, 0.46],
        [0.2, 0.53], [0.31, 0.69], [0.36, 0.88], [0.34, 1.04],
        [0.3, 1.12], [0.275, 1.105], [0.29, 0.99], [0.3, 0.87],
        [0.25, 0.69], [0.17, 0.58], [0.025, 0.52], [0, 0.51],
      ].map(([radius, height]) => new THREE.Vector2(radius, height));
      const glass = new THREE.Group();
      glass.position.set(1.25, 1.17, -0.62);
      scene.add(glass);
      addMesh(new THREE.LatheGeometry(glassProfile, 40), materials.glass, [0, 0, 0], glass);
      const wineSurface = addMesh(new THREE.SphereGeometry(1, 32, 20), materials.wine, [0, 0.77, 0], glass);
      wineSurface.scale.set(0.275, 0.026, 0.275);

      const napkin = addMesh(new THREE.BoxGeometry(0.68, 0.025, 0.54), materials.linen, [-1.32, 1.17, -0.45]);
      napkin.rotation.y = -0.28;
      napkin.rotation.z = -0.035;

      const addUtensil = (x, z, rotation = 0) => {
        const utensil = new THREE.Group();
        utensil.position.set(x, 1.16, z);
        utensil.rotation.y = rotation;
        scene.add(utensil);
        const handle = addMesh(new THREE.CylinderGeometry(0.018, 0.025, 0.66, 12), materials.steel, [0, 0, 0], utensil);
        handle.rotation.x = Math.PI / 2;
        const head = addMesh(new THREE.SphereGeometry(1, 16, 10), materials.steel, [0, 0, -0.34], utensil);
        head.scale.set(0.07, 0.018, 0.11);
        if (rotation < 0) {
          [-0.035, 0, 0.035].forEach((offset) => {
            const tine = addMesh(new THREE.CylinderGeometry(0.007, 0.007, 0.13, 8), materials.steel, [offset, 0, -0.45], utensil);
            tine.rotation.x = Math.PI / 2;
          });
        }
      };
      addUtensil(-1.26, 0.12, -0.08);
      addUtensil(1.28, 0.12, 0.08);

      addMesh(new THREE.CylinderGeometry(0.075, 0.08, 0.42, 24), materials.candle, [-1.18, 1.39, 0.95]);
      const flameMaterial = new THREE.MeshStandardMaterial({ color: 0xffbd6a, emissive: 0xff8b29, emissiveIntensity: 2.4, roughness: 0.25 });
      const flame = addMesh(new THREE.SphereGeometry(0.065, 18, 14), flameMaterial, [-1.18, 1.64, 0.95]);
      flame.scale.set(0.55, 1.5, 0.55);
      const candleLight = new THREE.PointLight(0xffa34c, 14, 3.5, 2);
      candleLight.position.set(-1.18, 1.8, 0.95);
      scene.add(candleLight);

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
        draw();
      };

      let frameId = 0;
      let inView = false;
      const draw = () => {
        if (!inView || document.hidden || frameId) return;
        const renderFrame = () => {
          frameId = 0;
          if (!inView || document.hidden) return;
          const moving = orbit.update();
          renderer.render(scene, camera);
          if (moving) frameId = requestAnimationFrame(renderFrame);
        };
        frameId = requestAnimationFrame(renderFrame);
      };

      orbit.addEventListener('change', draw);
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      const visibilityObserver = new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting;
        if (inView) draw();
        else if (frameId) {
          cancelAnimationFrame(frameId);
          frameId = 0;
        }
      }, { threshold: 0.05 });
      visibilityObserver.observe(frame);
      document.addEventListener('visibilitychange', draw);

      const initialPosition = new THREE.Vector3(6.6, 5.6, 7.2);
      const resetView = () => {
        camera.position.copy(initialPosition);
        orbit.target.set(0, 1, 0);
        orbit.update();
        draw();
      };

      controlsGroup?.querySelectorAll('[data-scene-rotate]').forEach((button) => {
        button.addEventListener('click', () => {
          orbit.rotateLeft(button.dataset.sceneRotate === 'left' ? Math.PI / 7 : -Math.PI / 7);
          orbit.update();
          draw();
        });
      });
      controlsGroup?.querySelector('[data-scene-reset]')?.addEventListener('click', resetView);

      frame.classList.add('is-ready');
      status.textContent = 'Interactive view ready. Drag or use the controls to explore.';
      resize();
      draw();
    } catch {
      status.textContent = 'The interactive view is unavailable here. Please try a WebGL-enabled browser.';
      controlsGroup?.querySelectorAll('button').forEach((button) => { button.disabled = true; });
      frame.classList.add('scene-unavailable');
    }
  }

  createTableScene();
}
