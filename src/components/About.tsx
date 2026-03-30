import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          Full Stack Web Developer with real-world experience building scalable
          websites and AI-powered tools. Skilled in handling complete project
          development—from UI design to backend architecture and deployment.
          Also pursuing Architecture, combining technical expertise with strong
          design thinking, enabling creation of visually appealing and highly
          functional digital solutions.
        </p>
        <div className="resume-video-wrap">
          <h4>Resume Video</h4>
          <video
            className="resume-video"
            controls
            preload="metadata"
            src="/videos/Prathmesh_Phalke__AI_Dev.mp4"
          >
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default About;
