// =========================
// DOMContentLoaded
// =========================
document.addEventListener("DOMContentLoaded", function () {
  var isTopPage =
    document.body.classList.contains("home") ||
    document.body.classList.contains("front-page");

  var hasPlayedIntro = sessionStorage.getItem("topIntroPlayed") === "true";

  // -------------------------
  // ::after用アニメーション発火（.c-section-catch）
  // -------------------------
  initSectionCatchAnimation(isTopPage, hasPlayedIntro);

  // -------------------------
  // スムーズスクロール
  // -------------------------
  initSmoothScroll();

  // -------------------------
  // ハンバーガーメニュー制御
  // -------------------------
  initHamburgerMenu();

  // -------------------------
  // 見出しアニメーション（split-char）
  // -------------------------
  initMatrixAnimation(isTopPage, hasPlayedIntro);

  // -------------------------
  // TOPへ戻る（コンパスアイコン）
  // -------------------------
  initBackToTop();

  // -------------------------
  // Swiper
  // -------------------------
  initSwipers();

  // -------------------------
  // サービスカード表示アニメーション
  // -------------------------
  initServiceCardAnimation();

  // -------------------------
  // カウントアップアニメーション
  // -------------------------
  initCountUp();

  // -------------------------
  // メインビジュアルアニメーション
  // （mv-animation.js で定義）
  // -------------------------
  if (typeof initMainvisualAnimation === "function") {
    initMainvisualAnimation();
  }

  // -------------------------
  // カスタムカーソル
  // -------------------------
  initCustomCursor();

  // -------------------------
  // Import Intro body アニメーション
  // -------------------------
  initImportIntroAnimation();

  // -------------------------
  // Import カテゴリカード hover/tap
  // -------------------------
  initImportCategoryCards();

  // -------------------------
  // Import フロー アニメーション
  // -------------------------
  initImportFlowAnimation();

  // -------------------------
  // Service Intro body アニメーション
  // -------------------------
  initServiceIntroBody();

  // -------------------------
  // Scope 矢印 アニメーション
  // -------------------------
  initScopeArrows();

initScrollHint();
  // -------------------------
  // Strength ページアニメーション
  // -------------------------
  initStrengthPage();

  document.fonts.ready.then(function () {
    document.body.classList.add("fonts-loaded");
  });
});

window.addEventListener("pageshow", function () {
  initHeaderColorSwitch();
});

// =========================
// window.load
// =========================
window.addEventListener("load", function () {
  var isTopPage =
    document.body.classList.contains("home") ||
    document.body.classList.contains("front-page");

  var hasPlayedIntro = sessionStorage.getItem("topIntroPlayed") === "true";

  // -------------------------
  // 下からふわっと出るアニメーション（.downAnime）
  // -------------------------
  initSlideAnime(isTopPage, hasPlayedIntro);

  if (isTopPage && !hasPlayedIntro) {
    sessionStorage.setItem("topIntroPlayed", "true");
  }
});

// =========================
// .c-section-catch
// =========================
function initSectionCatchAnimation(isTopPage, hasPlayedIntro) {
  var catches = document.querySelectorAll(".c-section-catch");

  if (!catches.length) return;

  if (isTopPage && hasPlayedIntro) {
    catches.forEach(function (el) {
      el.classList.add("is-active");
    });
    return;
  }

  var catchObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-active");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.5,
    }
  );

  catches.forEach(function (el) {
    catchObserver.observe(el);
  });
}

// =========================
// スムーズスクロール
// =========================
function initSmoothScroll() {
  var anchorLinks = document.querySelectorAll('a[href^="#"]');
  var header = document.querySelector("header");

  if (!anchorLinks.length) return;

  anchorLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      var targetId = this.getAttribute("href");

      if (!targetId || targetId === "#") return;

      var targetElement = document.querySelector(targetId);

      if (!targetElement) return;

      event.preventDefault();

      var headerHeight = header ? header.offsetHeight : 0;
      var targetPosition =
        targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    });
  });
}

// =========================
// ハンバーガーメニュー制御
// =========================
function initHamburgerMenu() {
  var hamburger = document.querySelector(".l-header__hamburger");
  var navSp = document.querySelector(".l-header__nav-sp");
  var navLinks = document.querySelectorAll(".l-header__nav-sp a");
  var closeBtn = document.querySelector(".js-nav-sp-close");

  if (!hamburger || !navSp) return;

  function setSpNavOpen(open) {
    hamburger.classList.toggle("is-active", open);
    navSp.classList.toggle("is-active", open);
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    navSp.setAttribute("aria-hidden", open ? "false" : "true");
    document.body.classList.toggle("is-nav-sp-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }

  hamburger.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();
    setSpNavOpen(!navSp.classList.contains("is-active"));
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      setSpNavOpen(false);
    });
  }

  document.addEventListener("click", function (e) {
    var isInsideMenu = e.target.closest(".l-header__nav-sp");
    var isHamburger = e.target.closest(".l-header__hamburger");

    if (!isInsideMenu && !isHamburger) {
      setSpNavOpen(false);
    }
  });

  navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
      setSpNavOpen(false);
    });
  });
}

// =========================
// 見出しアニメーション（split-char）
// .bgappearTrigger のテキストを1文字ずつ分割
// <br> タグを保持
// .js-matrix に .is-animated を付与して発火
// =========================
function initMatrixAnimation(isTopPage, hasPlayedIntro) {
  var matrices = document.querySelectorAll(".js-matrix");

  if (!matrices.length) return;

  // -----------------------------------------
  // .bgappearTrigger のテキストを split-char 方式で分割
  // innerHTML を走査して <br> を保持する
  // -----------------------------------------
  var splitTargets = document.querySelectorAll(".js-matrix .bgappearTrigger");

  splitTargets.forEach(function (el) {
    var nodes = el.childNodes;
    var html = "";
    var charIndex = 0;

    for (var n = 0; n < nodes.length; n++) {
      var node = nodes[n];

      // 要素ノード（<br> 等）はそのまま保持
      if (node.nodeType === 1) {
        html += node.outerHTML;
        continue;
      }

      // テキストノードを1文字ずつ分割
      if (node.nodeType === 3) {
        var text = node.textContent;

        for (var i = 0; i < text.length; i++) {
          var ch = text[i];
          if (ch === " " || ch === "\u00A0") {
            html += " ";
          } else if (ch === "\n" || ch === "\r") {
            continue;
          } else {
            var delay = charIndex * 0.035;
            html +=
              '<span class="split-char__letter" style="transition-delay:' +
              delay.toFixed(3) +
              's">' +
              ch +
              "</span>";
            charIndex++;
          }
        }
      }
    }

    el.innerHTML = html;
  });

  // -----------------------------------------
  // アニメーション発火
  // -----------------------------------------
  var activateHeading = function (target) {
    target.classList.add("is-animated");
  };

  if (isTopPage && hasPlayedIntro) {
    matrices.forEach(function (matrix) {
      activateHeading(matrix);
    });
    return;
  }

  var matrixObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        activateHeading(entry.target);
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  matrices.forEach(function (matrix) {
    matrixObserver.observe(matrix);
  });
}

// =========================
// スクロールに応じた header 色切り替え
// pageshow から起動（スクロール復元後）。リスナーは1回だけ登録。
// =========================
function initHeaderColorSwitch() {
  var headerEl = document.querySelector(".l-header");
  var sections = document.querySelectorAll("section");
  var body = document.body;

  if (!headerEl || !sections.length) return;

  var sectionList = Array.prototype.slice.call(sections);
  var sectionTops = [];

  var recomputeSectionTops = function () {
    var y = window.scrollY;
    sectionTops = sectionList.map(function (section) {
      return section.getBoundingClientRect().top + y;
    });
  };

  var updateColor = function () {
    var currentSection = null;
    var triggerY = window.scrollY + window.innerHeight * 0.3;

    for (var i = 0; i < sectionList.length; i++) {
      if (sectionTops[i] <= triggerY) {
        currentSection = sectionList[i];
      } else {
        break;
      }
    }

    if (!currentSection) return;

    // -------------------------
    // header 色切り替え
    // -------------------------
    if (currentSection.classList.contains("is-dark")) {
      headerEl.classList.remove("is-white");
      headerEl.classList.add("is-dark");
    } else {
      headerEl.classList.remove("is-dark");
      headerEl.classList.add("is-white");
    }

    // -------------------------
    // body 背景切り替え
    // -------------------------
    body.classList.remove("theme-dark", "theme-light");

    if (currentSection.classList.contains("is-dark")) {
      body.classList.add("theme-dark");
    } else {
      body.classList.add("theme-light");
    }
  };

  function syncTheme() {
    recomputeSectionTops();
    updateColor();
  }

  var ticking = false;
  var onScroll = function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateColor();
      ticking = false;
    });
  };

  if (!initHeaderColorSwitch._initialized) {
    initHeaderColorSwitch._initialized = true;

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", function () {
      recomputeSectionTops();
      onScroll();
    });
  }

  // 復元直後の scrollY / レイアウトずれに合わせて複数フレームで再同期し、確定後に is-ready（transition 有効化）
  syncTheme();
  requestAnimationFrame(function () {
    syncTheme();
    requestAnimationFrame(function () {
      syncTheme();
      headerEl.classList.add("is-ready");
    });
  });
}

// =========================
// TOPへ戻る（コンパス回転 + body.theme に合わせて配色）
// =========================
function initBackToTop() {
  var btn = document.querySelector(".js-back-to-top");
  if (!btn) return;

  var icon = btn.querySelector(".c-back-to-top__icon");
  var rotation = 0;
  var threshold = 400;
  var ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      if (window.scrollY > threshold) {
        btn.classList.add("is-visible");
        btn.setAttribute("aria-hidden", "false");
      } else {
        btn.classList.remove("is-visible");
        btn.setAttribute("aria-hidden", "true");
      }
      ticking = false;
    });
  }

  btn.addEventListener("click", function () {
    rotation += 720;
    if (icon) {
      icon.style.transform = "rotate(" + rotation + "deg)";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// =========================
// 下からふわっと出るアニメーション（.downAnime）
// =========================
function initSlideAnime(isTopPage, hasPlayedIntro) {
  var downAnimeElements = document.querySelectorAll(".downAnime");

  if (!downAnimeElements.length) return;

  if (isTopPage && hasPlayedIntro) {
    downAnimeElements.forEach(function (el) {
      el.classList.add("slideAnimeDownUp");
      var inner = el.querySelector(".downAnimeInner");
      if (inner) {
        inner.classList.add("slideAnimeUpDown");
      }
    });
    return;
  }

  var scrollTop = window.scrollY;
  var windowHeight = window.innerHeight;

  downAnimeElements.forEach(function (el) {
    var elemPos = el.getBoundingClientRect().top + scrollTop - 50;

    if (scrollTop >= elemPos - windowHeight) {
      el.classList.add("slideAnimeDownUp");
      var inner = el.querySelector(".downAnimeInner");
      if (inner) {
        inner.classList.add("slideAnimeUpDown");
      }
    }
  });
}

// =========================
// Import Intro body アニメーション
// =========================
function initImportIntroAnimation() {
  var bodies = document.querySelectorAll('.js-import-intro-body');
  if (!bodies.length) return;

  // SP ではスクロール連動の is-visible を付けない（CSS で常時表示）
  if (window.matchMedia('(max-width: 767px)').matches) {
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(function () {
          entry.target.classList.add('is-visible');
        });
        obs.unobserve(entry.target);
      });
    },
    {
      threshold: 0.2,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  bodies.forEach(function (el) {
    observer.observe(el);
  });
}

// =========================
// Import カテゴリカード hover/tap
// （旧 import.js の IIFE 部分）
// =========================
function initImportCategoryCards() {
  var categoryRoot = document.querySelector(".p-import-category");
  if (categoryRoot) {
    categoryRoot.addEventListener(
      "focusin",
      function (e) {
        var t = e.target;
        if (t !== categoryRoot && categoryRoot.contains(t) && typeof t.blur === "function") {
          t.blur();
        }
      },
      true
    );
  }

  var cards = document.querySelectorAll(".js-import-category-card");
  if (!cards.length) return;

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
}

// =========================
// Import フロー アニメーション
// （旧 import.js の重複DOMContentLoaded を統合・修正）
// 最初のフェーズが見えたら全フェーズに is-visible を一括付与
// delay は CSS 側で制御
// =========================
function initImportFlowAnimation() {
  var phases = document.querySelectorAll(".js-import-flow-phase");
  if (!phases.length) return;

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        phases.forEach(function (phase) {
          phase.classList.add("is-visible");
        });

        obs.disconnect();
      });
    },
    {
      threshold: 0.2,
    }
  );

  // 最初のフェーズを監視トリガーにする
  observer.observe(phases[0]);
}

// =========================
// Service Intro body アニメーション
// （旧 outbound.js）
// =========================
function initServiceIntroBody() {
  var body = document.querySelector('.js-service-intro-body');
  if (!body) return;

  // SP ではスクロール連動の is-visible を付けない（CSS で常時表示）— p-import-intro と同じ
  if (window.matchMedia('(max-width: 767px)').matches) {
    return;
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        requestAnimationFrame(function () {
          body.classList.add('is-visible');
        });
        obs.unobserve(body);
      });
    },
    { threshold: 0 }
  );

  observer.observe(body);
}

// =========================
// Scope 矢印 アニメーション
// （旧 scope.js）
// =========================
function initScopeArrows() {
  var target = document.querySelector(".js-scope-arrows");
  if (!target) return;

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        target.classList.add("is-visible");
        obs.unobserve(target);
      });
    },
    {
      threshold: 0.3,
    }
  );

  observer.observe(target);
}

// =========================
// Swiper
// =========================
function initSwipers() {
  if (typeof Swiper === "undefined") return;

  var serviceSlider = document.querySelector(".p-service-slider__swiper");

  if (serviceSlider) {
    var serviceNext = serviceSlider.querySelector(".swiper-button-next");
    var servicePrev = serviceSlider.querySelector(".swiper-button-prev");

    new Swiper(".p-service-slider__swiper", {
      loop: false,
      slidesPerGroup: 1,
      spaceBetween: 0,
      centeredSlides: false,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: 2,
        },
      },
      navigation: {
        nextEl: serviceNext,
        prevEl: servicePrev,
      },
    });
  }

  var strengthSlider = document.querySelector(".strength-swiper");

  if (strengthSlider) {
    var strengthNext = document.querySelector(".strength-next");
    var strengthPrev = document.querySelector(".strength-prev");
    var strengthPagination = document.querySelector(".strength-pagination");

    new Swiper(".strength-swiper", {
      loop: true,
      slidesPerView: 1,
      slidesPerGroup: 1,
      navigation: {
        nextEl: strengthNext,
        prevEl: strengthPrev,
      },
      pagination: {
        el: strengthPagination,
        clickable: true,
      },
    });
  }
}

// =========================
// p-works カード is-current 制御
// 表示中の1枚だけ .is-current（::after の暗さを解除して明るく見せる）
// 文書上の各カード先頭位置で区間分け（sticky 重なりでも最後の1枚に偏らない）
// =========================
(function () {
  "use strict";

  var cards = Array.from(document.querySelectorAll(".p-works__card"));
  if (!cards.length) return;

  var cardTopsDoc = [];

  /** 文書全体での要素上端（offsetParent を辿る） */
  function getDocumentTop(el) {
    var y = 0;
    var n = el;
    while (n) {
      y += n.offsetTop;
      n = n.offsetParent;
    }
    return y;
  }

  function recomputeCardTops() {
    cardTopsDoc = cards.map(function (card) {
      return getDocumentTop(card);
    });
  }

  /** ビューポート上のどの位置を「今どのカードか」の基準にするか */
  var ANCHOR_RATIO = 0.4;

  function pickCurrentIndex(scrollY, vh) {
    var y = scrollY + vh * ANCHOR_RATIO;
    var n = cardTopsDoc.length;
    if (n === 1) {
      return 0;
    }
    if (y < cardTopsDoc[0]) {
      return 0;
    }
    for (var i = 0; i < n; i++) {
      var nextTop = i < n - 1 ? cardTopsDoc[i + 1] : Infinity;
      if (y >= cardTopsDoc[i] && y < nextTop) {
        return i;
      }
    }
    return n - 1;
  }

  function updateCurrentCard() {
    var idx = pickCurrentIndex(window.scrollY, window.innerHeight);
    var current = cards[idx];

    cards.forEach(function (card) {
      card.classList.toggle("is-current", card === current);
    });
  }

  var ticking = false;
  function requestUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      updateCurrentCard();
      ticking = false;
    });
  }

  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", function () {
    recomputeCardTops();
    requestUpdate();
  });
  window.addEventListener("load", function () {
    recomputeCardTops();
    requestUpdate();
  });
  recomputeCardTops();
  updateCurrentCard();
})();

// =========================
// サービスカード表示アニメーション
// =========================
function initServiceCardAnimation() {
  var serviceCards = document.querySelectorAll(".js-service-card");
  if (!serviceCards.length) return;

  var serviceObserver = new IntersectionObserver(
    function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  serviceCards.forEach(function (card) {
    serviceObserver.observe(card);
  });
}

// =========================
// カウントアップアニメーション
// （旧 Countup_snippet.js を関数化して統合）
// =========================
function initCountUp() {
  var elements = document.querySelectorAll(".js-countup");
  if (!elements.length) return;

  function countUp(el) {
    var target = parseFloat(el.dataset.countTo);
    var decimals = parseInt(el.dataset.countDecimal, 10) || 0;
    var duration = 2000;
    var startTime = performance.now();

    if (isNaN(target)) return;

    function update(currentTime) {
      var elapsed = currentTime - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 4);
      var current = eased * target;

      el.textContent = current.toFixed(decimals);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = target.toFixed(decimals);
      }
    }

    requestAnimationFrame(update);
  }

  var observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.5 }
  );

  elements.forEach(function (el) {
    observer.observe(el);
  });
}

// =========================
// カスタムカーソル
// lerp追従 + mix-blend-mode: difference
// ホバー時に拡大 + テキスト表示
// =========================
function initCustomCursor() {
  // SP では無効化
  if (window.matchMedia("(max-width: 768px)").matches) return;

  var cursor = document.getElementById("js-cursor");
  var cursorText = document.getElementById("js-cursor-text");

  if (!cursor) return;

  var mouseX = -100;
  var mouseY = -100;
  var cursorX = -100;
  var cursorY = -100;
  var halfW = cursor.getBoundingClientRect().width / 2;
  var halfH = cursor.getBoundingClientRect().height / 2;
  var lerp = 1.0;
  var rafId = null;
  var isPointerInside = false;

  function updateCursorHalfSize() {
    var rect = cursor.getBoundingClientRect();
    halfW = rect.width / 2;
    halfH = rect.height / 2;
  }

  function tickCursor() {
    cursorX += (mouseX - cursorX) * lerp;
    cursorY += (mouseY - cursorY) * lerp;

    cursor.style.transform =
      "translate3d(" +
      (cursorX - halfW).toFixed(2) +
      "px," +
      (cursorY - halfH).toFixed(2) +
      "px,0)";

    // 停止条件: ポインタが画面外 かつ ほぼ追従完了
    var done =
      !isPointerInside &&
      Math.abs(mouseX - cursorX) < 0.1 &&
      Math.abs(mouseY - cursorY) < 0.1;

    if (done) {
      rafId = null;
      return;
    }

    rafId = requestAnimationFrame(tickCursor);
  }

  function ensureTicking() {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(tickCursor);
  }

  document.addEventListener(
    "pointermove",
    function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isPointerInside = true;
      ensureTicking();
    },
    { passive: true }
  );

  document.addEventListener("pointerleave", function () {
    isPointerInside = false;
    mouseX = -100;
    mouseY = -100;
    ensureTicking();
    cursor.classList.remove("is-hover", "is-view");
  });

  // サイズ変更時（hover/view時）だけ中心座標を再計算
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(updateCursorHalfSize);
    ro.observe(cursor);
  }

  // ホバー検出はイベント委譲で軽量化
  document.addEventListener("pointerover", function (e) {
    var target = e.target.closest("[data-cursor]");
    if (!target) return;

    var type = target.getAttribute("data-cursor");
    if (type === "hover") {
      cursor.classList.add("is-hover");
      cursor.classList.remove("is-view");
    } else {
      cursor.classList.remove("is-hover");
      cursor.classList.add("is-view");
      if (cursorText) {
        cursorText.textContent = type;
      }
    }
    updateCursorHalfSize();
  });

  document.addEventListener("pointerout", function (e) {
    var from = e.target.closest("[data-cursor]");
    if (!from) return;
    var to = e.relatedTarget && e.relatedTarget.closest("[data-cursor]");
    if (to === from) return;

    cursor.classList.remove("is-hover", "is-view");
    updateCursorHalfSize();
  });
}

// =========================
// Strength ページアニメーション
// gsap / ScrollTrigger の存在確認を追加
// =========================
function initStrengthPage() {
  // gsap・ScrollTrigger が未ロードの場合は何もしない
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // ScrollTrigger プラグイン登録
  gsap.registerPlugin(ScrollTrigger);

  var body = document.getElementById('js-strength-body');
  var cardsSection = document.getElementById('js-strength-cards');
  var cards = document.querySelectorAll('.js-strength-card');
  var backBtn = document.getElementById('js-strength-back');

  if (!body || !cardsSection || cards.length === 0 || !backBtn) return;

  // ----------------------------------------
  // 1. 右カラム（テキスト＋SCROLL）退場
  //    scrub でスクロール量に連動してスライド＋フェード
  // ----------------------------------------
  gsap.to(body, {
    y: '-8rem',
    opacity: 0,
    ease: 'power2.in',
    scrollTrigger: {
      trigger: cardsSection,
      start: 'top 85%',
      end: 'top 40%',
      scrub: 0.6,
    },
  });

  // ----------------------------------------
  // 2. 各カードを個別 ScrollTrigger で監視して出現
  // ----------------------------------------
  cards.forEach(function (card, i) {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: function () {
        setTimeout(function () {
          card.classList.add('is-visible');

          // 最後のカードの opacity transition 完了後に Back ボタン出現
          if (i === cards.length - 1) {
            card.addEventListener('transitionend', function onEnd(e) {
              if (e.propertyName !== 'opacity') return;
              card.removeEventListener('transitionend', onEnd);
              backBtn.setAttribute('aria-hidden', 'false');
              backBtn.classList.add('is-visible');
            });
          }
        }, i * 150);
      },
    });
  });
}

function initScrollHint() {
  var scrollHint = document.querySelector('.p-mainvisual__scroll-hint');
  var footer = document.querySelector('.l-footer');

  if (!scrollHint || !footer) return;

  var observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          scrollHint.classList.add('is-hidden');
        } else {
          scrollHint.classList.remove('is-hidden');
        }
      });
    },
    { threshold: 0 }
  );

  // animation 完了後（1.4s delay + 1s duration = 2.4s）に observe 開始
  setTimeout(function() {
    observer.observe(footer);
  }, 2400);
}
document.fonts.ready.then(function () {
  document.body.classList.add('fonts-loaded');
});