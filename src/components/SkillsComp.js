import React from "react";
import {
  FaJs,
  FaHtml5,
  FaJava,
  FaPython,
  FaReact,
  FaGitAlt,
  FaDocker,
  FaNodeJs,
  FaGithub,
  FaLinux,
} from "react-icons/fa";

import {
  SiMongodb,
  SiMysql,
  SiExpress,
  SiPostman,
  SiKubernetes,
  SiTensorflow,
  SiPandas,
  SiNumpy,
  SiMongoose,
  SiScikitlearn,
} from "react-icons/si";

const Skills = () => {
  const column1 = [
    { icon: <FaJava />, name: "Java" },
    { icon: <FaPython />, name: "Python" },
    { icon: <FaJs />, name: "JavaScript" },
    { icon: <FaHtml5 />, name: "HTML5" },
    { icon: <FaReact />, name: "React.js" },
    { icon: <FaNodeJs />, name: "Node.js" },
    { icon: <SiExpress />, name: "Express.js" },
  ];

  const column2 = [
    { icon: <SiMongodb />, name: "MongoDB" },
    { icon: <SiMysql />, name: "MySQL" },
    { icon: <FaDocker />, name: "Docker" },
    { icon: <SiKubernetes />, name: "Kubernetes" },
    { icon: <FaGitAlt />, name: "Git" },
    { icon: <FaGithub />, name: "GitHub" },
    { icon: <SiPostman />, name: "Postman" },
  ];

  const column3 = [
    { icon: <SiNumpy />, name: "NumPy" },
    { icon: <SiPandas />, name: "Pandas" },
    { icon: <SiScikitlearn />, name: "Scikit-Learn" },
    { icon: <SiTensorflow />, name: "Machine Learning" },
    { icon: <SiTensorflow />, name: "Deep Learning" },
    { icon: <SiPandas />, name: "Data Analysis" },
    { icon: <FaJava />, name: "DSA" },
  ];

  return (
    <div className="skills-wrapper">
      <div className="skills-column scroll-up">
        {[...column1, ...column1].map((skill, index) => (
          <div key={index} className="skill-item">
            <span className="skill-icon">{skill.icon}</span>
            <p>{skill.name}</p>
          </div>
        ))}
      </div>

      <div className="skills-column scroll-down">
        {[...column2, ...column2].map((skill, index) => (
          <div key={index} className="skill-item">
            <span className="skill-icon">{skill.icon}</span>
            <p>{skill.name}</p>
          </div>
        ))}
      </div>

      <div className="skills-column scroll-up-slow">
        {[...column3, ...column3].map((skill, index) => (
          <div key={index} className="skill-item">
            <span className="skill-icon">{skill.icon}</span>
            <p>{skill.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;