/**
 * Mainvisual Animation
 * ---
 * Phase 1: 黒背景 + 白文字でキャッチコピー clip-path reveal → fade out（ヘッダー非表示）
 * Phase 2: 白背景に切り替え → GSAP scale(1.4→1) でメインテキスト staggered 表示（ヘッダー復帰）
 * Phase 3: Scroll hint fade-in
 *
 * 依存: GSAP 3.12.5
 * 読み込み順: gsap.min.js → mv-animation.js → common.js
 * 呼び出し: common.js の DOMContentLoaded 内で initMainvisualAnimation() を実行
 */
function initMainvisualAnimation() {
  var section = document.getElementById("js-mainvisual");
  if (!section) return;

  var catchcopy = section.querySelector(".js-mv-catch");
  var lines = section.querySelectorAll(".js-mv-line");
  var scrollHint = section.querySelector(".js-mv-scroll");
  var header = document.querySelector(".l-header");

  if (!catchcopy || !lines.length || !scrollHint) return;

  // Reset initial state
  gsap.set(catchcopy, {
    opacity: 0,
    clipPath: "inset(0 100% 0 0)",
    display: "block",
  });
  gsap.set(lines, { opacity: 0, scale: 1.4 });
  gsap.set(scrollHint, { opacity: 0 });

  // Phase 1: 黒背景 + 白文字で開始
  gsap.set(section, { backgroundColor: "#111" });
  gsap.set(catchcopy, { color: "#fff" });

  // Hide header during Phase 1
  if (header) {
    gsap.set(header, {
      opacity: 0,
      pointerEvents: "none",
    });
  }

  var tl = gsap.timeline({ delay: 0.3 });

  // Phase 1: Catchcopy clip-in
  tl.to(catchcopy, {
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    duration: 0.6,
    ease: "power3.out",
  });

  // Hold
  tl.to(catchcopy, { delay: 0.8 });

  // Catchcopy fade out + background transition to white
  tl.to(catchcopy, {
    opacity: 0,
    duration: 0.4,
    ease: "power2.in",
    onComplete: function () {
      catchcopy.style.display = "none";
    },
  });

  tl.to(
    section,
    {
      backgroundColor: "#fff",
      duration: 0.5,
      ease: "power2.inOut",
    },
    "-=0.3"
  );

  // Phase 2: Main text staggered scale-in
  lines.forEach(function (line, index) {
    tl.to(
      line,
      {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        onStart:
          index === 0 && header
            ? function () {
                gsap.to(header, {
                  opacity: 1,
                  pointerEvents: "auto",
                  duration: 0.4,
                  ease: "power2.out",
                });
              }
            : undefined,
      },
      index === 0 ? "-=0.1" : "-=0.5"
    );
  });

  // Phase 3: Scroll hint fade-in
  tl.to(
    scrollHint,
    {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
    },
    "-=0.3"
  );
}