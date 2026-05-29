import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import FloatingObject from "./FloatingObject";
import EmissiveCircle from "./EmissiveCircle";

function ComboScene() {
  const [scales, setScales] = useState({
    keyboard: 2.2,
    phone: 1.8,
    controller: 1.5,
  });

  const [positions, setPositions] = useState({
    keyboard: [-2, 0.1, 0],
    phone: [0, 0.8, -1],
    controller: [2, -0.3, 0],
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width <= 480) {
        setScales({ keyboard: 1.7, phone: 1.3, controller: 1.1 });
        setPositions({
          keyboard: [-1.2, 0, 0],
          phone: [0, 0.5, -1.2],
          controller: [1.2, -0.1, 0],
        });
      } else if (width <= 768) {
        setScales({ keyboard: 1.9, phone: 1.5, controller: 1.2 });
        setPositions({
          keyboard: [-1.5, 0.1, 0],
          phone: [0, 0.7, -1],
          controller: [1.5, -0.2, 0],
        });
      } else {
        setScales({ keyboard: 2.2, phone: 1.8, controller: 1.5 });
        setPositions({
          keyboard: [-2, 0.1, 0],
          phone: [0, 0.8, -1],
          controller: [2, -0.3, 0],
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, 3, 5]} intensity={0.8} />

      {/* Keyboard */}
      <FloatingObject
        modelPath="models/keyboard.glb"
        position={positions.keyboard}
        scale={scales.keyboard}
        initialRotation={[0, Math.PI / 4, 0]}
        rotationSpeed={0.4}
        floatSpeed={1}
      />
      <EmissiveCircle
        position={[positions.keyboard[0], -1.4, 0]}
        color="#5DE2E7"
      />

      {/* Phone */}
      <FloatingObject
        modelPath="models/phone.glb"
        position={positions.phone}
        scale={scales.phone}
        rotationSpeed={-0.6}
        floatSpeed={1.4}
      />
      <EmissiveCircle
        position={[positions.phone[0], positions.phone[1] - 0.8, positions.phone[2]]}
        color="#7DDA58"
      />

      {/* Controller */}
      <FloatingObject
        modelPath="models/controller.glb"
        position={positions.controller}
        scale={scales.controller}
        rotationSpeed={0.5}
        floatSpeed={0.9}
      />
      <EmissiveCircle
        position={[positions.controller[0], positions.controller[1] - 0.8, 0]}
        color="#FF9907"
      />

      {/* Bloom — must be inside Canvas, not inside a mesh */}
      <EffectComposer>
        <Bloom
          intensity={2}
          luminanceThreshold={0}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </Canvas>
  );
}

export default ComboScene;