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
const membershipCarousel = document.querySelector("[data-plan-carousel]");
const membershipTrack = membershipCarousel?.querySelector(".membership-grid");
const membershipCards = membershipTrack ? Array.from(membershipTrack.querySelectorAll(".plan-card")) : [];
const membershipPrev = membershipCarousel?.querySelector("[data-plan-prev]");
const membershipNext = membershipCarousel?.querySelector("[data-plan-next]");
const membershipStatus = membershipCarousel?.querySelector("[data-plan-status]");
const scheduleCards = Array.from(document.querySelectorAll(".schedule-card"));
const scrollLinks = Array.from(document.querySelectorAll("[data-scroll-target]"));
const revealTargets = document.querySelectorAll(
    ".method-card, .hero-card, .schedule-grid article, .plan-card, .spaces-copy, .spaces-media, .visit-copy, .contact-form"
);
let membershipIndex = 0;

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

scrollLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        const targetId = link.getAttribute("data-scroll-target");
        if (!targetId) {
            return;
        }

        const target = document.getElementById(targetId);
        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.replaceState(null, "", `#${targetId}`);
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

function collapseScheduleCards(activeCard = null) {
    scheduleCards.forEach((card) => {
        const isActive = card === activeCard;
        card.classList.toggle("is-expanded", isActive);
        card.setAttribute("aria-expanded", String(isActive));
    });
}

scheduleCards.forEach((card) => {
    card.addEventListener("click", () => {
        const shouldExpand = !card.classList.contains("is-expanded");
        collapseScheduleCards(shouldExpand ? card : null);
    });

    card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
            return;
        }

        event.preventDefault();
        const shouldExpand = !card.classList.contains("is-expanded");
        collapseScheduleCards(shouldExpand ? card : null);
    });
});

document.addEventListener("click", (event) => {
    if (!(event.target instanceof Element) || event.target.closest(".schedule-card")) {
        return;
    }

    collapseScheduleCards();
});

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

function updateMembershipCarousel() {
    if (!membershipTrack || membershipCards.length === 0) {
        return;
    }

    const isMobile = window.innerWidth <= 760;

    if (!isMobile) {
        membershipTrack.scrollLeft = 0;
        membershipCards.forEach((card) => {
            card.setAttribute("aria-hidden", "false");
        });
        if (membershipStatus) {
            membershipStatus.textContent = `Plan 1 of ${membershipCards.length}`;
        }
        if (membershipPrev) {
            membershipPrev.disabled = false;
        }
        if (membershipNext) {
            membershipNext.disabled = false;
        }
        membershipIndex = 0;
        return;
    }

    membershipIndex = Math.max(0, Math.min(membershipIndex, membershipCards.length - 1));
    membershipTrack.scrollTo({
        left: membershipIndex * membershipTrack.clientWidth,
        behavior: "smooth"
    });

    membershipCards.forEach((card, index) => {
        card.setAttribute("aria-hidden", String(index !== membershipIndex));
    });

    if (membershipStatus) {
        membershipStatus.textContent = `Plan ${membershipIndex + 1} of ${membershipCards.length}`;
    }

    if (membershipPrev) {
        membershipPrev.disabled = membershipIndex === 0;
    }

    if (membershipNext) {
        membershipNext.disabled = membershipIndex === membershipCards.length - 1;
    }
}

if (membershipTrack && membershipCards.length > 0) {
    membershipPrev?.addEventListener("click", () => {
        if (membershipIndex > 0) {
            membershipIndex -= 1;
            updateMembershipCarousel();
        }
    });

    membershipNext?.addEventListener("click", () => {
        if (membershipIndex < membershipCards.length - 1) {
            membershipIndex += 1;
            updateMembershipCarousel();
        }
    });

    updateMembershipCarousel();
}

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
    updateMembershipCarousel();
});
