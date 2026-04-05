import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useTheme } from "../context/ThemeContext";
import "./styles/Navbar.css";

import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger, SplitText);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    // Close mobile menu when clicking a nav link
    if (isMobileMenuOpen) {
      const navLinks = document.querySelectorAll(".mobile-nav-link");
      navLinks.forEach((link) => {
        link.addEventListener("click", () => setIsMobileMenuOpen(false));
      });
    }
  }, [isMobileMenuOpen]);

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
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

        {/* Hamburger Menu Button - Mobile Only */}
        <button
          className={`hamburger-menu ${isMobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        {/* Desktop Navigation */}
        <ul className="desktop-nav">
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
          <li className="theme-toggle-item desktop-theme-toggle">
            <label className="switch">
              <input
                id="theme-toggle"
                type="checkbox"
                checked={isDark}
                onChange={toggleTheme}
                aria-label="Toggle dark mode"
              />
              <div className="slider round">
                <div className="sun-moon">
                  <svg id="moon-dot-1" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="moon-dot-2" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="moon-dot-3" className="moon-dot" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="light-ray-1" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="light-ray-2" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="light-ray-3" className="light-ray" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>

                  <svg id="cloud-1" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-2" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-3" className="cloud-dark" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-4" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-5" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                  <svg id="cloud-6" className="cloud-light" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="50"></circle>
                  </svg>
                </div>
                <div className="stars">
                  <svg id="star-1" className="star" viewBox="0 0 20 20">
                    <path
                      d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                  </svg>
                  <svg id="star-2" className="star" viewBox="0 0 20 20">
                    <path
                      d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                  </svg>
                  <svg id="star-3" className="star" viewBox="0 0 20 20">
                    <path
                      d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                  </svg>
                  <svg id="star-4" className="star" viewBox="0 0 20 20">
                    <path
                      d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"
                    ></path>
                  </svg>
                </div>
              </div>
            </label>
          </li>
        </ul>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobile && (
        <>
          <div
            className={`mobile-menu-overlay ${isMobileMenuOpen ? "open" : ""}`}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <nav className={`mobile-nav ${isMobileMenuOpen ? "open" : ""}`}>
            <div className="mobile-nav-header">
              <span className="mobile-nav-title">Menu</span>
              <button
                className="mobile-menu-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>
            <ul className="mobile-nav-links">
              <li>
                <a href="#about" className="mobile-nav-link" data-href="#about">
                  ABOUT
                </a>
              </li>
              <li>
                <a href="#work" className="mobile-nav-link" data-href="#work">
                  WORK
                </a>
              </li>
              <li>
                <a href="#contact" className="mobile-nav-link" data-href="#contact">
                  CONTACT
                </a>
              </li>
              <li className="mobile-chat-item">
                <a href="#chat" className="mobile-nav-link" data-href="#chat">
                  CHAT
                </a>
              </li>
            </ul>
            <div className="mobile-nav-footer">
              <a
                href="mailto:prathmeshphalkeofficial@gmail.com"
                className="mobile-email-link"
              >
                prathmeshphalkeofficial@gmail.com
              </a>
              <div className="mobile-theme-toggle">
                <label className="switch">
                  <input
                    id="theme-toggle-mobile"
                    type="checkbox"
                    checked={isDark}
                    onChange={toggleTheme}
                    aria-label="Toggle dark mode"
                  />
                  <div className="slider round">
                    <div className="sun-moon">
                      <svg id="moon-dot-1-m" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="moon-dot-2-m" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="moon-dot-3-m" className="moon-dot" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="light-ray-1-m" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="light-ray-2-m" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="light-ray-3-m" className="light-ray" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-1-m" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-2-m" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-3-m" className="cloud-dark" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-4-m" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-5-m" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                      <svg id="cloud-6-m" className="cloud-light" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="50"></circle>
                      </svg>
                    </div>
                    <div className="stars">
                      <svg id="star-1-m" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                      <svg id="star-2-m" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                      <svg id="star-3-m" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                      <svg id="star-4-m" className="star" viewBox="0 0 20 20">
                        <path d="M 0 10 C 10 10,10 10 ,0 10 C 10 10 , 10 10 , 10 20 C 10 10 , 10 10 , 20 10 C 10 10 , 10 10 , 10 0 C 10 10,10 10 ,0 10 Z"></path>
                      </svg>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </nav>
        </>
      )}

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;