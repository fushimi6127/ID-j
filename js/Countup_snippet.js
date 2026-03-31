function countUp(el) {
  const target = parseFloat(el.dataset.countTo);       // data-count-to
  const decimals = parseInt(el.dataset.countDecimal, 10) || 0; // data-count-decimal
  const duration = 2000;
  const startTime = performance.now();

  if (isNaN(target)) return;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    const current = eased * target;

    el.textContent = current.toFixed(decimals);

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      el.textContent = target.toFixed(decimals);
    }
  }

  requestAnimationFrame(update);
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.js-countup').forEach((el) => {
  observer.observe(el);
});