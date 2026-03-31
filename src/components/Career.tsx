import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full Stack Developer</h4>
                <h5>Freelance</h5>
              </div>
              <h3>2022</h3>
            </div>
            <p>
              Delivered multiple real-world projects, managing client
              communication and requirements. Built complete, production-ready
              solutions combining frontend and backend expertise.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Architecture Student</h4>
                <h5>Ongoing</h5>
              </div>
              <h3>2023</h3>
            </div>
            <p>
              Pursuing a Bachelor of Architecture, applying spatial and visual
              design principles to digital products. Creating home plans and
              layouts with a strong focus on design thinking.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Independent Developer</h4>
                <h5>Self-Employed</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Focusing on AI integration and automation tools like Krishi Bot.
              Building scalable web applications and delivering high-quality,
              performance-first digital solutions for clients.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
