import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

const EmissiveCircle = ({
  position = [0, 0, 0],
  scale = 1,
  color = "#FF9907",
}) => {
  const ref = useRef();

  useFrame(({ clock }) => {
    if (ref.current) {
      const pulse = 1 + Math.sin(clock.getElapsedTime() * 2) * 0.08;
      ref.current.scale.set(pulse * scale, pulse * scale, pulse * scale);
      ref.current.rotation.z += 0.003;
    }
  });

  return (
    <>
      {/* Main Ring */}
      <mesh ref={ref} position={position} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.08, 32, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.75}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Inner Glow Ring */}
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} scale={0.75}>
        <torusGeometry args={[1, 0.04, 32, 100]} />
        <meshBasicMaterial color={color} transparent opacity={0.9} />
      </mesh>
    </>
  );
};

export default EmissiveCircle;