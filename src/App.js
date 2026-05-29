import "./App.css";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
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

  const scrollToSection = useCallback(
    (direction) => {
      const currentIndex = sections.findIndex(
        (section) => section === activeSection
      );
      let nextIndex = currentIndex + direction;

      if (nextIndex < 0) nextIndex = 0;
      if (nextIndex >= sections.length) nextIndex = sections.length - 1;

      setCurrentProjectIndex(0);
      document
        .getElementById(sections[nextIndex])
        .scrollIntoView({ behavior: "smooth" });
    },
    [activeSection, sections]
  );

  const scrollToProject = useCallback(
    (direction) => {
      const container = document.getElementById("Projects");
      if (container) {
        const containerWidth = container.offsetWidth;
        const scrollPosition = container.scrollLeft;
        const newIndex = currentProjectIndex + direction;

        if (newIndex >= 0 && newIndex < projects.length) {
          setCurrentProjectIndex(newIndex);

          const scrollAmount = direction * containerWidth;
          container.scrollTo({
            left: scrollPosition + scrollAmount,
            behavior: "smooth",
          });
        }
      }
    },
    [currentProjectIndex, projects.length]
  );

  useEffect(() => {
    const onWheel = (event) => {
      event.preventDefault();

      // Debounce: ignore scroll events during cooldown
      if (scrollCooldown.current) return;
      scrollCooldown.current = true;
      setTimeout(() => {
        scrollCooldown.current = false;
      }, SCROLL_COOLDOWN_MS);

      if (activeSection === "Portfolio") {
        if (currentProjectIndex === 0 && event.deltaY < 0) {
          scrollToSection(-1);
        } else if (
          currentProjectIndex === projects.length - 1 &&
          event.deltaY > 0
        ) {
          scrollToSection(1);
        } else {
          if (event.deltaY < 0) {
            scrollToProject(-1);
          } else if (event.deltaY > 0) {
            scrollToProject(1);
          }
        }
      } else {
        if (event.deltaY > 0) {
          scrollToSection(1);
        } else {
          scrollToSection(-1);
        }
      }
    };

    const onTouchStart = (e) => {
      setTouchEnd({ x: 0, y: 0 });
      setTouchStart({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const onTouchMove = (e) => {
      setTouchEnd({
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      });
    };

    const onTouchEnd = () => {
      if (!touchStart.x || !touchStart.y || !touchEnd.x || !touchEnd.y) return;
      if (scrollCooldown.current) return;

      const distanceX = touchStart.x - touchEnd.x;
      const distanceY = touchStart.y - touchEnd.y;

      const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);
      const isVerticalSwipe = !isHorizontalSwipe;

      scrollCooldown.current = true;
      setTimeout(() => {
        scrollCooldown.current = false;
      }, SCROLL_COOLDOWN_MS);

      if (isHorizontalSwipe && activeSection === "Portfolio") {
        if (distanceX > minSwipeDistance) {
          if (currentProjectIndex === projects.length - 1) {
            scrollToSection(1);
          } else {
            scrollToProject(1);
          }
        } else if (distanceX < -minSwipeDistance) {
          if (currentProjectIndex === 0) {
            scrollToSection(-1);
          } else {
            scrollToProject(-1);
          }
        }
      } else if (isVerticalSwipe) {
        if (distanceY > minSwipeDistance) {
          scrollToSection(1);
        } else if (distanceY < -minSwipeDistance) {
          scrollToSection(-1);
        }
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
    touchStart.x,
    touchStart.y,
    touchEnd.x,
    touchEnd.y,
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

      {/* ── PORTFOLIO (horizontal scroll) ── */}
      <Element
        name="Projects"
        className="section Projects"
        id="Projects"
        ref={projectsRef}
      >
        {/* Slide 1 – intro */}
        <Element
          name="Portfolio"
          className="section Inner Portfolio"
          id="Portfolio"
        >
          <div className="text">
            <h1>Portfolio & Projects</h1>
            <p>
              Here are some of the projects I've worked on, showcasing my skills
              in full-stack web development, AI/ML, and DevOps. From
              collaborative tools to AI-powered surveillance systems, I love
              bringing ideas to life through code. If you want to see more,
              check out my{" "}
              <a
                href="https://github.com/1YaswantH1"
                style={{ color: "#FF9907", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              ! <br />
              <button
                className="project-button"
                onClick={() =>
                  document
                    .getElementById("Emulator")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                AI Surveillance {">"}
              </button>
            </p>
          </div>
          <div className="model">
            <ComboScene />
          </div>
        </Element>

        {/* Slide 2 – AI Surveillance */}
        <Element
          name="Emulator"
          className="section Inner Emulator"
          id="Emulator"
        >
          <div className="text">
            <h1>AI Surveillance Enhancement</h1>
            <p>
              An AI-based CCTV restoration system achieving{" "}
              <strong>40 dB PSNR</strong> and <strong>0.95 SSIM</strong>.
              Applied GAN-based inpainting, denoising, motion segmentation, and
              colorization for degraded footage reconstruction. Utilized{" "}
              <strong>VGG-19</strong> and <strong>SIFT</strong> for enhanced
              structural and visual detail preservation.
              <br />
              <a
                href="https://github.com/1YaswantH1/Surveillance_Restoration_System"
                style={{ color: "#FF9907", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repo
              </a>
              <br />
              <button
                className="project-button"
                onClick={() =>
                  document
                    .getElementById("CollabBoard")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                Collab Board {">"}
              </button>
            </p>
          </div>
          <div className="model">
            <img
              className="responsive-image"
              src="images/surveillance.png"
              alt="AI Surveillance Enhancement System"
            />
          </div>
        </Element>

        {/* Slide 3 – Collab Board */}
        <Element
          name="CollabBoard"
          className="section Inner CollabBoard"
          id="CollabBoard"
        >
          <div className="text">
            <h1>Collab Board</h1>
            <p>
              A collaborative Kanban task management platform with real-time
              synchronization, team communication, and deadline tracking. Built
              with <strong>React.js, Node.js, MongoDB, Socket.io</strong>, and{" "}
              <strong>JWT</strong> auth. Integrated FullCalendar for intelligent
              scheduling and automated reminders.
              <br />
              <a
                href="https://github.com/1YaswantH1/Project_Board"
                style={{ color: "#FF9907", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repo
              </a>
              <br />
              <button
                className="project-button"
                onClick={() =>
                  document
                    .getElementById("ERPPortal")
                    .scrollIntoView({ behavior: "smooth" })
                }
              >
                CBIT ERP Portal {">"}
              </button>
            </p>
          </div>
          <div className="model">
            <img
              className="responsive-image"
              src="images/collabboard.png"
              alt="Collab Board"
            />
          </div>
        </Element>

        {/* Slide 4 – CBIT ERP Portal */}
        <Element
          name="ERPPortal"
          className="section Inner ERPPortal"
          id="ERPPortal"
        >
          <div className="text">
            <h1>CBIT ERP Portal</h1>
            <p>
              A centralized CBIT student platform integrating ERP, placements,
              syllabus, clubs, and academic resources in one place. Automated
              ERP attendance retrieval using <strong>Playwright</strong>,
              enabling subject-wise analytics. Students can calculate safe
              bunks and minimum attendance requirements through an intuitive
              dashboard.
              <br />
              <a
                href="https://erp-cbit.vercel.app/"
                style={{ color: "#FF9907", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </a>{" "}
              |{" "}
              <a
                href="https://github.com/1YaswantH1/Cbit-Portal-ERP"
                style={{ color: "#FF9907", textDecoration: "none" }}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub Repo
              </a>
            </p>
          </div>
          <div className="model">
            <img
              className="responsive-image"
              src="images/erpportal.png"
              alt="CBIT ERP Portal"
            />
          </div>
        </Element>
      </Element>

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