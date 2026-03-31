document.addEventListener('DOMContentLoaded', () => {
  initServiceIntroBody();
});

function initServiceIntroBody() {
  const body = document.querySelector('.js-service-intro-body');
  if (!body) return;

  if (window.matchMedia('(max-width: 767px)').matches) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          requestAnimationFrame(() => body.classList.add('is-visible'));
          observer.unobserve(body);
        }
      });
    },
    { threshold: 0 }
  );

  observer.observe(body);
}