import React from 'react';
import { useGLTF } from '@react-three/drei';

function Model() {
  // Load the GLTF model
  const { scene } = useGLTF('/TESTBRUH8'); // Ensure the model is in the public folder

  // Return the 3D scene to render
  return <primitive object={scene} />;
}

export default Model;
