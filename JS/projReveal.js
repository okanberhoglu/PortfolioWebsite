const revealProjEls = document.querySelectorAll(".reveal-proj");
const projObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        projObserver.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12 },
);
revealProjEls.forEach((el) => projObserver.observe(el));
