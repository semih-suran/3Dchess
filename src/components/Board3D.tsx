import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Circle } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Piece3D } from './Piece3D';
import { useChessGame } from '@/hooks/useChessGame';
import * as THREE from 'three';
import { useMemo } from 'react';
import { Chess } from 'chess.js';

// Board constants
const BOARD_SIZE = 8;
const SQUARE_SIZE = 2.2;
const BOARD_OFFSET = (BOARD_SIZE * SQUARE_SIZE) / 2 - SQUARE_SIZE / 2;

const boardPositionToVector = (square: string): [number, number, number] => {
  const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
  const row = parseInt(square[1], 10) - 1;
  return [col * SQUARE_SIZE - BOARD_OFFSET, 0, -(row * SQUARE_SIZE - BOARD_OFFSET)];
};

const Chessboard = ({ onSquareClick }: { onSquareClick: (square: string) => void }) => {
  const squares = useMemo(() => {
    const s = [];
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        const squareName = `${String.fromCharCode('a'.charCodeAt(0) + col)}${row + 1}`;
        s.push({
          key: squareName,
          position: boardPositionToVector(squareName),
          color: (row + col) % 2 === 0 ? '#b58863' : '#f0d9b5',
        });
      }
    }
    return s;
  }, []);

  return (
    <group>
      {squares.map(({ key, position, color }) => (
        <mesh key={key} position={position} rotation={[-Math.PI / 2, 0, 0]} onClick={() => onSquareClick(key)}>
          <planeGeometry args={[SQUARE_SIZE, SQUARE_SIZE]} />
          <meshStandardMaterial color={color} />
        </mesh>
      ))}
    </group>
  );
};

interface Board3DProps {
  game: ReturnType<typeof useChessGame>;
  environmentFile: string;
}

export const Board3D = ({ game, environmentFile }: Board3DProps) => {
  const { fen, selectedSquare, legalMoves, selectSquare, makeMove } = game;

  const pieces = useMemo(() => {
    const board = new Chess(fen).board();
    return board.flat().filter(p => p !== null);
  }, [fen]);

  const handleSquareClick = (square: string) => {
    if (selectedSquare) {
      const isLegal = legalMoves.some(m => m.to === square);
      if (isLegal) {
        makeMove(selectedSquare, square);
      } else {
        selectSquare(square);
      }
    } else {
      selectSquare(square);
    }
  };

  return (
    <Canvas>
      <PerspectiveCamera makeDefault position={[0, 15, 15]} fov={50} />
      {/* Increased maxDistance to allow zooming out further */}
      <OrbitControls enablePan={false} minDistance={10} maxDistance={50} maxPolarAngle={Math.PI / 2.2} />

      <Environment files={`/assets/env/${environmentFile}.hdr`} background={true} />
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 7.5]} intensity={1.5} castShadow />

      <group>
        <Chessboard onSquareClick={handleSquareClick} />
        {pieces.map(piece => (
          piece && <Piece3D
            key={`${piece.type}-${piece.square}`}
            piece={piece}
            position={boardPositionToVector(piece.square)}
            onClick={() => selectSquare(piece.square)}
            scale={0.486}
            isSelected={selectedSquare === piece.square}
          />
        ))}
        {legalMoves.map(move => {
          const pos = boardPositionToVector(move.to);
          return (
            <Circle key={move.to} args={[SQUARE_SIZE / 4, 32]} position={[pos[0], 0.05, pos[2]]} rotation={[-Math.PI / 2, 0, 0]}>
              <meshBasicMaterial color="green" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </Circle>
          );
        })}
      </group>

      <ContactShadows position={[0, -0.1, 0]} opacity={0.75} scale={40} blur={1} far={10} />

      <EffectComposer>
        <Bloom luminanceThreshold={0.8} luminanceSmoothing={0.9} height={300} intensity={1.5} />
      </EffectComposer>
    </Canvas>
  );
};
