import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import './App.css';
import Model from './modelview';
import Typed from 'typed.js';
import ClipLoader from "react-spinners/ClipLoader";


const CameraControls = () => {
  const { camera, gl } = useThree();
  const controls = useRef();

  useEffect(() => {
    controls.current = new OrbitControls(camera, gl.domElement);
    controls.current.minPolarAngle = Math.PI / 3;
    controls.current.maxPolarAngle = Math.PI / 1.5;
    controls.current.minDistance = 5;
    controls.current.maxDistance = 15;
    controls.current.enableDamping = true;
    controls.current.dampingFactor = 0.05;
    controls.current.maxAzimuthAngle = Math.PI / 10;
    controls.current.minAzimuthAngle = -Math.PI / 10;

    return () => controls.current.dispose();
  }, [camera, gl]);

  return null;
};

function App() {

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {

      setLoading(false)

    }, 8000)

  }, [])




  const typedElement = useRef(null);
  const glowRef = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  useEffect(() => {
    const typed = new Typed(typedElement.current, {
      strings: ["Hello, I'm Nitya."],
      typeSpeed: 50,
      backSpeed: 150,
      loop: false,
      showCursor: true,
      cursorChar: "| ",
      backDelay: 1000,
    });

    return () => typed.destroy();
  }, []);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const glow = glowRef.current;
      if (glow) {
        glow.style.left = `${event.clientX - 250}px`;
        glow.style.top = `${event.clientY - 250}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Button click handler to open the popup
  const handleButtonClick = (content) => {
    setPopupContent(content);
    setPopupVisible(true);
  };

  // Function to close the popup
  const closePopup = () => {
    setPopupVisible(false);
    setPopupContent('');
  };

  return (
    <div className="App">

      {
        loading ?
        <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={40}
        aria-label="Loading Spinner"
        data-testid="loader"
      />

        : 
      }

      {/* Background Glow Effect */}
      <div className="glow-effect" ref={glowRef}></div>

      {/* Popup Box */}
      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            <p>{popupContent}</p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <header className="App-header share-tech-regular">
        <h1><span ref={typedElement} className="auto-type"></span></h1>
        <p className="subheading roboto-mono-font">Welcome to my website.</p>
      </header>

      {/* Canvas Section */}
      <div className="Canvas-container">
        <Canvas
          camera={{ position: [0, 5, 10], fov: 50 }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
          }}
        >
          <hemisphereLight intensity={0.8} color={0xffffff} groundColor={0x888888} />
          <directionalLight position={[5, 10, 5]} intensity={2} castShadow />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} />

          <CameraControls />
          <Model />
        </Canvas>
      </div>

      {/* Button Section */}
      <div className="button-container1">
        <button onClick={() => handleButtonClick('This is the About Me section.')}>About Me</button>
      </div>

      <div className="button-container2">
        <button onClick={() => handleButtonClick('Here is my experience section.')}>Experience</button>
      </div>

      <div className="button-container3">
        <button onClick={() => handleButtonClick('These are my projects!')}>Projects</button>
      </div>

      <div className="button-container4">
        <button onClick={() => handleButtonClick('Let’s Connect! Find me on LinkedIn.')}>Connect</button>
      </div>

      
    </div>
  );
}

export default App;
