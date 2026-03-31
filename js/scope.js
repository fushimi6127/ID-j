// ============================================
// Scope Arrows - Scroll Animation Trigger
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const target = document.querySelector(".js-scope-arrows");

  if (!target) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          target.classList.add("is-visible");
          observer.unobserve(target);
        }
      });
    },
    {
      threshold: 0.3,
    }
  );

  observer.observe(target);
});