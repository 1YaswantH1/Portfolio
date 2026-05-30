import React, { useEffect, useRef, useCallback } from "react";
import "../css/Projects.css";
import ComboScene from "./ComboScene";

const projectSlides = [
    {
        id: "Portfolio",
        title: "Projects",
        description: (
            <>
                Here are some of the projects I've worked on, showcasing my skills
                in full-stack web development, AI/ML, and DevOps.
            </>
        ),
        media: <ComboScene />,
        links: null,
    },
    {
        id: "ERPPortal",
        title: "CBIT ERP Portal",
        description: (
            <>
                A centralized CBIT student platform with timetables, attendance,
                results, and notice boards — all in one place.
            </>
        ),
        media: <img className="proj-image" src="/images/erpportal.png" alt="CBIT ERP Portal" />,
        links: [
            { label: "Live Demo", href: "https://erp-cbit.vercel.app/" },
            { label: "GitHub Repo", href: "https://github.com/1YaswantH1/Cbit-Portal-ERP" },
        ],
    },
    {
        id: "Emulator",
        title: "AI Surveillance Enhancement",
        description: (
            <>
                An AI-based CCTV restoration system achieving{" "}
                <strong>40 dB PSNR</strong> and <strong>0.95 SSIM</strong> using
                deep learning pipelines for real-time video restoration.
            </>
        ),
        media: <img className="proj-image" src="/images/surveillance.png" alt="AI Surveillance Enhancement" />,
        links: [{ label: "GitHub Repo", href: "https://github.com/1YaswantH1/Surveillance_Restoration_System" }],
    },
    {
        id: "CollabBoard",
        title: "Collab Board",
        description: (
            <>
                A collaborative Kanban task management platform with real-time
                updates, drag-and-drop boards, and team workspace support.
            </>
        ),
        media: <img className="proj-image" src="/images/collabboard.png" alt="Collab Board" />,
        links: [{ label: "GitHub Repo", href: "https://github.com/1YaswantH1/Project_Board" }],
    },
];

const AUTO_ADVANCE_MS = 10000000;

const Projects = ({ currentProjectIndex, projects, goToProject }) => {
    const autoTimer = useRef(null);

    // Drive the CSS transform whenever the index changes
    useEffect(() => {
        const wrapper = document.getElementById("slides-wrapper");
        if (wrapper) wrapper.style.transform = `translateX(-${currentProjectIndex * 100}vw)`;
    }, [currentProjectIndex]);

    // Keep refs fresh so the interval never has stale closures
    const goToProjectRef = useRef(goToProject);
    useEffect(() => { goToProjectRef.current = goToProject; }, [goToProject]);

    const currentIndexRef = useRef(currentProjectIndex);
    useEffect(() => { currentIndexRef.current = currentProjectIndex; }, [currentProjectIndex]);

    const startAutoTimer = useCallback(() => {
        clearInterval(autoTimer.current);
        autoTimer.current = setInterval(() => {
            const idx = currentIndexRef.current;
            const next = idx < projectSlides.length - 1 ? idx + 1 : 0;
            // Compute delta so App.jsx receives a relative change
            const delta = next - idx || -(projectSlides.length - 1);
            goToProjectRef.current(delta);
        }, AUTO_ADVANCE_MS);
    }, []);

    useEffect(() => {
        startAutoTimer();
        return () => clearInterval(autoTimer.current);
    }, [startAutoTimer]);

    const handleNav = (dir) => {
        goToProject(dir);
        startAutoTimer(); // reset 5s countdown on manual nav
    };

    const handleDotClick = (index) => {
        goToProject(index - currentProjectIndex);
        startAutoTimer();
    };

    return (
        <section className="projects-section" id="Portfolio">
            <div className="projects-track">
                <div className="projects-slides-wrapper" id="slides-wrapper">
                    {projectSlides.map((slide, i) => (
                        <div className="project-slide" key={slide.id} id={slide.id}>
                            <div className="slide-inner">
                                <div className="slide-text">
                                    <span className="slide-index">0{i + 1}</span>
                                    <h1>{slide.title}</h1>
                                    <p>{slide.description}</p>
                                    {slide.links && (
                                        <div className="slide-links">
                                            {slide.links.map((link) => (
                                                <a key={link.label} href={link.href}
                                                    className="slide-link" target="_blank" rel="noopener noreferrer">
                                                    {link.label} ↗
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="slide-media">{slide.media}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Arrows — section level, clear of sidebar */}
            <button className="carousel-arrow carousel-arrow--left"
                onClick={() => handleNav(-1)}
                disabled={currentProjectIndex === 0}
                aria-label="Previous project">
                &#8592;
            </button>
            <button className="carousel-arrow carousel-arrow--right"
                onClick={() => handleNav(1)}
                disabled={currentProjectIndex === projects.length - 1}
                aria-label="Next project">
                &#8594;
            </button>

            {/* Dots */}
            <div className="projects-dots">
                {projectSlides.map((_, i) => (
                    <button key={i}
                        className={`dot ${i === currentProjectIndex ? "dot--active" : ""}`}
                        onClick={() => handleDotClick(i)}
                        aria-label={`Go to slide ${i + 1}`} />
                ))}
            </div>
        </section>
    );
};

export default Projects;