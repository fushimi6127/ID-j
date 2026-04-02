// =========================================
// Case.js
// Caseページ専用: ケース切り替え（テキスト＋写真）+ スライド切り替え + 自動スライド
// =========================================

document.addEventListener('DOMContentLoaded', function () {

  const page = document.querySelector('.p-case-page');
  if (!page) return;

  const paginationBtns = page.querySelectorAll('.js-case-page-pagination-btn');
  const caseItems      = page.querySelectorAll('.js-case-page-item');
  const bodyItems      = page.querySelectorAll('.js-case-page-body');
  const thumbBtns      = page.querySelectorAll('.js-case-thumb-btn'); // 追加

  const SLIDE_INTERVAL = 4000;
  let autoSlideTimer = null;

  // ----------------------------------------
  // 自動スライド
  // ----------------------------------------
  function startAutoSlide(caseItem) {
    stopAutoSlide();

    const slidesContainer = caseItem.querySelector('.p-case-page-item__slides');
    if (!slidesContainer) return;

    const slides = slidesContainer.querySelectorAll('.p-case-page-item__slide');
    if (slides.length <= 1) return;

    autoSlideTimer = setInterval(function () {
      const currentIndex = Array.from(slides).findIndex(function (slide) {
        return slide.classList.contains('is-active');
      });
      const nextIndex = (currentIndex + 1) % slides.length;
      activateSlide(slidesContainer, nextIndex);
    }, SLIDE_INTERVAL);
  }

  function stopAutoSlide() {
    if (autoSlideTimer !== null) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  // ----------------------------------------
  // ケース切り替え: テキスト＋写真を同時に切り替え
  // ----------------------------------------
  function activateCase(caseId) {
    // 写真エリア切り替え
    caseItems.forEach(function (item) {
      item.classList.remove('is-active');
    });
    const targetItem = document.getElementById(caseId);
    if (targetItem) {
      targetItem.classList.add('is-active');
      resetSlides(targetItem);
      startAutoSlide(targetItem);
    }

    // テキストエリア切り替え
    bodyItems.forEach(function (body) {
      body.classList.remove('is-active');
    });
    const targetBody = page.querySelector('.js-case-page-body[data-case="' + caseId + '"]');
    if (targetBody) {
      targetBody.classList.add('is-active');
    }

    // ページネーションボタン状態更新
    paginationBtns.forEach(function (btn) {
      const isTarget = btn.dataset.case === caseId;
      btn.classList.toggle('is-active', isTarget);
      btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
    });

    // サムネイルのis-active更新（現在表示中ケースをdim）
    thumbBtns.forEach(function (btn) {
      btn.classList.toggle('is-active', btn.dataset.case === caseId);
    });
  }

  paginationBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateCase(btn.dataset.case);
    });
  });

  // サムネイルクリックでケース切り替え
  thumbBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activateCase(btn.dataset.case);
    });
  });

  // ----------------------------------------
  // スライド切り替え
  // ----------------------------------------
  function activateSlide(slidesContainer, targetIndex) {
    const slides = slidesContainer.querySelectorAll('.p-case-page-item__slide');
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === targetIndex);
    });

    const media = slidesContainer.closest('.p-case-page-item__media');
    if (!media) return;

    const navBtns = media.querySelectorAll('.js-case-page-slide-nav-btn');
    navBtns.forEach(function (btn) {
      const isTarget = Number(btn.dataset.target) === targetIndex;
      btn.classList.toggle('is-active', isTarget);
      btn.setAttribute('aria-pressed', isTarget ? 'true' : 'false');
    });
  }

  function resetSlides(caseItem) {
    const slidesContainer = caseItem.querySelector('.p-case-page-item__slides');
    if (slidesContainer) {
      activateSlide(slidesContainer, 0);
    }
  }

  // 各ケースのスライドナビにイベント登録
  // 手動クリック時はタイマーをリセットして再起動
  caseItems.forEach(function (item) {
    const slidesContainer = item.querySelector('.p-case-page-item__slides');
    if (!slidesContainer) return;

    const navBtns = item.querySelectorAll('.js-case-page-slide-nav-btn');
    navBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        activateSlide(slidesContainer, Number(btn.dataset.target));
        // 手動操作後はタイマーをリセットして再起動
        startAutoSlide(item);
      });
    });
  });

  // ----------------------------------------
  // 初期表示: URLハッシュがあればそのケースをアクティブに、なければ is-active を維持
  // ----------------------------------------
  const hash = location.hash.replace('#', '');
  const validIds = Array.from(caseItems).map(function (item) {
    return item.id;
  });

  if (hash && validIds.includes(hash)) {
    activateCase(hash);
  } else {
    const initialActiveItem = page.querySelector('.js-case-page-item.is-active');
    if (initialActiveItem) {
      startAutoSlide(initialActiveItem);
      // 初期サムネイルのis-activeも設定
      thumbBtns.forEach(function (btn) {
        btn.classList.toggle('is-active', btn.dataset.case === initialActiveItem.id);
      });
    }
  }
});