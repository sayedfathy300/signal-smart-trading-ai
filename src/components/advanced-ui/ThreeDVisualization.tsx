
import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface MarketDataPoint {
  price: number;
  volume: number;
  timestamp: number;
  signal: 'BUY' | 'SELL' | 'HOLD';
}

interface ThreeDVisualizationProps {
  data: MarketDataPoint[];
  lang: 'en' | 'ar';
}

const MarketDataMesh: React.FC<{ data: MarketDataPoint[] }> = ({ data }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  const points = useMemo(() => {
    return data.map((point, index) => {
      const x = (index - data.length / 2) * 0.2;
      const y = (point.price - 50000) / 1000;
      const z = (point.volume - 1000000) / 500000;
      return new THREE.Vector3(x, y, z);
    });
  }, [data]);

  const lineGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [points]);

  return (
    <group ref={meshRef}>
      {/* Price line */}
      <line geometry={lineGeometry}>
        <lineBasicMaterial color="#00ff88" linewidth={2} />
      </line>
      
      {/* Data points */}
      {data.map((point, index) => {
        const x = (index - data.length / 2) * 0.2;
        const y = (point.price - 50000) / 1000;
        const z = (point.volume - 1000000) / 500000;
        
        const color = point.signal === 'BUY' ? '#00ff88' : 
                     point.signal === 'SELL' ? '#ff4444' : '#ffaa00';
        
        return (
          <Sphere key={index} position={[x, y, z]} args={[0.05]}>
            <meshPhongMaterial color={color} />
          </Sphere>
        );
      })}
      
      {/* Axes */}
      <Line 
        points={[[-5, 0, 0], [5, 0, 0]]} 
        color="#666666" 
        lineWidth={1}
      />
      <Line 
        points={[[0, -5, 0], [0, 5, 0]]} 
        color="#666666" 
        lineWidth={1}
      />
      <Line 
        points={[[0, 0, -5], [0, 0, 5]]} 
        color="#666666" 
        lineWidth={1}
      />
      
      {/* Labels */}
      <Text 
        position={[5.2, 0, 0]} 
        fontSize={0.3} 
        color="#888888"
        anchorX="left"
      >
        Time
      </Text>
      <Text 
        position={[0, 5.2, 0]} 
        fontSize={0.3} 
        color="#888888"
        anchorX="center"
      >
        Price
      </Text>
      <Text 
        position={[0, 0, 5.2]} 
        fontSize={0.3} 
        color="#888888"
        anchorX="center"
      >
        Volume
      </Text>
    </group>
  );
};

const ThreeDVisualization: React.FC<ThreeDVisualizationProps> = ({ data, lang }) => {
  return (
    <div className="w-full h-96 bg-black rounded-lg overflow-hidden">
      <Canvas camera={{ position: [10, 5, 10], fov: 60 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <MarketDataMesh data={data} />
        
        <OrbitControls 
          enableZoom={true} 
          enablePan={true} 
          enableRotate={true}
          minDistance={5}
          maxDistance={50}
        />
        
        <gridHelper args={[20, 20, '#333333', '#333333']} />
      </Canvas>
    </div>
  );
};

export default ThreeDVisualization;
