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
              <svg
                viewBox="0 0 69.667 44"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="button" transform="translate(4.333, 5.667)">
                  <g id="container">
                    <rect width="41" height="35" fill="black" rx="17.5" />
                    <path
                      d="M4 17.5C4 7.835 11.835 0 21.5 0C31.165 0 39 7.835 39 17.5C39 27.165 31.165 35 21.5 35C11.835 35 4 27.165 4 17.5Z"
                      fill="#FFECAD"
                    />
                    <rect width="7" height="7" transform="translate(28, 14)" rx="3.5" fill="#FFD600" />
                  </g>
                </g>
                <g id="cloud">
                  <path
                    d="M48.667 23.235C47.235 23.235 45.906 22.828 44.772 22.121C43.638 21.414 42.736 20.424 42.155 19.25C41.574 18.076 41.333 16.764 41.456 15.446C41.579 14.128 42.062 12.851 42.855 11.747C43.648 10.643 44.72 9.752 45.968 9.166C47.216 8.58 48.603 8.316 49.973 8.397C51.343 8.478 52.657 8.901 53.757 9.622C54.857 10.343 55.692 11.33 56.163 12.473C56.634 13.616 56.717 14.876 56.403 16.072C56.089 17.268 55.387 18.342 54.385 19.157C53.383 19.972 52.125 20.495 50.8 20.667"
                    stroke="#9CA3AF"
                    strokeWidth="2"
                    fill="#6B7280"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
                <g id="patches">
                  <circle cx="12" cy="14" r="1.5" fill="#FFC107" />
                  <circle cx="20" cy="10" r="1" fill="#FFC107" />
                  <circle cx="26" cy="18" r="1.5" fill="#FFC107" />
                  <circle cx="16" cy="22" r="1" fill="#FFC107" />
                </g>
                <g id="sun">
                  <circle cx="21.5" cy="17.5" r="7" fill="#FFD600" />
                </g>
                <g id="moon">
                  <path
                    d="M26.5 10.833C25.35 11.398 24.025 11.5 22.833 11.5C21.641 11.5 20.316 11.398 19.167 10.833C17.192 9.804 15.5 7.732 15.5 5.25C15.5 2.768 17.192 0.696 19.167 -0.333C20.316 -0.898 21.641 -1 22.833 -1C24.025 -1 25.35 -0.898 26.5 -0.333C28.475 0.696 30.167 2.768 30.167 5.25C30.167 7.732 28.475 9.804 26.5 10.833Z"
                    fill="#C0C0C0"
                    opacity="0"
                  />
                </g>
                <g id="stars">
                  <circle cx="50" cy="8" r="1" fill="#FFF" opacity="0" />
                  <circle cx="56" cy="14" r="0.8" fill="#FFF" opacity="0" />
                  <circle cx="45" cy="4" r="1.2" fill="#FFF" opacity="0" />
                  <circle cx="60" cy="2" r="0.6" fill="#FFF" opacity="0" />
                  <circle cx="53" cy="18" r="1" fill="#FFF" opacity="0" />
                </g>
              </svg>
            </label>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
