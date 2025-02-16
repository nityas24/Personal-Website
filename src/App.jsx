import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import './App.css';
import Model from './modelview';
import Typed from 'typed.js';
import { ScaleLoader } from "react-spinners"; // Import ScaleLoader

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
    controls.current.enableZoom = false;

    return () => controls.current.dispose();
  }, [camera, gl]);

  return null;
};

function App() {
  const [loading, setLoading] = useState(true);  // Default to true, so loading screen shows initially
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [experienceVisible, setExperienceVisible] = useState(false);
  const typedElement = useRef(null);
  const glowRef = useRef(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupContent, setPopupContent] = useState('');

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);  // Simulate model loading completion
    }, 8000); // 8 seconds or adjust to model loading time
  }, []);

  useEffect(() => {
    if (!loading) {  // Only start the typewriter after loading is done
      const typed = new Typed(typedElement.current, {
        strings: ["Hello, I'm Nitya."],
        typeSpeed: 70,
        backSpeed: 150,
        loop: false,
        showCursor: true,
        cursorChar: "| ",
        backDelay: 1000,
      });

      return () => typed.destroy();
    }
  }, [loading]);

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

  useEffect(() => {
    const handleScroll = () => {
      const projectsSection = document.getElementById("projects-section");
      if (projectsSection) {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition > projectsSection.offsetTop + 100) {
          setProjectsVisible(true);
        }
      }

      const experienceSection = document.getElementById("experience-section");
      if (experienceSection) {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition > experienceSection.offsetTop + 100) {
          setExperienceVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleButtonClick = (content) => {
    setPopupContent(content);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setPopupContent('');
  };

  return (
    <div className="App">
      <div className="glow-effect" ref={glowRef}></div>

      {popupVisible && (
        <div className="popup">
          <div className="popup-content">
            <span className="close-btn" onClick={closePopup}>&times;</span>
            {popupContent}
          </div>
        </div>
      )}

      {loading ? (  // Show ScaleLoader if loading is true
        <div className="loading-screen">
          <ScaleLoader color="#ffffff" loading={loading} size={1000} />  {/* Custom loader */}
        </div>
      ) : (
        <header className="App-header share-tech-regular">
          <h1><span ref={typedElement} className="auto-type"></span></h1>
          <p className="subheading roboto-mono-font">Welcome to my website.</p>
          <p className="description">
            I'm a Computer Engineering student at the University of Waterloo. I have an interest in frontend development, 
            cloud computing, and embedded systems. Explore my projects and experience below!
          </p>
        </header>
      )}

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

      {/* Projects Section */}
      <div id="projects-section" className={`projects-section ${projectsVisible ? "visible" : ""}`}>
        <h2 className="projects-title">Projects</h2>
        <div className="projects-container">
          <div className="project-box">Project 1</div>
          <div className="project-box">Project 2</div>
          <div className="project-box">Project 3</div>
          <div className="project-box">Project 4</div>
          <div className="project-box">Project 5</div>
          <div className="project-box">Project 6</div>
        </div>
      </div>

      {/*Experience Section */}
      <div id="experience-section" className={`experience-title ${experienceVisible ? "visible" : ""}`}>
        Experience
        <div className="experience-container">
          <div className="experience-box">Experience1</div>
          <div className="experience-box">Experience2</div>
        </div>
      </div>

      <nav className="navbar">
        <button onClick={() => {
          const aboutSection = document.getElementById("about-section");
          if (aboutSection) {
            const offset = aboutSection.getBoundingClientRect().top + window.scrollY - 50;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }}>About Me</button>

        <button onClick={() => {
          const projectsSection = document.getElementById("projects-section");
          if (projectsSection) {
            const offset = projectsSection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }}>Projects</button>

        <button onClick={() => {
          const experienceSection = document.getElementById("experience-section");
          if (experienceSection) {
            const offset = experienceSection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }}>Experience</button>

        <button onClick={() => handleButtonClick('Connect Content')}>Connect</button>
      </nav>
    </div>
  );
}

export default App;
