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

    controls.current.target.set(0, 0, 0); // x, y, z coordinates of the new pivot point


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

      const connectSection = document.getElementById("connect-section");
      if (connectSection) {
        const scrollPosition = window.scrollY + window.innerHeight;
        if (scrollPosition > connectSection.offsetTop + 100) {
          setExperienceVisible(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleProjectClick = (content) => {
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
          <div className="project-box" onClick={() => handleProjectClick('Sentiment Analysis details...')}>
            <img src="Sentiment1.png" alt="Sentiment Analysis" className="project-image" />
            <div className="project-text">Sentiment Analysis 📝</div>
            <div className="project-description-text">Scikit-Learn ・ Streamlit ・ Python</div>

          </div>
          <div className="project-box" onClick={() => handleProjectClick('Personal Portfolio details...')}>
            <img src="Portfolio.png" alt="Personal Portfolio" className="project-image" />
            <div className="project-text">Personal Portfolio 🎨</div>
            <div className="project-description-text">React・ Blender ・ Three.js ・ HTML/CSS </div>

          </div>
          <div className="project-box" onClick={() => handleProjectClick('Route Optimizer details...')}>
            <img src="firstrespond.png" alt="Route Optimizer" className="project-image" />
            <div className="project-text">Route Optimizer 📍</div>
            <div className="project-description-text">Python・ BigQuery ・ Flask ・ Google Cloud </div>

          </div>
          <div className="project-box" onClick={() => handleProjectClick('STM32 Project details...')}>
            <img src="STM.jpg" alt="STM32 Project" className="project-image" />
            <div className="project-text">STM32 Project 💧</div>
            <div className="project-description-text">STM32・ CubeIDE ・ Project Management </div>

            
          </div>
          <div className="project-box" onClick={() => handleProjectClick('Garden Gaze details...')}>
            <img src="garden.png" alt="Garden Gaze" className="project-image" />
            <div className="project-text">Garden Gaze 🌱</div>
            <div className="project-description-text">Streamlit・ Python ・ APIs ・ HTML/CSS  </div>
        
          </div>
          <div className="project-box" onClick={() => handleProjectClick('Coming Soon! details...')}>
            <img src="coming-soon-image.jpg" alt="Coming Soon" className="project-image" />
            <div className="project-text"> Spotify Sentiment Playlist 🎵</div>
          </div>
          <div className="project-box" onClick={() => handleProjectClick('Garden Gaze details...')}>
            <img src="coming-soon-image.png" alt="Coming Soon 2" className="project-image" />
            <div className="project-text">Fraud Payment Detection 📊</div>
          </div>
        </div>
      </div> 
{/* Experience Section */}
<div id="experience-section" className={`experience-title ${experienceVisible ? "visible" : ""}`}>
  Experience
  <div className="experience-container">
    {/* Microsoft WEA Experience */}
    <div className="experience-box">
  <img 
    src="thingy(2).png" 
    alt="UW Logo" 
    className="experience-image" 
    style={{ width: "100px", height: "auto", borderRadius: "10px", marginTop: "-50px" }} 
  />
  <div className="experience-text">
    <h2 style={{ fontSize: "27px", fontWeight: "bold" }}>Microsoft WEA: Azure & Cloud</h2>

    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      University of Waterloo
    </p>
    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      Jan 2025 - Present
    </p>
  </div>


<div className="experience-sub-text">
    <ul className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal", lineHeight: "2.5" }}>
      <li>Collaborating with a team to develop a project and presentation for an employer, designing and implementing project pipeline using Microsoft AI and Azure tools</li>
      <li>Achieved AI-900 and AZ-900 certifications, showcasing an understanding of cloud computing concepts with artificial intelligence principles</li>
   </ul>
</div>

</div>



 {/* Swim Experience */}
 <div className="experience-box">
  <img 
    src="logo(1).png" 
    alt="UW Logo" 
    className="experience-image" 
    style={{ width: "100px", height: "auto", borderRadius: "10px", marginTop: "-50px" }} 
  />
  <div className="experience-text">
    <h2 style={{ fontSize: "27px", fontWeight: "bold" }}>Aquatics Instructor</h2>

    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      City of Brampton
    </p>
    <p className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal" }}>
      Sept 2024 - Jan 2025
    </p>
  </div>

<div className="experience-sub-text">
<ul className="subheading roboto-mono-font" style={{ fontSize: "15px", fontWeight: "normal", lineHeight: "2.5" }}>
<li>Created lesson plans tailored to different skill levels and ages</li>
      <li>Taught proper form while offering constructive feedback for improvement of students, 85% pass rate</li>
   </ul>
</div>

</div>
</div>
</div>


      {/*Connect Section */}
      <div id="connect-section" className={`connect-title ${experienceVisible ? "visible" : ""}`}>
        Connect with Me
        <div className="connect-container">
          <div className="connect-box" onClick={() => window.open('mailto:n53sharm@uwaterloo.ca', '_blank')}>
          <i className="fas fa-envelope" style={{ fontSize: '20px', marginRight: '8px' }}></i> Email
          </div>
          <div className="connect-box" onClick={() => window.open('https://www.linkedin.com/in/nitya-sharma24/', '_blank')}>
            <i className="fab fa-linkedin" style={{ fontSize: '20px', marginRight: '8px' }}></i> LinkedIn
          </div>
          <div className="connect-box" onClick={() => window.open('https://github.com/nityas24', '_blank')}>
            <i className="fab fa-github" style={{ fontSize: '20px', marginRight: '8px' }}></i> GitHub
          </div>
        </div>
      </div>

      <nav className="navbar">
      <button onClick={() => {
  window.scrollTo({ top: 0, behavior: "smooth" });
}}>
  About Me
</button>

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

        <button onClick={() => {
          const connectSection = document.getElementById("connect-section");
          if (connectSection) {
            const offset = connectSection.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top: offset, behavior: "smooth" });
          }
        }}>Connect</button>
      </nav>
    </div>
  );
}

export default App;
