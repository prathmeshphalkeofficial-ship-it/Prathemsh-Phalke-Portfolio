import { useEffect, useRef } from "react";
import * as THREE from "three";
import setCharacter from "./Character/utils/character";
import setLighting from "./Character/utils/lighting";
import { handleHeadRotation } from "./Character/utils/mouseUtils";

const ChatCharacter = () => {
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef(new THREE.Scene());

  useEffect(() => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const width = rect.width || 150;
    const height = rect.height || 150;
    const aspect = width / height;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    canvasRef.current.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(30, aspect, 0.1, 1000);
    // Focus on head/upper body
    camera.position.set(0, 15.5, 5); 
    camera.lookAt(0, 15.5, 0);

    const scene = sceneRef.current;
    let headBone: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer;
    const clock = new THREE.Clock();

    setLighting(scene);
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    loadCharacter().then((gltf) => {
      if (gltf) {
        const charScene = gltf.scene;
        scene.add(charScene);
        
        // Find the head bone for rotation
        headBone = charScene.getObjectByName("spine006") || null;
        
        if (gltf.animations && gltf.animations.length > 0) {
          mixer = new THREE.AnimationMixer(charScene);
          const idleAction = mixer.clipAction(gltf.animations[0]); // Assume first animation is idle
          idleAction.play();
        }
      }
    });

    let mouse = { x: 0, y: 0 };
    const onMouseMove = (event: MouseEvent) => {
      // Normalize mouse to -1 to 1 based on viewport
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x * 0.5, // Dampen rotation
          mouse.y * 0.5,
          0.1,
          0.2,
          THREE.MathUtils.lerp
        );
      }

      if (mixer) {
        mixer.update(clock.getDelta());
      }
      
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      if (canvasRef.current) {
        canvasRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="anime-character-wrapper" ref={canvasRef} style={{ overflow: "hidden" }}>
      {/* 3D Scene will be injected here */}
    </div>
  );
};

export default ChatCharacter;
