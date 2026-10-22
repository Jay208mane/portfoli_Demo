// Jay Mane portfolio interactions + optional Three.js scene.
document.getElementById('year').textContent = new Date().getFullYear();

const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
menuToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => navLinks.classList.remove('open')));

// Subtle pointer tilt for project/skill cards.
document.querySelectorAll('.tilt, .project-card').forEach(card => {
  card.addEventListener('mousemove', event => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const r = card.getBoundingClientRect();
    const x = (event.clientX - r.left) / r.width - .5;
    const y = (event.clientY - r.top) / r.height - .5;
    card.style.transform = `perspective(900px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg) translateY(-2px)`;
  });
  card.addEventListener('mouseleave', () => card.style.transform = '');
});

(function initThreeScene() {
  const canvas = document.getElementById('threeCanvas');
  if (!canvas || !window.THREE) {
    if (canvas) canvas.style.background = 'radial-gradient(circle at 50% 45%, #263d77 0%, #11182e 35%, transparent 70%)';
    return;
  }
  const THREE = window.THREE;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.z = 7.5;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const group = new THREE.Group();
  scene.add(group);

  const geometry = new THREE.IcosahedronGeometry(1.45, 1);
  const material = new THREE.MeshPhysicalMaterial({
    color: 0x536dff, metalness: .58, roughness: .22, wireframe: false,
    transparent: true, opacity: .88, clearcoat: 1, clearcoatRoughness: .18
  });
  const core = new THREE.Mesh(geometry, material);
  group.add(core);
  const wire = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x83f5eb, wireframe: true, transparent: true, opacity: .22 }));
  wire.scale.setScalar(1.015);
  group.add(wire);

  const torusMat = new THREE.MeshStandardMaterial({ color: 0x6ee9e0, metalness: .65, roughness: .28, emissive: 0x123e50 });
  const torus = new THREE.Mesh(new THREE.TorusGeometry(2.05, .012, 8, 160), torusMat);
  torus.rotation.x = 1.15; torus.rotation.y = .3; group.add(torus);
  const torus2 = new THREE.Mesh(new THREE.TorusGeometry(2.28, .008, 8, 160), new THREE.MeshBasicMaterial({color:0x7b91ff, transparent:true, opacity:.7}));
  torus2.rotation.x = .3; torus2.rotation.y = 1.1; group.add(torus2);

  const particlesGeometry = new THREE.BufferGeometry();
  const positions = [];
  for (let i = 0; i < 300; i++) {
    positions.push((Math.random() - .5) * 9, (Math.random() - .5) * 7, (Math.random() - .5) * 4);
  }
  particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  const particles = new THREE.Points(particlesGeometry, new THREE.PointsMaterial({ color: 0x8da6ff, size: .018, transparent: true, opacity: .75 }));
  scene.add(particles);

  scene.add(new THREE.AmbientLight(0x8ca7ff, 1.8));
  const light1 = new THREE.PointLight(0x6a86ff, 28, 20); light1.position.set(3, 3, 5); scene.add(light1);
  const light2 = new THREE.PointLight(0x52e5dc, 20, 20); light2.position.set(-3, -2, 4); scene.add(light2);

  let mouseX = 0, mouseY = 0;
  window.addEventListener('pointermove', e => {
    mouseX = (e.clientX / window.innerWidth - .5) * .35;
    mouseY = (e.clientY / window.innerHeight - .5) * .25;
  }, { passive: true });

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width || !r.height) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function animate() {
    requestAnimationFrame(animate);
    if (!reduced) {
      group.rotation.y += .003;
      group.rotation.x += .0015;
      torus.rotation.z += .0025;
      torus2.rotation.x += .0015;
      group.rotation.y += (mouseX - group.rotation.y) * .002;
      group.rotation.x += (mouseY - group.rotation.x) * .002;
      particles.rotation.y -= .0003;
    }
    renderer.render(scene, camera);
  }
  animate();
})();