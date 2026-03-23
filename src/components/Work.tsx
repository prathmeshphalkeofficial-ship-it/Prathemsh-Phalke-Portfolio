import { useState, useCallback } from "react";
import "./styles/Work.css";
import WorkImage from "./WorkImage";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const projects = [
  {
    title: "Krishi Bot",
    category: "AI Agriculture Assistant",
    tools: "React, AI Integration, Real-time APIs",
    image: "/images/krishi_bot.png",
    link: "https://krishi-bot-4emu.vercel.app/",
  },
  {
    title: "Swaraj Gym",
    category: "Business Website",
    tools: "React, Responsive Design, Enquiry System",
    image: "/images/swaraj_gym.png",
    link: "https://swaraj-gym-fitness.vercel.app/",
  },
  {
    title: "Titan AI",
    category: "AI Operating System / Jarvis Clone",
    tools: "React, Next.js, AI Integration",
    image: "/picture/screenshot/TITAN.png",
    link: "https://titan-lite-os-prathmeshphalkeofficial-1984s-projects.vercel.app/",
  },
  {
    title: "ByteSweep",
    category: "Carbon Footprint Remover",
    tools: "React, Analytics, Optimization",
    image: "/picture/screenshot/Bytesweep.png",
    link: "https://bytesweep.vercel.app/",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    tools: "React, 3D Models, Animations",
    image: "/picture/screenshot/Portfolio.png",
    link: "https://prathmesh-phalke-portfolio.vercel.app/",
  },
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (isAnimating) return;
      setIsAnimating(true);
      setCurrentIndex(index);
      setTimeout(() => setIsAnimating(false), 500);
    },
    [isAnimating]
  );

  const goToPrev = useCallback(() => {
    const newIndex =
      currentIndex === 0 ? projects.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  const goToNext = useCallback(() => {
    const newIndex =
      currentIndex === projects.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  }, [currentIndex, goToSlide]);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="carousel-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={goToPrev}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={goToNext}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Slides */}
          <div className="carousel-track-container">
            <div
              className="carousel-track"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {projects.map((project, index) => (
                <div className="carousel-slide" key={index}>
                  <div className="carousel-content">
                    <div className="carousel-info">
                      <div className="carousel-number">
                        <h3>0{index + 1}</h3>
                      </div>
                      <div className="carousel-details">
                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="project-link">
                          <h4>{project.title}</h4>
                        </a>
                        <p className="carousel-category">
                          {project.category}
                        </p>
                        <div className="carousel-tools">
                          <span className="tools-label">Tools & Features</span>
                          <p>{project.tools}</p>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-image-wrapper">
                      <WorkImage image={project.image} alt={project.title} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="carousel-dots">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`carousel-dot ${index === currentIndex ? "carousel-dot-active" : ""
                  }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to project ${index + 1}`}
                data-cursor="disable"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
