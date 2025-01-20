import React, { useEffect, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; 
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

const Model = () => {
  const ref = useRef();

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load('/TESTBRUH8.glb', (gltf) => {
      if (gltf) {
        const model = gltf.scene;
        model.scale.set(0.5, 0.5, 0.5);
        model.position.set(0.3, 2.2, 0);
        model.rotation.y -= Math.PI / 4;

        model.traverse((child) => {
          if (child.isMesh) {
            const material = child.material;
            if (material) {
              console.log("Material properties:", material);
              material.emissiveIntensity = 0;
              material.emissive.setHex(0x000000);
              material.color.setHex(0x888888);
              material.metalness = 0.2;
              material.roughness = 0.7;
            }
          }
        });

        ref.current.add(model);
        console.log("Model loaded:", gltf);
      } else {
        console.log("Failed to load model.");
      }
    });
  }, []);

  return <group ref={ref} />;
};

const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement);

    controls.current.minPolarAngle = Math.PI / 4;
    controls.current.maxPolarAngle = Math.PI / 2;
    controls.current.minDistance = 5;
    controls.current.maxDistance = 15;
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.05;

    return () => controls.current.dispose();
  }, [camera, gl]);

  return null;
};

function App() {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas
        camera={{ position: [0, 5, 10], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputColorSpace: THREE.SRGBColorSpace, // Updated to SRGBColorSpace
        }}
      >
        {/* Lighting */}
        <hemisphereLight intensity={0.4} color={0xffffff} groundColor={0x888888} />
        <directionalLight position={[5, 10, 5]} intensity={1} castShadow />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />

        {/* Controls */}
        <CameraControls />

        {/* 3D Model */}
        <Model />
      </Canvas>
    </div>
  );
}

export default App;
