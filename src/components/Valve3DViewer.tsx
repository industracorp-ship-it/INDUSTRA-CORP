import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { 
  RotateCw, 
  Eye, 
  Maximize2, 
  RotateCcw, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  Palette,
  Compass
} from 'lucide-react';
import { ValveCategory, SupportedLanguage } from '../types/valve';

interface Valve3DViewerProps {
  category?: string;
  valveCode: string;
  valveName: string;
  material?: string;
  lang: SupportedLanguage;
}

type MaterialTheme = 'epoxy_blue' | 'stainless_steel' | 'cast_steel' | 'fire_red' | 'bronze_gold';

export const Valve3DViewer: React.FC<Valve3DViewerProps> = ({
  category = 'gate',
  valveCode,
  valveName,
  material = 'ductile_iron',
  lang,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [theme, setTheme] = useState<MaterialTheme>(() => {
    if (material.includes('ss') || material.includes('stainless')) return 'stainless_steel';
    if (material.includes('bronze')) return 'bronze_gold';
    if (material.includes('steel')) return 'cast_steel';
    if (category === 'safety_valve' || valveCode.includes('UL') || valveCode.includes('FM')) return 'fire_red';
    return 'epoxy_blue';
  });

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const valveGroupRef = useRef<THREE.Group | null>(null);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Interaction dragging state
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0.35, y: 0.75 });
  const currentRotationRef = useRef({ x: 0.35, y: 0.75 });
  const targetZoomRef = useRef(3.8);
  const currentZoomRef = useRef(3.8);

  // Helper for material color palettes
  const getThemePalette = (t: MaterialTheme) => {
    switch (t) {
      case 'stainless_steel':
        return {
          bodyColor: 0xd1d5db,
          flangeColor: 0x9ca3af,
          trimColor: 0x3b82f6,
          metalness: 0.92,
          roughness: 0.18,
          name: 'Inox 316L (Stainless Steel)'
        };
      case 'cast_steel':
        return {
          bodyColor: 0x334155,
          flangeColor: 0x1e293b,
          trimColor: 0xf59e0b,
          metalness: 0.85,
          roughness: 0.35,
          name: 'Thép Đúc WCB (Cast Steel)'
        };
      case 'fire_red':
        return {
          bodyColor: 0xdc2626,
          flangeColor: 0x991b1b,
          trimColor: 0xfacc15,
          metalness: 0.55,
          roughness: 0.3,
          name: 'Đỏ PCCC UL/FM (Fire Signal Red)'
        };
      case 'bronze_gold':
        return {
          bodyColor: 0xd97706,
          flangeColor: 0xb45309,
          trimColor: 0x78350f,
          metalness: 0.88,
          roughness: 0.25,
          name: 'Đồng Hợp Kim (Bronze / Brass)'
        };
      case 'epoxy_blue':
      default:
        return {
          bodyColor: 0x1d4ed8, // Industrial Epoxy Blue
          flangeColor: 0x1e40af,
          trimColor: 0xf59e0b,
          metalness: 0.5,
          roughness: 0.32,
          name: 'Sơn Epoxy Xanh (Ductile Iron)'
        };
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 340;
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 1.2, currentZoomRef.current);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Studio Environment map via RoomEnvironment
    try {
      const pmremGenerator = new THREE.PMREMGenerator(renderer);
      scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
      pmremGenerator.dispose();
    } catch (e) {
      // Fallback gracefully
    }

    // Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.2);
    keyLight.position.set(4, 6, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    const fillLight = new THREE.HemisphereLight(0x93c5fd, 0x1e293b, 1.4);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.6);
    rimLight.position.set(-4, -2, -4);
    scene.add(rimLight);

    // Soft Contact Shadow Plane beneath the valve
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const shadowCtx = shadowCanvas.getContext('2d');
    if (shadowCtx) {
      const grad = shadowCtx.createRadialGradient(64, 64, 0, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.55)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      shadowCtx.fillStyle = grad;
      shadowCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      depthWrite: false,
      opacity: 0.85
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.92;
    scene.add(shadowMesh);

    // Build Procedural 3D Valve Assembly
    const valveGroup = new THREE.Group();
    valveGroupRef.current = valveGroup;
    scene.add(valveGroup);

    buildValveGeometry(valveGroup, category, theme, isWireframe);

    // Pointer events for orbit controls
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDraggingRef.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMousePosRef.current = { x: clientX, y: clientY };
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingRef.current) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMousePosRef.current.x;
      const deltaY = clientY - prevMousePosRef.current.y;

      targetRotationRef.current.y += deltaX * 0.008;
      targetRotationRef.current.x = Math.max(-0.6, Math.min(1.2, targetRotationRef.current.x + deltaY * 0.008));

      prevMousePosRef.current = { x: clientX, y: clientY };
    };

    const onPointerUp = () => {
      isDraggingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      targetZoomRef.current = Math.max(2.2, Math.min(6.5, targetZoomRef.current + e.deltaY * 0.003));
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    dom.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
    dom.addEventListener('wheel', onWheel, { passive: false });

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth || 600;
      const newH = container.clientHeight || 340;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let lastTime = performance.now();
    const animate = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      if (isAutoRotate && !isDraggingRef.current) {
        targetRotationRef.current.y += dt * 0.45;
      }

      // Smooth damping interpolation
      currentRotationRef.current.x = THREE.MathUtils.damp(currentRotationRef.current.x, targetRotationRef.current.x, 8, dt);
      currentRotationRef.current.y = THREE.MathUtils.damp(currentRotationRef.current.y, targetRotationRef.current.y, 8, dt);
      currentZoomRef.current = THREE.MathUtils.damp(currentZoomRef.current, targetZoomRef.current, 8, dt);

      if (valveGroupRef.current) {
        valveGroupRef.current.rotation.x = currentRotationRef.current.x;
        valveGroupRef.current.rotation.y = currentRotationRef.current.y;
      }

      if (cameraRef.current) {
        cameraRef.current.position.z = currentZoomRef.current;
        cameraRef.current.position.y = currentZoomRef.current * 0.32;
        cameraRef.current.lookAt(0, 0.1, 0);
      }

      renderer.render(scene, camera);
      animFrameIdRef.current = requestAnimationFrame(animate);
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      dom.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      dom.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      dom.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      // Dispose Three.js objects
      materialsRef.current.forEach((m) => m.dispose());
      scene.clear();
      renderer.dispose();
    };
  }, [category]);

  // Update theme & wireframe without reconstructing the full scene
  useEffect(() => {
    if (!valveGroupRef.current) return;
    valveGroupRef.current.clear();
    buildValveGeometry(valveGroupRef.current, category, theme, isWireframe);
  }, [theme, isWireframe, category]);

  /**
   * Procedural CAD Assembly for specific valve types
   */
  const buildValveGeometry = (
    group: THREE.Group,
    cat: string,
    curTheme: MaterialTheme,
    wire: boolean
  ) => {
    const palette = getThemePalette(curTheme);

    // Materials
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: palette.bodyColor,
      metalness: palette.metalness,
      roughness: palette.roughness,
      wireframe: wire,
    });

    const flangeMaterial = new THREE.MeshStandardMaterial({
      color: palette.flangeColor,
      metalness: Math.min(1, palette.metalness + 0.05),
      roughness: Math.max(0.1, palette.roughness - 0.05),
      wireframe: wire,
    });

    const trimMaterial = new THREE.MeshStandardMaterial({
      color: palette.trimColor,
      metalness: 0.9,
      roughness: 0.2,
      wireframe: wire,
    });

    const boltMaterial = new THREE.MeshStandardMaterial({
      color: 0xe2e8f0,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: wire,
    });

    materialsRef.current = [bodyMaterial, flangeMaterial, trimMaterial, boltMaterial];

    // Helper to create flanged pipe ends
    const addFlangedEnds = (length: number, flangeRadius: number, pipeRadius: number) => {
      // Main horizontal flow barrel
      const pipeGeo = new THREE.CylinderGeometry(pipeRadius, pipeRadius, length, 32);
      const pipeMesh = new THREE.Mesh(pipeGeo, bodyMaterial);
      pipeMesh.rotation.z = Math.PI / 2;
      pipeMesh.castShadow = true;
      group.add(pipeMesh);

      // Flanges (Left & Right)
      [-length / 2, length / 2].forEach((xPos) => {
        const flangeGeo = new THREE.CylinderGeometry(flangeRadius, flangeRadius, 0.12, 32);
        const flangeMesh = new THREE.Mesh(flangeGeo, flangeMaterial);
        flangeMesh.rotation.z = Math.PI / 2;
        flangeMesh.position.x = xPos;
        flangeMesh.castShadow = true;
        group.add(flangeMesh);

        // Raised face lip
        const lipGeo = new THREE.CylinderGeometry(pipeRadius * 1.35, pipeRadius * 1.35, 0.04, 32);
        const lipMesh = new THREE.Mesh(lipGeo, flangeMaterial);
        lipMesh.rotation.z = Math.PI / 2;
        lipMesh.position.x = xPos + (xPos < 0 ? -0.07 : 0.07);
        group.add(lipMesh);

        // 8 Bolt Holes / Studs on flange face
        const numBolts = 8;
        for (let i = 0; i < numBolts; i++) {
          const angle = (i / numBolts) * Math.PI * 2;
          const boltR = (flangeRadius + pipeRadius * 1.35) / 2;
          const by = Math.cos(angle) * boltR;
          const bz = Math.sin(angle) * boltR;

          const boltGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.16, 8);
          const boltMesh = new THREE.Mesh(boltGeo, boltMaterial);
          boltMesh.rotation.z = Math.PI / 2;
          boltMesh.position.set(xPos, by, bz);
          group.add(boltMesh);
        }
      });
    };

    // Helper for Handwheel (spoke wheel on top)
    const addHandwheel = (yPos: number, radius = 0.55, rimRadius = 0.045) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.y = yPos;

      // Outer rim
      const torusGeo = new THREE.TorusGeometry(radius, rimRadius, 16, 40);
      const torusMesh = new THREE.Mesh(torusGeo, trimMaterial);
      torusMesh.rotation.x = Math.PI / 2;
      wheelGroup.add(torusMesh);

      // Center Hub
      const hubGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.1, 16);
      const hubMesh = new THREE.Mesh(hubGeo, trimMaterial);
      wheelGroup.add(hubMesh);

      // 4 Spokes
      const numSpokes = 4;
      for (let i = 0; i < numSpokes; i++) {
        const spokeGeo = new THREE.CylinderGeometry(0.025, 0.025, radius, 8);
        const spokeMesh = new THREE.Mesh(spokeGeo, trimMaterial);
        spokeMesh.rotation.z = (i * Math.PI) / (numSpokes / 2);
        spokeMesh.position.x = (Math.sin(spokeMesh.rotation.z) * radius) / 2;
        spokeMesh.position.z = (Math.cos(spokeMesh.rotation.z) * radius) / 2;
        wheelGroup.add(spokeMesh);
      }

      group.add(wheelGroup);
    };

    // Helper for Quarter-turn Lever Handle (for Ball & Butterfly)
    const addLeverHandle = (yPos: number) => {
      const leverGroup = new THREE.Group();
      leverGroup.position.y = yPos;

      // Stem nut
      const nutGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 6);
      const nutMesh = new THREE.Mesh(nutGeo, boltMaterial);
      leverGroup.add(nutMesh);

      // Metal lever bar
      const barGeo = new THREE.BoxGeometry(0.95, 0.04, 0.09);
      const barMesh = new THREE.Mesh(barGeo, trimMaterial);
      barMesh.position.x = 0.45;
      leverGroup.add(barMesh);

      // Vinyl yellow/blue safety grip sleeve
      const gripGeo = new THREE.BoxGeometry(0.5, 0.06, 0.11);
      const gripMat = new THREE.MeshStandardMaterial({
        color: 0xfacc15,
        roughness: 0.4,
        metalness: 0.1,
        wireframe: wire,
      });
      const gripMesh = new THREE.Mesh(gripGeo, gripMat);
      gripMesh.position.x = 0.68;
      leverGroup.add(gripMesh);

      group.add(leverGroup);
    };

    // Category Specific Geometries:
    if (cat === 'ball') {
      // 1. BALL VALVE: Spherical central body with quarter-turn lever
      addFlangedEnds(1.6, 0.65, 0.35);

      // Central sphere
      const sphereGeo = new THREE.SphereGeometry(0.48, 32, 24);
      const sphereMesh = new THREE.Mesh(sphereGeo, bodyMaterial);
      sphereMesh.castShadow = true;
      group.add(sphereMesh);

      // Neck
      const neckGeo = new THREE.CylinderGeometry(0.16, 0.18, 0.45, 24);
      const neckMesh = new THREE.Mesh(neckGeo, bodyMaterial);
      neckMesh.position.y = 0.45;
      group.add(neckMesh);

      // Lever
      addLeverHandle(0.7);

    } else if (cat === 'butterfly') {
      // 2. BUTTERFLY VALVE: Wafer/lug thin body + vertical disc shaft
      const waferLength = 0.55;
      const waferRadius = 0.68;

      const bodyGeo = new THREE.CylinderGeometry(waferRadius, waferRadius, waferLength, 32);
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMaterial);
      bodyMesh.rotation.z = Math.PI / 2;
      bodyMesh.castShadow = true;
      group.add(bodyMesh);

      // Inner flow bore cutout representation
      const boreGeo = new THREE.CylinderGeometry(0.46, 0.46, waferLength + 0.02, 32);
      const boreMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
      const boreMesh = new THREE.Mesh(boreGeo, boreMat);
      boreMesh.rotation.z = Math.PI / 2;
      group.add(boreMesh);

      // Central Disc (partially open angle)
      const discGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.04, 32);
      const discMesh = new THREE.Mesh(discGeo, trimMaterial);
      discMesh.rotation.z = Math.PI / 2;
      discMesh.rotation.y = Math.PI / 4; // 45 degree open
      group.add(discMesh);

      // Extended neck
      const neckGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.65, 24);
      const neckMesh = new THREE.Mesh(neckGeo, bodyMaterial);
      neckMesh.position.y = 0.72;
      group.add(neckMesh);

      // Top mounting ISO flange & Lever
      const topFlangeGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.06, 24);
      const topFlangeMesh = new THREE.Mesh(topFlangeGeo, flangeMaterial);
      topFlangeMesh.position.y = 1.05;
      group.add(topFlangeMesh);

      addLeverHandle(1.12);

    } else if (cat === 'check') {
      // 3. CHECK VALVE: Flanged body with hinge pin cover & flow arrow
      addFlangedEnds(1.5, 0.65, 0.35);

      // Hinge cover dome on top
      const domeGeo = new THREE.CylinderGeometry(0.3, 0.35, 0.3, 24);
      const domeMesh = new THREE.Mesh(domeGeo, flangeMaterial);
      domeMesh.position.y = 0.38;
      group.add(domeMesh);

      // Flow direction arrow indicator
      const arrowConeGeo = new THREE.ConeGeometry(0.1, 0.22, 16);
      const arrowConeMesh = new THREE.Mesh(arrowConeGeo, trimMaterial);
      arrowConeMesh.rotation.z = -Math.PI / 2;
      arrowConeMesh.position.set(0.15, 0.15, 0.38);
      group.add(arrowConeMesh);

    } else if (cat === 'safety_valve') {
      // 4. SAFETY VALVE: 90-degree angle body + tall spring bonnet casing
      // Inlet bottom flange
      const inletGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.6, 24);
      const inletMesh = new THREE.Mesh(inletGeo, bodyMaterial);
      inletMesh.position.y = -0.4;
      group.add(inletMesh);

      const inFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 24), flangeMaterial);
      inFlange.position.y = -0.7;
      group.add(inFlange);

      // Outlet horizontal side flange
      const outGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.7, 24);
      const outMesh = new THREE.Mesh(outGeo, bodyMaterial);
      outMesh.rotation.z = Math.PI / 2;
      outMesh.position.set(0.35, -0.15, 0);
      group.add(outMesh);

      const outFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.1, 24), flangeMaterial);
      outFlange.rotation.z = Math.PI / 2;
      outFlange.position.set(0.72, -0.15, 0);
      group.add(outFlange);

      // Tall Spring Bonnet Casing
      const bonnetGeo = new THREE.CylinderGeometry(0.32, 0.38, 1.1, 24);
      const bonnetMesh = new THREE.Mesh(bonnetGeo, bodyMaterial);
      bonnetMesh.position.y = 0.55;
      group.add(bonnetMesh);

      // Lifting lever on top
      const leverBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), trimMaterial);
      leverBar.rotation.z = Math.PI / 3;
      leverBar.position.set(-0.15, 1.25, 0);
      group.add(leverBar);

    } else if (cat === 'globe') {
      // 5. GLOBE VALVE: S-flow bulbous body + rising stem + handwheel
      addFlangedEnds(1.6, 0.65, 0.35);

      // Bulbous center
      const bulbGeo = new THREE.SphereGeometry(0.48, 24, 18);
      const bulbMesh = new THREE.Mesh(bulbGeo, bodyMaterial);
      bulbMesh.scale.set(1.1, 1.25, 1.1);
      group.add(bulbMesh);

      // Bonnet
      const bonnetGeo = new THREE.CylinderGeometry(0.25, 0.32, 0.5, 24);
      const bonnetMesh = new THREE.Mesh(bonnetGeo, bodyMaterial);
      bonnetMesh.position.y = 0.55;
      group.add(bonnetMesh);

      // Rising Stem
      const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.65, 16);
      const stemMesh = new THREE.Mesh(stemGeo, boltMaterial);
      stemMesh.position.y = 0.95;
      group.add(stemMesh);

      addHandwheel(1.28, 0.5);

    } else {
      // DEFAULT: GATE VALVE / RESILIENT GATE / KNIFE GATE
      addFlangedEnds(1.5, 0.65, 0.35);

      // Central rectangular wedge bonnet housing
      const wedgeHousingGeo = new THREE.BoxGeometry(0.55, 0.6, 0.72);
      const wedgeMesh = new THREE.Mesh(wedgeHousingGeo, bodyMaterial);
      wedgeMesh.position.y = 0.22;
      group.add(wedgeMesh);

      // Bolted Bonnet Oval Neck
      const bonnetGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.45, 24);
      const bonnetMesh = new THREE.Mesh(bonnetGeo, bodyMaterial);
      bonnetMesh.position.y = 0.62;
      group.add(bonnetMesh);

      // Bonnet Flange
      const bFlange = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.08, 24), flangeMaterial);
      bFlange.position.y = 0.85;
      group.add(bFlange);

      // Rising threaded stem
      const stemGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.65, 16);
      const stemMesh = new THREE.Mesh(stemGeo, boltMaterial);
      stemMesh.position.y = 1.1;
      group.add(stemMesh);

      // Handwheel
      addHandwheel(1.35, 0.58);
    }
  };

  const handleResetView = () => {
    targetRotationRef.current = { x: 0.35, y: 0.75 };
    targetZoomRef.current = 3.8;
  };

  return (
    <div className="relative w-full h-[340px] sm:h-[380px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl select-none group">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Overlay HUD Badge */}
      <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
        <div className="px-2.5 py-1 rounded-lg bg-slate-950/80 backdrop-blur border border-blue-500/40 text-blue-400 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{lang === 'vi' ? 'Mô Hình 3D Three.js Tương Tác' : 'Interactive Three.js 3D CAD'}</span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
          {valveCode}
        </span>
      </div>

      {/* Top-Right Quick Helper Guide */}
      <div className="absolute top-3 right-3 text-[10px] font-mono text-slate-400 pointer-events-none bg-slate-950/80 px-2 py-1 rounded-md border border-slate-800 hidden sm:flex items-center gap-1">
        <Compass className="w-3 h-3 text-slate-400" />
        <span>{lang === 'vi' ? 'Kéo để xoay • Cuộn để thu phóng' : 'Drag to rotate • Scroll to zoom'}</span>
      </div>

      {/* Bottom Ergonomic Control Dock (No Viewport Occlusion) */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800 shadow-2xl z-10 max-w-[94%] overflow-x-auto">
        
        {/* Auto Rotate Toggle */}
        <button
          type="button"
          onClick={() => setIsAutoRotate(!isAutoRotate)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
            isAutoRotate
              ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
          title={lang === 'vi' ? 'Tự động xoay quanh trục' : 'Auto rotate'}
        >
          <RotateCw className={`w-3.5 h-3.5 ${isAutoRotate ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">{lang === 'vi' ? 'Tự Xoay' : 'Auto Rotate'}</span>
        </button>

        {/* Wireframe Toggle */}
        <button
          type="button"
          onClick={() => setIsWireframe(!isWireframe)}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-all ${
            isWireframe
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
              : 'bg-slate-900 text-slate-400 hover:text-white'
          }`}
          title={lang === 'vi' ? 'Xem lưới cấu trúc đa giác CAD' : 'Toggle CAD Wireframe'}
        >
          <Layers className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Wireframe</span>
        </button>

        {/* Material Finish Palette Picker */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
          <Palette className="w-3.5 h-3.5 text-slate-400 ml-1 mr-0.5" />
          
          {/* Epoxy Blue */}
          <button
            type="button"
            onClick={() => setTheme('epoxy_blue')}
            className={`w-5 h-5 rounded-full transition-transform ${
              theme === 'epoxy_blue' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: '#1d4ed8' }}
            title="Sơn Epoxy Xanh (Ductile Iron)"
          />

          {/* Stainless Steel */}
          <button
            type="button"
            onClick={() => setTheme('stainless_steel')}
            className={`w-5 h-5 rounded-full transition-transform ${
              theme === 'stainless_steel' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: '#e2e8f0' }}
            title="Inox 316L (Stainless Steel)"
          />

          {/* Cast Steel WCB */}
          <button
            type="button"
            onClick={() => setTheme('cast_steel')}
            className={`w-5 h-5 rounded-full transition-transform ${
              theme === 'cast_steel' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: '#334155' }}
            title="Thép Đúc WCB (Cast Steel)"
          />

          {/* Fire Red */}
          <button
            type="button"
            onClick={() => setTheme('fire_red')}
            className={`w-5 h-5 rounded-full transition-transform ${
              theme === 'fire_red' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: '#dc2626' }}
            title="Đỏ PCCC UL/FM (Fire Red)"
          />

          {/* Bronze Gold */}
          <button
            type="button"
            onClick={() => setTheme('bronze_gold')}
            className={`w-5 h-5 rounded-full transition-transform ${
              theme === 'bronze_gold' ? 'ring-2 ring-white scale-110' : 'opacity-70 hover:opacity-100'
            }`}
            style={{ backgroundColor: '#d97706' }}
            title="Đồng Thau Bronze"
          />
        </div>

        {/* Reset Camera View */}
        <button
          type="button"
          onClick={handleResetView}
          className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={lang === 'vi' ? 'Căn giữa góc nhìn ban đầu' : 'Reset Camera'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
