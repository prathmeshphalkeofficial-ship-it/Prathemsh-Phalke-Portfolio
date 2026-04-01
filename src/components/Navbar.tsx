import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";
import { useTheme } from "../context/ThemeContext";

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();

  const toggleMobileMenu = () => {
    const menu = document.getElementById("mobileMenu");
    const overlay = document.getElementById("mobileOverlay");
    const hamburger = document.querySelector(".hamburger") as HTMLElement;

    menu?.classList.toggle("active");
    overlay?.classList.toggle("active");
    hamburger?.classList.toggle("active");

    // Toggle body scroll
    document.body.style.overflow = menu?.classList.contains("active") ? "hidden" : "";
  };

  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          smoother.scrollTo(section, true, "top top");
        }
      });
    });
    window.addEventListener("resize", () => {
      ScrollSmoother.refresh(true);
    });
  }, []);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          <img src="/images/pp_logo.png" alt="PP Logo" className="navbar-logo" />
        </a>
        <a
          href="mailto:prathmeshphalkeofficial@gmail.com"
          className="navbar-connect"
          data-cursor="disable"
        >
          prathmeshphalkeofficial@gmail.com
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
          <li className="nav-chat-item">
            <a data-href="#chat" href="#chat">
              <HoverLinks text="CHAT" />
            </a>
          </li>
          <li className="theme-toggle-container">
            <label id="theme-toggle-button">
              <input
                id="toggle"
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
              />
              <div className="toggle-track">
                <div className="toggle-thumb">
                  <span className="toggle-icon sun">☀️</span>
                  <span className="toggle-icon moon">🌙</span>
                </div>
              </div>
            </label>
          </li>
        </ul>

        {/* Mobile actions container */}
        <div className="mobile-actions">
          <div className="hamburger" onClick={toggleMobileMenu}>
            <span className="hamburger-icon">☰</span>
            <span className="close-icon">✕</span>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div className="mobile-overlay" id="mobileOverlay" onClick={toggleMobileMenu}></div>

      {/* Mobile Menu */}
      <div className="mobile-menu" id="mobileMenu">
        <a href="#about" onClick={toggleMobileMenu}>About</a>
        <a href="#work" onClick={toggleMobileMenu}>Work</a>
        <a href="#contact" onClick={toggleMobileMenu}>Contact</a>
        <a href="#chat" onClick={toggleMobileMenu}>Chat</a>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
