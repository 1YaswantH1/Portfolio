import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useErrorBoundary } from "use-error-boundary";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

const RotatingGroup = ({ children, ...props }) => {
  const groupRef = useRef();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * -0.2;
    }
  });

  return (
    <group ref={groupRef} {...props}>
      {children}
    </group>
  );
};

const GlobeViewer = ({ props, modelPath }) => {
  const { nodes, materials } = useGLTF(modelPath);
  const firstMesh = Object.values(nodes).find((node) => node.isMesh);
  const firstMaterial = Object.values(materials)[0];

  const [globeScale, setScale] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width <= 768) setScale(2.25);
      else if (width <= 1024) setScale(2.5);
      else setScale(3);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (firstMaterial) {
    firstMaterial.emissive = new THREE.Color(0x33b5e5);
    firstMaterial.emissiveIntensity = 2;
    firstMaterial.side = THREE.FrontSide;
  }

  const { didCatch, error } = useErrorBoundary();

  return didCatch ? (
    <div>Error: {error.message}</div>
  ) : (
    <div style={{ width: 400, height: 400, position: "relative" }}>
        <Canvas fallback={<div>Sorry, no WebGL supported!</div>}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <RotatingGroup {...props} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh
            geometry={firstMesh.geometry}
            material={firstMaterial}
              scale={[globeScale, globeScale, globeScale]}
            />
        </RotatingGroup>

        <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.3} intensity={1} />
        </EffectComposer>

          <OrbitControls enableZoom={false} />
        </Canvas>
    </div>
  );
};

export default GlobeViewer;
