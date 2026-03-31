(function () {
  "use strict";

  var cards = document.querySelectorAll(".js-import-category-card");

  if (!cards.length) {
    return;
  }

  function setActiveCard(targetCard) {
    cards.forEach(function (card) {
      card.classList.remove("is-active");
    });

    if (targetCard) {
      targetCard.classList.add("is-active");
    }
  }

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      setActiveCard(card);
    });

    card.addEventListener("mouseleave", function () {
      card.classList.remove("is-active");
    });

    card.addEventListener("focusin", function () {
      setActiveCard(card);
    });

    card.addEventListener("focusout", function () {
      card.classList.remove("is-active");
    });

    card.addEventListener("click", function () {
      if (window.innerWidth <= 767) {
        if (card.classList.contains("is-active")) {
          card.classList.remove("is-active");
        } else {
          setActiveCard(card);
        }
      }
    });
  });
})();

document.addEventListener("DOMContentLoaded", function () {
  var phases = document.querySelectorAll(".js-import-flow-phase");

  if (!phases.length) {
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2
    }
  );

  phases.forEach(function (phase) {
    observer.observe(phase);
  });
});

document.addEventListener("DOMContentLoaded", function () {
  var phases = document.querySelectorAll(".js-import-flow-phase");

  if (!phases.length) return;

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        // 全phaseにis-visibleを付与（delayはCSS側で制御）
        phases.forEach(function (phase) {
          phase.classList.add("is-visible");
        });

        obs.disconnect();
      });
    },
    {
      threshold: 0.2
    }
  );

  // 最初のphaseを監視トリガーにする
  observer.observe(phases[0]);
});

