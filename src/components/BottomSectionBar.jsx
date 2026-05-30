import React from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";
import { FaGithub, FaFileAlt, FaLinkedin } from "react-icons/fa";

const BottomSectionBar = ({ sections, currentSection }) => {
  const nextSection =
    sections[sections.findIndex((section) => section === currentSection) + 1];

  const scrollToNext = () => {
    if (currentSection === "Contact") {
      document.getElementById("Home").scrollIntoView({ behavior: "smooth" });
    } else if (nextSection) {
      document
        .getElementById(nextSection)
        .scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="bottom-bar">
      {/* Left Side - GitHub */}
      <div className="bottom-navbar-left">
        <a
          href="https://github.com/1YaswantH1"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#FE9900",
            textDecoration: "none",
            fontSize: "2.5rem",
          }}
        >
          <FaGithub />
        </a>
      </div>

      {/* Center Scroll */}
      <div className="scroll-to-next">
        <p>
          {currentSection === "Contact"
            ? "Back to Top"
            : `Scroll to ${nextSection || "next section"}`}
        </p>

        <div className="arrow" onClick={scrollToNext}>
          {currentSection === "Contact" ? (
            <FaChevronUp />
          ) : (
            <FaChevronDown />
          )}
        </div>
      </div>

      {/* Right Side */}
      <div
        className="bottom-navbar-right"
        style={{ display: "flex", gap: "1.5rem" }}
      >
        {/* LinkedIn */}
        <a
          href="https://linkedin.com/in/yaswanth-varma-chinta-a73100262"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#FE9900",
            textDecoration: "none",
            fontSize: "2.5rem",
          }}
        >
          <FaLinkedin />
        </a>

        {/* Resume */}
        <a
          href="/Resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: "#FE9900",
            textDecoration: "none",
            fontSize: "2.5rem",
          }}
        >
          <FaFileAlt />
        </a>
      </div>
    </div>
  );
};

export default BottomSectionBar;