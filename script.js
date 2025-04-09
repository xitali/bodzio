function toggleMenu() {
  const menu = document.getElementById("mobileMenu");
  menu.classList.toggle("hidden");
}

// Counter animation function with improved easing
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const startTime = performance.now();

  // Easing function for smoother animation
  function easeOutQuart(x) {
    return 1 - Math.pow(1 - x, 4);
  }

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    const easedProgress = easeOutQuart(progress);
    const current = Math.floor(easedProgress * target);

    element.textContent = current;
    if (element.nextElementSibling) {
      element.textContent += "+";
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// Lightbox functionality
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;

  const lightboxImage = lightbox.querySelector(".lightbox-image");
  const lightboxCaption = lightbox.querySelector(".lightbox-caption");
  const closeButton = lightbox.querySelector(".lightbox-close");
  const prevButton = lightbox.querySelector(".lightbox-prev");
  const nextButton = lightbox.querySelector(".lightbox-next");

  let currentIndex = 0;
  // Select the entire gallery-img div instead of just the img
  const galleryItems = document.querySelectorAll(".gallery-img");
  const images = Array.from(galleryItems).map((item) => ({
    src: item.querySelector("img").src,
    caption: item.querySelector("h3").textContent,
  }));

  function updateLightboxContent() {
    const { src, caption } = images[currentIndex];
    lightboxImage.src = src;
    lightboxCaption.textContent = caption;

    prevButton.style.visibility = images.length > 1 ? "visible" : "hidden";
    nextButton.style.visibility = images.length > 1 ? "visible" : "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    document.body.style.overflow = "";
  }

  // Open lightbox - attach click handler to the entire gallery-img div
  galleryItems.forEach((item, index) => {
    item.style.cursor = "pointer";
    item.addEventListener("click", (e) => {
      e.preventDefault();
      currentIndex = index;
      updateLightboxContent();
      lightbox.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  // Close lightbox
  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Navigate through images
  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightboxContent();
  });

  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    currentIndex = (currentIndex + 1) % images.length;
    updateLightboxContent();
  });

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("active")) return;

    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightboxContent();
    }
    if (e.key === "ArrowRight") {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightboxContent();
    }
  });
}

// Initialize all features when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  const counters = document.querySelectorAll(".counter-number");

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute("data-target"));
          animateCounter(entry.target, target);
          // Unobserve after animation starts
          counterObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.5,
    }
  );

  counters.forEach((counter) => counterObserver.observe(counter));

  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
        // Close mobile menu if open
        const mobileMenu = document.getElementById("mobileMenu");
        if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
          toggleMenu();
        }
      }
    });
  });

  // Initialize AOS with additional options
  AOS.init({
    once: true,
    duration: 800,
    offset: 100,
    delay: 100,
    easing: "ease-in-out",
  });

  // Initialize lightbox
  initLightbox();

  // Parallax effect for hero section
  document.addEventListener("scroll", () => {
    const heroContent = document.querySelector(".hero-content");
    const heroImage = document.querySelector(".hero-image");
    if (heroContent && heroImage && window.innerWidth > 768) {
      const scrolled = window.pageYOffset;
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroImage.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
  });

  // Reveal animations on scroll
  const revealElements = document.querySelectorAll(
    ".service-card, .gallery-img, .timeline-item"
  );
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
    }
  );

  revealElements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(element);
  });
});

// Close mobile menu when clicking outside
document.addEventListener("click", function (e) {
  const menu = document.getElementById("mobileMenu");
  const menuBtn = document.getElementById("mobileMenuBtn");

  if (
    !menu.contains(e.target) &&
    !menuBtn.contains(e.target) &&
    !menu.classList.contains("hidden")
  ) {
    toggleMenu();
  }
});
