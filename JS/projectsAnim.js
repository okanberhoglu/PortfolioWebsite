let projIndex = 0;
const track = document.getElementById("projectsTrack");
const cards = track ? track.querySelectorAll(".proj-card") : [];
const dotsContainer = document.getElementById("projDots");
const leftArrow = document.querySelector(".proj-arrow-left");
const rightArrow = document.querySelector(".proj-arrow-right");

function renderDots() {
  if (!dotsContainer) return;
  const count = Math.max(1, cards.length - getVisibleCount() + 1);
  dotsContainer.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const span = document.createElement("span");
    span.className = "proj-dot" + (i === projIndex ? " active" : "");
    span.onclick = () => goToProject(i);
    dotsContainer.appendChild(span);
  }
}

function getVisibleCount() {
  const vw = document.querySelector(".projects-viewport");
  if (!vw) return 3;
  return Math.max(1, Math.floor(vw.clientWidth / getSlideStep()));
}

function getSlideStep() {
  const firstCard = cards[0];
  if (!firstCard || !track) return 284;

  const trackStyle = window.getComputedStyle(track);
  const gap = parseFloat(trackStyle.columnGap || trackStyle.gap) || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

function clampProjectIndex() {
  const max = Math.max(0, cards.length - getVisibleCount());
  projIndex = Math.max(0, Math.min(projIndex, max));
}

function updateSlider() {
  if (!track) return;

  clampProjectIndex();
  track.style.transform = `translateX(-${projIndex * getSlideStep()}px)`;
  renderDots();

  const needsSlider = cards.length > getVisibleCount();
  const arrowDisplay = needsSlider ? "flex" : "none";
  if (leftArrow) {
    leftArrow.style.display = arrowDisplay;
    leftArrow.disabled = projIndex === 0;
  }
  if (rightArrow) {
    rightArrow.style.display = arrowDisplay;
    rightArrow.disabled = projIndex >= cards.length - getVisibleCount();
  }
}

window.slideProjects = function (dir) {
  const max = cards.length - getVisibleCount();
  projIndex = Math.max(0, Math.min(projIndex + dir, max));
  updateSlider();
};

window.goToProject = function (i) {
  projIndex = i;
  updateSlider();
};

updateSlider();
window.addEventListener("resize", updateSlider);

/* 3D Parallax on each card */
cards.forEach((card) => {
  const inner = card.querySelector(".proj-card-inner");
  let rafId = null;
  let latestEvent = null;

  function updateCardTilt(e) {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    const rotX = -y * 10;
    const rotY = x * 10;
    inner.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    rafId = null;
  }

  card.addEventListener("mousemove", (e) => {
    latestEvent = e;
    if (rafId) return;
    rafId = window.requestAnimationFrame(() => updateCardTilt(latestEvent));
  });

  card.addEventListener("mouseleave", () => {
    if (rafId) {
      window.cancelAnimationFrame(rafId);
      rafId = null;
    }
    inner.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)";
  });
});
