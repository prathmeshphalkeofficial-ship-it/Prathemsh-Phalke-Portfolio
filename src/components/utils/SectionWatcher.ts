/**
 * SectionWatcher - Uses IntersectionObserver to detect active sections
 * and applies corresponding classes to the body for theme switching.
 */

interface SectionConfig {
    id: string;
    className: string;
}

const sections: SectionConfig[] = [
    { id: "landingDiv", className: "section-landing" },
    { id: "about", className: "section-about" },
    { id: "whatido", className: "section-whatido" },
    { id: "career", className: "section-career" },
    { id: "work", className: "section-work" },
    { id: "chat", className: "section-chat" },
    { id: "contact", className: "section-contact" },
];

let currentActiveSection = "";

function setSectionTheme(className: string) {
    // Remove all section classes
    sections.forEach((section) => {
        document.body.classList.remove(section.className);
    });
    // Add the new section class
    document.body.classList.add(className);
    currentActiveSection = className;
}

export function initSectionWatcher() {
    const observerOptions = {
        root: null,
        rootMargin: "-30% 0px -30% 0px",
        threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0) {
                const section = sections.find((s) => s.id === entry.target.id);
                if (section) {
                    setSectionTheme(section.className);
                }
            }
        });
    }, observerOptions);

    // Observe all sections after a short delay to ensure DOM is ready
    const observeElements = () => {
        sections.forEach((section) => {
            const element = document.getElementById(section.id);
            if (element) {
                observer.observe(element);
            }
        });
    };

    // Initial observation with delay
    setTimeout(observeElements, 500);

    // Cleanup function
    return () => {
        observer.disconnect();
    };
}

export function getCurrentSection() {
    return currentActiveSection;
}