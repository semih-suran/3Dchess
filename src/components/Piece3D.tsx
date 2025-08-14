import { useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion-3d';
import type { Piece } from '@/types';
import * as THREE from 'three';
import { useMemo } from 'react';

useGLTF.preload('/assets/models/king.glb');
useGLTF.preload('/assets/models/queen.glb');
useGLTF.preload('/assets/models/castle.glb');
useGLTF.preload('/assets/models/bishop.glb');
useGLTF.preload('/assets/models/knight.glb');
useGLTF.preload('/assets/models/pawn.glb');

const pieceFileMap: Record<string, string> = {
  p: 'pawn.glb',
  r: 'castle.glb',
  n: 'knight.glb',
  b: 'bishop.glb',
  q: 'queen.glb',
  k: 'king.glb',
};

interface Piece3DProps {
  piece: Piece;
  position: [number, number, number];
  onClick: () => void;
  scale?: number;
  isSelected?: boolean;
}

export const Piece3D = ({ piece, position, onClick, scale = 1.2, isSelected = false }: Piece3DProps) => {
  const modelFile = pieceFileMap[piece.type];
  const { scene } = useGLTF(`/assets/models/${modelFile}`);

  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: piece.color === 'w' ? '#ffffff' : '#505050',
      metalness: 0.3,
      roughness: 0.6,
    });
  }, [piece.color]);

  const coloredScene = useMemo(() => {
    const newScene = scene.clone();
    newScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    return newScene;
  }, [scene, material]);

  return (
    <motion.group
      onClick={onClick}
      animate={{
        x: position[0],
        y: position[1] + (isSelected ? 0.5 : 0),
        z: position[2],
        scale: isSelected ? scale * 1.1 : scale,
      }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      <primitive object={coloredScene} />
    </motion.group>
  );
};
