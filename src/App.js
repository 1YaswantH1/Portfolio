import "./App.css";
import React, { useEffect, useState, useMemo, useRef } from "react";

import Projects from "./components/Projects";
import { FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa";
import NavBar from "./components/NavBar";
import BottomSectionBar from "./components/BottomSectionBar";
import { Element } from "react-scroll";
import GlobeViewer from "./components/GlobeViewer";
import Skills from "./components/SkillsComp";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const SECTIONS = ["Home", "About", "Skills", "Portfolio", "Contact"];
const PROJECTS = ["Portfolio", "ERPPortal", "Emulator", "CollabBoard"];
const COOLDOWN_MS = 850;

const App = () => {
  const [activeSection, setActiveSection] = useState("Home");
  const [hoveredSection, setHoveredSection] = useState(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);

  // Single source of truth — refs mirror state so event listeners are always fresh
  const sectionRef = useRef("Home");
  const projRef = useRef(0);
  const locked = useRef(false);

  // ── Navigate between top-level sections ───────────────────────────────────
  const goToSection = (delta) => {
    const idx = SECTIONS.indexOf(sectionRef.current);
    const next = Math.min(Math.max(idx + delta, 0), SECTIONS.length - 1);
    if (next === idx) return;

    // Reset carousel when leaving / re-entering Portfolio
    projRef.current = 0;
    setCurrentProjectIndex(0);
    const wrapper = document.getElementById("slides-wrapper");
    if (wrapper) wrapper.style.transform = "translateX(0)";

    document.getElementById(SECTIONS[next])?.scrollIntoView({ behavior: "smooth" });
  };

  // ── Navigate carousel slides ───────────────────────────────────────────────
  const goToProject = (delta) => {
    const next = projRef.current + delta;
    if (next < 0 || next >= PROJECTS.length) return;
    projRef.current = next;
    setCurrentProjectIndex(next);
    const wrapper = document.getElementById("slides-wrapper");
    if (wrapper) wrapper.style.transform = `translateX(-${next * 100}vw)`;
  };

  // ── One scroll/swipe = one step ───────────────────────────────────────────
  useEffect(() => {
    const handle = (scrollDown) => {
      if (locked.current) return;
      locked.current = true;
      setTimeout(() => { locked.current = false; }, COOLDOWN_MS);

      if (sectionRef.current === "Portfolio") {
        if (scrollDown && projRef.current < PROJECTS.length - 1) goToProject(1);
        else if (!scrollDown && projRef.current > 0) goToProject(-1);
        else if (scrollDown) goToSection(1);
        else goToSection(-1);
      } else {
        goToSection(scrollDown ? 1 : -1);
      }
    };

    const onWheel = (e) => {
      e.preventDefault();
      handle(e.deltaY > 0);
    };

    // Touch
    let tx = 0, ty = 0;
    const onTouchStart = (e) => {
      tx = e.targetTouches[0].clientX;
      ty = e.targetTouches[0].clientY;
    };
    const onTouchEnd = (e) => {
      const dx = tx - e.changedTouches[0].clientX;
      const dy = ty - e.changedTouches[0].clientY;
      if (Math.abs(dx) < 50 && Math.abs(dy) < 50) return; // too small
      if (sectionRef.current === "Portfolio" && Math.abs(dx) > Math.abs(dy)) {
        handle(dx > 0); // horizontal swipe on projects
      } else {
        handle(dy > 0); // vertical swipe anywhere
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []); // ← empty: handle() closes over refs, never stale

  // ── Track active section via IntersectionObserver ─────────────────────────
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            sectionRef.current = entry.target.id;
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const handleSidebarClick = (section) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="App">
      <NavBar />

      <div className="sidebar">
        <div className="scrollbar">
          {SECTIONS.map((section, index) => (
            <div
              key={index}
              className={`scrollbar-section ${activeSection === section ? "active" : ""}`}
              onClick={() => handleSidebarClick(section)}
              onMouseEnter={() => setHoveredSection(section)}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                backgroundColor:
                  activeSection === section || hoveredSection === section
                    ? "#E5E5EA" : "transparent",
                color:
                  activeSection === section || hoveredSection === section
                    ? "#141416" : "#E5E5EA",
              }}
            >
              {`0${index}`}
            </div>
          ))}
        </div>
      </div>

      {/* ── HOME ── */}
      <Element name="Home" className="section Home" id="Home">
        <div className="text">
          <h1>
            Full-Stack Software{" "}
            <span style={{ display: "block" }}>Developer</span>
          </h1>
          <p>
            Creating smooth digital experiences end-to-end. I have experience
            building user-friendly front-ends, efficient back-ends, and
            AI-based solutions. Whatever the need, from web development to Data
            science and Machine Learning, I can make it happen.
          </p>
        </div>
        <div className="model">
          <DotLottieReact
            src="https://lottie.host/029513f5-2f14-4324-9af0-7ad23e840554/wnYpsQVtYR.lottie"
            loop
            autoplay
            style={{ maxWidth: "400px" }}
          />
        </div>
      </Element>

      {/* ── ABOUT ── */}
      <Element name="About" className="section About" id="About">
        <div className="text">
          <h1>👋 Hi, I'm Yaswanth!</h1>
          <p>
            Passionate about{" "}
            <strong>full-stack development, AI, and data science</strong>, I
            enjoy building scalable web applications and intelligent solutions
            that solve real-world problems. As a graduate with a{" "}
            <strong>B.E. in Artificial Intelligence & Data Science</strong>{" "}
            from CBIT Hyderabad, I combine technical expertise with creativity
            to transform ideas into impactful digital experiences.
            <br /><br />
            My experience spans <strong>front-end development</strong>,
            <strong> back-end engineering</strong>, and{" "}
            <strong>machine learning</strong>, enabling me to build complete
            end-to-end solutions. I am passionate about writing clean,
            efficient code and creating applications that are both
            user-friendly and performance-driven.
            <br /><br />
            When I'm not coding, you can find me{" "}
            <strong>
              solving LeetCode problems, exploring emerging AI technologies,
              building side projects, or experimenting with Docker and Kubernetes
            </strong>.
          </p>
        </div>
        <div className="model">
          <div className="image-container">
            <img className="circle-bg" src="blackBack.png" alt="Background circle" />
            <img className="headshot" src="headshot.png" alt="Yaswanth" />
          </div>
        </div>
      </Element>

      {/* ── SKILLS ── */}
      <Element name="Skills" className="section Skills" id="Skills">
        <div className="text">
          <h1>Skills & Experience</h1>
          <p>
            I am a <strong>Full-Stack Developer</strong> with expertise in{" "}
            <strong>Artificial Intelligence</strong> and{" "}
            <strong>Data Science</strong>, passionate about building scalable,
            user-centric applications.
            <br /><br />
            My technical stack includes <strong>React.js</strong>,{" "}
            <strong>Node.js</strong>, <strong>Express.js</strong>,{" "}
            <strong>MongoDB</strong>, <strong>MySQL</strong>,{" "}
            <strong>Python</strong>, and <strong>Java</strong>. I have also
            developed machine learning and AI-powered solutions.
            <br /><br />
            I have experience with <strong>Docker</strong> and{" "}
            <strong>Kubernetes</strong> for containerized deployment and
            cloud-ready applications.
            <br /><br />
            I enjoy solving challenging problems and have completed{" "}
            <strong>300+ LeetCode problems</strong>.
            <br /><br />
            Explore more on my{" "}
            <a
              href="https://github.com/1YaswantH1"
              style={{ color: "#FF9907", textDecoration: "none" }}
              target="_blank" rel="noopener noreferrer"
            >
              GitHub
            </a>.
          </p>
        </div>
        <div className="model">
          <Skills />
        </div>
      </Element>

      {/* ── PROJECTS ── */}
      <Projects
        currentProjectIndex={currentProjectIndex}
        setCurrentProjectIndex={setCurrentProjectIndex}
        projects={PROJECTS}
        goToProject={goToProject}
      />

      {/* ── CONTACT ── */}
      <Element name="Contact" className="section Contact" id="Contact">
        <div className="text">
          <h2>Let's Connect!</h2>
          <p>
            Have an idea, project, or opportunity you'd like to discuss? Feel
            free to reach out! I'm always open to collaborating, building
            innovative solutions, and exploring new challenges in tech.
          </p>
          <p>
            <FaEnvelope style={{ marginRight: "5px", position: "relative", top: "2px" }} />{" "}
            Email:{" "}
            <a href="mailto:chintayaswanth99@gmail.com" style={{ color: "#FF9907", textDecoration: "none" }}>
              chintayaswanth99@gmail.com
            </a>
            <br />
            <FaLinkedin style={{ marginRight: "5px", position: "relative", top: "2px" }} />{" "}
            LinkedIn:{" "}
            <a
              href="https://linkedin.com/in/yaswanth-varma-chinta-a73100262"
              style={{ color: "#FF9907", textDecoration: "none" }}
              target="_blank" rel="noopener noreferrer"
            >
              Yaswanth Varma Chinta
            </a>
            <br />
            <FaGithub style={{ marginRight: "5px", position: "relative", top: "2px" }} />{" "}
            GitHub:{" "}
            <a
              href="https://github.com/1YaswantH1"
              style={{ color: "#FF9907", textDecoration: "none" }}
              target="_blank" rel="noopener noreferrer"
            >
              1YaswantH1
            </a>
          </p>
          <p>Looking forward to connecting!</p>
        </div>
        <div className="model">
          <GlobeViewer modelPath="/models/globe.glb" />
        </div>
      </Element>

      <BottomSectionBar sections={SECTIONS} currentSection={activeSection} />
    </div>
  );
};

export default App;