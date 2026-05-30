import React, { useState, useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
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

const Pin = ({
  position,
  pinRef,
  handlePointerOver,
  handlePointerOut,
  updateTooltipPosition,
}) => {
  const elevatedPosition = position.map((coord) => coord * 1.04); // Slightly higher

  return (
    <mesh
      position={elevatedPosition}
      ref={pinRef}
      onPointerOver={handlePointerOver}
      onPointerMove={updateTooltipPosition}
      onPointerOut={handlePointerOut}
    >
      <sphereGeometry args={[0.05, 16, 16]} />
      <meshStandardMaterial
        color="#FF9907"
        emissive="#FF9907"
        emissiveIntensity={2}
      />
    </mesh>
  );
};

const GlobeViewer = ({ props, modelPath }) => {
  const { nodes, materials } = useGLTF(modelPath);
  const firstMesh = Object.values(nodes).find((node) => node.isMesh);
  const firstMaterial = Object.values(materials)[0];

  const [globeScale, setScale] = useState(3);
  const [hovered, setHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [camera, setCamera] = useState(null);

  const pinRef = useRef();
  const canvasRef = useRef();

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

  const { ErrorBoundary, didCatch, error } = useErrorBoundary();

  // FIXED Coordinate System
  const to3DCoordinates = (latitude, longitude, radius = globeScale) => {
    const phi = (90 - latitude) * (Math.PI / 180);
    const theta = (longitude + 20) * (Math.PI / 20);   // ← Adjusted for your model

    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);

    return [z, y, -x];
  };

  // Hyderabad, Telangana, India
  const pinPosition = to3DCoordinates(17.3850, 78.4867);

  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);

  const updateTooltipPosition = (event) => {
    if (!camera || !pinRef.current) return;
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const pinWorldPosition = new THREE.Vector3();
    pinRef.current.getWorldPosition(pinWorldPosition);

    const screenPosition = pinWorldPosition.project(camera);
    const x = (screenPosition.x + 1) * (canvasRect.width / 2);
    const y = -(screenPosition.y - 1) * (canvasRect.height / 2);

    setTooltipPosition({ x, y });
  };

  return didCatch ? (
    <div>Error: {error.message}</div>
  ) : (
    <div style={{ width: 400, height: 400, position: "relative" }}>
      <Canvas
        ref={canvasRef}
          onCreated={({ camera: cam }) => setCamera(cam)}
          fallback={<div>Sorry, no WebGL supported!</div>}
      >
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <RotatingGroup {...props} rotation={[-Math.PI / 2, 0, 0]}>
          <mesh
            geometry={firstMesh.geometry}
            material={firstMaterial}
              scale={[globeScale, globeScale, globeScale]}
          />
            {/* <Pin
            position={pinPosition}
            pinRef={pinRef}
            handlePointerOver={handlePointerOver}
            handlePointerOut={handlePointerOut}
            updateTooltipPosition={updateTooltipPosition}
          /> */}
        </RotatingGroup>

        <EffectComposer>
            <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.3} intensity={1} />
        </EffectComposer>

          <OrbitControls enableZoom={false} />
      </Canvas>

      {hovered && (
        <div
          style={{
            position: "absolute",
            top: `${tooltipPosition.y}px`,
            left: `${tooltipPosition.x}px`,
            transform: "translate(-50%, -100%)",
              background: "rgba(0, 0, 0, 0.85)",
            color: "white",
              padding: "6px 12px",
              borderRadius: "6px",
            fontSize: "14px",
            pointerEvents: "none",
              zIndex: 100,
          }}
        >
            Hyderabad, Telangana, India
        </div>
      )}
    </div>
  );
};

export default GlobeViewer;