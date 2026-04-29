const navbar = document.querySelector(".navbar");
const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main section[id]");
const modalButtons = document.querySelectorAll("[data-modal-target]");
const modals = document.querySelectorAll(".modal");
const modalFrames = document.querySelectorAll(".modal iframe");
const contactForm = document.getElementById("contact-form");
const contactFeedback = document.getElementById("contact-feedback");
const counters = document.querySelectorAll("[data-count]");
const revealTargets = document.querySelectorAll(
    ".method-card, .hero-card, .schedule-grid article, .plan-card, .spaces-copy, .spaces-media, .visit-copy, .contact-form"
);

if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
        const isOpen = navbar.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => {
        if (navbar && navbar.classList.contains("menu-open")) {
            navbar.classList.remove("menu-open");
            menuToggle?.setAttribute("aria-expanded", "false");
        }
    });
});

function closeModal(modal) {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
}

function resizeModalFrame(frame) {
    if (!frame) {
        return;
    }

    try {
        const doc = frame.contentDocument || frame.contentWindow?.document;
        if (!doc) {
            return;
        }

        const bodyHeight = doc.body ? doc.body.scrollHeight : 0;
        const htmlHeight = doc.documentElement ? doc.documentElement.scrollHeight : 0;
        const nextHeight = Math.max(bodyHeight, htmlHeight, 320);
        frame.style.height = `${nextHeight}px`;
    } catch {
        // Ignore cross-document sizing issues.
    }
}

modalButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const modal = document.getElementById(button.dataset.modalTarget);
        if (!modal) {
            return;
        }

        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        const frame = modal.querySelector("iframe");
        resizeModalFrame(frame);
    });
});

modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal || event.target.classList.contains("modal-close")) {
            closeModal(modal);
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        modals.forEach((modal) => closeModal(modal));
    }
});

modalFrames.forEach((frame) => {
    frame.addEventListener("load", () => {
        resizeModalFrame(frame);
    });
});

if (contactForm && contactFeedback) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const nameField = document.getElementById("contact-name");
        const name = nameField ? nameField.value.trim() : "there";
        contactFeedback.textContent = `Thanks, ${name}. A Phoenix coach will reach out shortly.`;
        contactForm.reset();
    });
}

function setActiveLink() {
    const current = window.scrollY + window.innerHeight * 0.35;

    sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        const id = section.getAttribute("id");
        const matchingLink = document.querySelector(`.nav-links a[href="#${id}"]`);

        if (!matchingLink) {
            return;
        }

        matchingLink.classList.toggle("is-active", current >= top && current < bottom);
    });
}

function animateCounter(counter) {
    const target = Number(counter.dataset.count);
    if (!target || counter.dataset.animated === "true") {
        return;
    }

    counter.dataset.animated = "true";
    let start = 0;
    const duration = 1400;
    const startTime = performance.now();
    const hasSlash = counter.textContent.includes("/");

    function tick(timestamp) {
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        start = Math.round(target * eased);
        counter.textContent = hasSlash ? `${start}/7` : String(start).padStart(2, "0");

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add("is-visible");
            if (entry.target.hasAttribute("data-count")) {
                animateCounter(entry.target);
            }
            observer.unobserve(entry.target);
        });
    },
    { threshold: 0.24 }
);

revealTargets.forEach((target) => observer.observe(target));
counters.forEach((counter) => observer.observe(counter));

window.addEventListener("scroll", () => {
    setActiveLink();

    if (window.innerWidth > 900) {
        const hero = document.querySelector(".hero");
        if (hero) {
            const offset = Math.min(window.scrollY * 0.12, 48);
            hero.style.backgroundPosition = `center ${offset}px`;
        }
    }
});

setActiveLink();
window.addEventListener("resize", () => {
    modalFrames.forEach((frame) => resizeModalFrame(frame));
});
