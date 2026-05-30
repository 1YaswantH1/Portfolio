import "./App.css";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";

// Add this import at the top
import Projects from "./components/Projects";
import { FaLinkedin, FaEnvelope, FaPhone, FaGithub } from "react-icons/fa";
import NavBar from "./components/NavBar";
import BottomSectionBar from "./components/BottomSectionBar";
import { Element } from "react-scroll";
import GlobeViewer from "./components/GlobeViewer";
import Skills from "./components/SkillsComp";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ComboScene from "./components/ComboScene";

const App = () => {
  const [activeSection, setActiveSection] = useState("Home");
  const [hoveredSection, setHoveredSection] = useState(null);
  const projectsRef = useRef(null);
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0);
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [touchEnd, setTouchEnd] = useState({ x: 0, y: 0 });

  // Debounce ref to prevent rapid multi-scroll
  const scrollCooldown = useRef(false);
  const SCROLL_COOLDOWN_MS = 800;

  const minSwipeDistance = 100;

  const sections = useMemo(
    () => ["Home", "About", "Skills", "Portfolio", "Contact"],
    []
  );
  const projects = useMemo(
    () => ["Portfolio", "Emulator", "CollabBoard", "ERPPortal"],
    []
  );

  // ─── REPLACE everything from the imports down to the return() in your App.jsx ───
  // Only the hooks/logic section is shown here — keep your JSX return() unchanged.

  // 1. FIXED goToProject — defined with useCallback so it's stable in useEffect deps
  const goToProject = useCallback((direction) => {
    const next = currentProjectIndex + direction;
    if (next < 0 || next >= projects.length) return;
    setCurrentProjectIndex(next);
    const wrapper = document.getElementById("slides-wrapper");
    if (wrapper) {
      wrapper.dataset.index = next;
      wrapper.style.transform = `translateX(-${next * 100}vw)`;
    }
  }, [currentProjectIndex, projects.length]);

  // 2. FIXED scrollToSection — unchanged from yours, but shown for context
  const scrollToSection = useCallback((direction) => {
    const currentIndex = sections.findIndex(section => section === activeSection);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = 0;
    if (nextIndex >= sections.length) nextIndex = sections.length - 1;
    setCurrentProjectIndex(0);
    // Also reset the slide wrapper so it snaps back to slide 0 when re-entering Portfolio
    const wrapper = document.getElementById("slides-wrapper");
    if (wrapper) {
      wrapper.dataset.index = 0;
      wrapper.style.transform = `translateX(0)`;
    }
    document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: "smooth" });
  }, [activeSection, sections]);

  // 3. FIXED scrollToProject — directly sets transform, no scrollTo()
  const scrollToProject = useCallback((direction) => {
    const newIndex = currentProjectIndex + direction;
    if (newIndex < 0 || newIndex >= projects.length) return;
    setCurrentProjectIndex(newIndex);
    const wrapper = document.getElementById("slides-wrapper");
    if (wrapper) {
      wrapper.dataset.index = newIndex;
      wrapper.style.transform = `translateX(-${newIndex * 100}vw)`;
    }
  }, [currentProjectIndex, projects.length]);

  // 4. FIXED onWheel — key fix: boundary checks use >= not ===
  // so the FIRST scroll at boundary goes to next section, not a no-op
  useEffect(() => {
    const onWheel = (event) => {
      event.preventDefault();
      if (scrollCooldown.current) return;
      scrollCooldown.current = true;
      setTimeout(() => { scrollCooldown.current = false; }, SCROLL_COOLDOWN_MS);

      if (activeSection === "Portfolio") {
        if (event.deltaY < 0 && currentProjectIndex <= 0) {
        // At first slide, scroll up → go to previous section (Skills)
          scrollToSection(-1);
        } else if (event.deltaY > 0 && currentProjectIndex >= projects.length - 1) {
          // At last slide, scroll down → go to next section (Contact)
          scrollToSection(1);
        } else if (event.deltaY < 0) {
          scrollToProject(-1);
        } else if (event.deltaY > 0) {
          scrollToProject(1);
        }
      } else {
        if (event.deltaY > 0) scrollToSection(1);
        else scrollToSection(-1);
      }
    };

    const onTouchStart = (e) => {
      setTouchEnd({ x: 0, y: 0 });
      setTouchStart({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    };

    const onTouchMove = (e) => {
      setTouchEnd({ x: e.targetTouches[0].clientX, y: e.targetTouches[0].clientY });
    };

    const onTouchEnd = () => {
      if (!touchStart.x || !touchStart.y || !touchEnd.x || !touchEnd.y) return;
      if (scrollCooldown.current) return;

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;
      const isHorizontal = Math.abs(distanceX) > Math.abs(distanceY);

      scrollCooldown.current = true;
      setTimeout(() => { scrollCooldown.current = false; }, SCROLL_COOLDOWN_MS);

      if (isHorizontal && activeSection === "Portfolio") {
        if (distanceX > minSwipeDistance) {
          if (currentProjectIndex >= projects.length - 1) scrollToSection(1);
          else scrollToProject(1);
        } else if (distanceX < -minSwipeDistance) {
          if (currentProjectIndex <= 0) scrollToSection(-1);
          else scrollToProject(-1);
        }
      } else {
        if (distanceY > minSwipeDistance) scrollToSection(1);
        else if (distanceY < -minSwipeDistance) scrollToSection(-1);
      }
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [
    activeSection,
    scrollToSection,
    scrollToProject,
    currentProjectIndex,
    projects.length,
    touchStart.x, touchStart.y,
    touchEnd.x, touchEnd.y,
  ]);
  const handleSidebarClick = (section) => {
    document.getElementById(section).scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    const sectionsToObserve = [
      "Home",
      "About",
      "Skills",
      "Portfolio",
      "Contact",
    ];

    sectionsToObserve.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="App">
      <NavBar />

      <div className="sidebar">
        <div className="scrollbar">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`scrollbar-section ${activeSection === section ? "active" : ""
                }`}
              onClick={() => handleSidebarClick(section)}
              onMouseEnter={() => setHoveredSection(section)}
              onMouseLeave={() => setHoveredSection(null)}
              style={{
                backgroundColor:
                  activeSection === section || hoveredSection === section
                    ? "#E5E5EA"
                    : "transparent",
                color:
                  activeSection === section || hoveredSection === section
                    ? "#141416"
                    : "#E5E5EA",
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
            Full-Stack Software {" "}
            <span style={{ display: "block" }}>Developer</span>
          </h1>
          <p>
            Creating smooth digital experiences end-to-end. I have experience building user-friendly front-ends,efficient back-ends, and AI-based solutions. Whatever the need, from web development to Data science and Machine Learning, I can make it happen.
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
            Passionate about <strong>full-stack development, AI, and data science</strong>,
            I enjoy building scalable web applications and intelligent solutions that solve
            real-world problems. As a graduate with a{" "}
            <strong>B.E. in Artificial Intelligence & Data Science</strong> from
            CBIT Hyderabad, I combine technical expertise with creativity to transform
            ideas into impactful digital experiences.
            <br />
            <br />
            My experience spans <strong>front-end development</strong>,
            <strong> back-end engineering</strong>, and
            <strong> machine learning</strong>, enabling me to build complete
            end-to-end solutions. I am passionate about writing clean, efficient code
            and creating applications that are both user-friendly and performance-driven.
            <br />
            <br />
            When I'm not coding, you can find me{" "}
            <strong>
              solving LeetCode problems, exploring emerging AI technologies,
              building side projects, or experimenting with Docker and Kubernetes
            </strong>
            .
          </p>
        </div>
        <div className="model">
          <div className="image-container">
            <img
              className="circle-bg"
              src="blackBack.png"
              alt="Background circle"
            />
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

            <br />
            <br />

            My technical stack includes <strong>React.js</strong>,{" "}
            <strong>Node.js</strong>, <strong>Express.js</strong>,{" "}
            <strong>MongoDB</strong>, <strong>MySQL</strong>,{" "}
            <strong>Python</strong>, and <strong>Java</strong>. I have also
            developed machine learning and AI-powered solutions.

            <br />
            <br />

            I have experience with <strong>Docker</strong> and{" "}
            <strong>Kubernetes</strong> for containerized deployment and cloud-ready
            applications.

            <br />
            <br />

            I enjoy solving challenging problems and have completed{" "}
            <strong>300+ LeetCode problems</strong>.

            <br />
            <br />

            Explore more on my{" "}
            <a
              href="https://github.com/1YaswantH1"
              style={{ color: "#FF9907", textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>.
          </p>
        </div>
        <div className="model">
          <Skills />
        </div>
      </Element>
      {/* ── PROJECTS SECTION ── */}
      <Projects
        currentProjectIndex={currentProjectIndex}
        setCurrentProjectIndex={setCurrentProjectIndex}
        projects={projects}
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
            <FaEnvelope
              style={{ marginRight: "5px", position: "relative", top: "2px" }}
            />{" "}
            Email:{" "}
            <a
              href="mailto:chintayaswanth99@gmail.com"
              style={{ color: "#FF9907", textDecoration: "none" }}
            >
              chintayaswanth99@gmail.com
            </a>{" "}
            <br />
            <FaPhone
              style={{ marginRight: "5px", position: "relative", top: "2px" }}
            />{" "}
            Phone:{" "}
            <a
              href="tel:+917780346221"
              style={{ color: "#FF9907", textDecoration: "none" }}
            >
              +91 77803 46221
            </a>{" "}
            <br />
            <FaLinkedin
              style={{ marginRight: "5px", position: "relative", top: "2px" }}
            />{" "}
            LinkedIn:{" "}
            <a
              href="https://linkedin.com/in/yaswanth-varma-chinta-a73100262"
              style={{ color: "#FF9907", textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
            >
              Yaswanth Varma Chinta
            </a>{" "}
            <br />
            <FaGithub
              style={{ marginRight: "5px", position: "relative", top: "2px" }}
            />{" "}
            GitHub:{" "}
            <a
              href="https://github.com/1YaswantH1"
              style={{ color: "#FF9907", textDecoration: "none" }}
              target="_blank"
              rel="noopener noreferrer"
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

      <BottomSectionBar sections={sections} currentSection={activeSection} />
    </div>
  );
};

export default App;