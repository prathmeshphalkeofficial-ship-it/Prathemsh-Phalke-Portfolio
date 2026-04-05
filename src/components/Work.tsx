import { useState, useCallback, useRef, useEffect } from "react";
import "./styles/Work.css";
import VanillaTilt from "vanilla-tilt";
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
    title: "KPT Engineers",
    category: "Precision Enclosure Manufacturing",
    tools: "React, Modern UI, Responsive Design",
    image: "/images/KPT Engieers.png",
    link: "https://kpt-engineers.vercel.app/",
  },
  {
    title: "Titan AI",
    category: "AI Operating System / Jarvis Clone",
    tools: "React, Next.js, AI Integration",
    image: "/picture/TITAN.PNG",
    link: "https://titan-lite-os-prathmeshphalkeofficial-1984s-projects.vercel.app/",
  },
  {
    title: "ByteSweep",
    category: "Carbon Footprint Remover",
    tools: "React, Analytics, Optimization",
    image: "/picture/Bytesweep.JPG",
    link: "https://bytesweep.vercel.app/",
  },
  {
    title: "Portfolio Website",
    category: "Web Development",
    tools: "React, 3D Models, Animations",
    image: "/picture/Portfolio.JPG",
    link: "https://prathmesh-phalke-portfolio.vercel.app/",
  },
];

// Accent colors for each project
const accentColors = [
  "#8B5CF6", // Purple
  "#F97316", // Orange
  "#10B981", // Green
  "#3B82F6", // Blue
  "#EC4899", // Pink
  "#EF4444", // Red
];

const Work = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const frontCardRef = useRef<HTMLDivElement>(null);
  const tiltInstanceRef = useRef<any>(null);

  // Initialize vanilla-tilt on the front card
  useEffect(() => {
    if (frontCardRef.current) {
      // Destroy previous tilt instance if exists
      if (tiltInstanceRef.current) {
        frontCardRef.current.removeAttribute("data-tilt");
        tiltInstanceRef.current.destroy();
      }

      // Initialize new tilt instance
      VanillaTilt.init(frontCardRef.current, {
        max: 12,
        speed: 400,
        glare: true,
        "max-glare": 0.15,
      });

      // Store reference to the tilt instance from the element
      tiltInstanceRef.current = (frontCardRef.current as any)._vanilla_react_tilt;
    }

    return () => {
      if (tiltInstanceRef.current && frontCardRef.current) {
        frontCardRef.current.removeAttribute("data-tilt");
        tiltInstanceRef.current.destroy();
      }
    };
  }, [currentIndex]);

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

  const handleCardClick = (position: "left" | "right" | "center") => {
    if (position === "center") {
      // Open project live link
      window.open(projects[currentIndex].link, "_blank", "noopener,noreferrer");
    } else if (position === "left") {
      goToPrev();
    } else {
      goToNext();
    }
  };

  // Calculate indices for the 3-card view
  const getCardIndices = () => {
    const total = projects.length;
    const prevIndex = (currentIndex - 1 + total) % total;
    const nextIndex = (currentIndex + 1) % total;
    return { prevIndex, currentIndex, nextIndex };
  };

  const { prevIndex, nextIndex } = getCardIndices();

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>

        <div className="card-stack-wrapper">
          {/* Navigation Arrows */}
          <button
            className="carousel-arrow carousel-arrow-left"
            onClick={() => handleCardClick("left")}
            aria-label="Previous project"
            data-cursor="disable"
          >
            <MdArrowBack />
          </button>
          <button
            className="carousel-arrow carousel-arrow-right"
            onClick={() => handleCardClick("right")}
            aria-label="Next project"
            data-cursor="disable"
          >
            <MdArrowForward />
          </button>

          {/* Card Stack */}
          <div className="card-stack">
            {/* Right Card (Next) - Rendered first to be behind */}
            <div
              className="project-card project-card-right"
              onClick={() => handleCardClick("right")}
              style={{
                borderColor: accentColors[nextIndex],
              }}
            >
              <div className="card-image-container">
                <img
                  src={projects[nextIndex].image}
                  alt={projects[nextIndex].title}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <span
                  className="card-number"
                  style={{ color: accentColors[nextIndex] }}
                >
                  0{nextIndex + 1}
                </span>
                <h4 className="card-title">{projects[nextIndex].title}</h4>
                <p className="card-category">{projects[nextIndex].category}</p>
                <div className="card-bottom-bar">
                  <span className="card-tools">{projects[nextIndex].tools}</span>
                </div>
              </div>
            </div>

            {/* Front Card (Current/Active) */}
            <div
              ref={frontCardRef}
              className="project-card project-card-front"
              onClick={() => handleCardClick("center")}
              style={{
                borderColor: accentColors[currentIndex],
              }}
            >
              <div className="card-image-container">
                <img
                  src={projects[currentIndex].image}
                  alt={projects[currentIndex].title}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <span
                  className="card-number"
                  style={{ color: accentColors[currentIndex] }}
                >
                  0{currentIndex + 1}
                </span>
                <h4 className="card-title">{projects[currentIndex].title}</h4>
                <p className="card-category">{projects[currentIndex].category}</p>
                <div
                  className="card-bottom-bar"
                  style={{ backgroundColor: accentColors[currentIndex] }}
                >
                  <span className="card-tools">{projects[currentIndex].tools}</span>
                  <span className="card-live-link">Live Link →</span>
                </div>
              </div>
            </div>

            {/* Left Card (Previous) - Rendered last to be on top of side cards */}
            <div
              className="project-card project-card-left"
              onClick={() => handleCardClick("left")}
              style={{
                borderColor: accentColors[prevIndex],
              }}
            >
              <div className="card-image-container">
                <img
                  src={projects[prevIndex].image}
                  alt={projects[prevIndex].title}
                  className="card-image"
                />
              </div>
              <div className="card-content">
                <span
                  className="card-number"
                  style={{ color: accentColors[prevIndex] }}
                >
                  0{prevIndex + 1}
                </span>
                <h4 className="card-title">{projects[prevIndex].title}</h4>
                <p className="card-category">{projects[prevIndex].category}</p>
                <div className="card-bottom-bar">
                  <span className="card-tools">{projects[prevIndex].tools}</span>
                </div>
              </div>
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