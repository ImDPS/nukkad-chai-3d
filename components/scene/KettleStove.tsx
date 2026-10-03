"use client";

export function KettleStove() {
  return (
    <group position={[-1.0, 1.0, 0.05]}>
      <mesh position={[0, 0.07, 0]}>
        <boxGeometry args={[0.7, 0.14, 0.55]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.2, 0.24, 0.3, 24]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.46, 0]}>
        <sphereGeometry args={[0.2, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[0.3, 0.38, 0]} rotation-z={-1}>
        <coneGeometry args={[0.05, 0.22, 12]} />
        <meshStandardMaterial color="#9aa0a6" metalness={0.8} roughness={0.3} />
      </mesh>
      <mesh position={[-0.02, 0.5, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.16, 0.015, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#5b3a1e" />
      </mesh>
    </group>
  );
}
