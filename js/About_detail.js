/**
 * About_detail.js
 * About 下層ページ：図解アニメーション制御
 *
 * - IntersectionObserver でビューポート進入時に発火
 * - data-about-detail-step 属性でアニメーション順序を管理
 * - 1回のみ再生（再スクロールでは発火しない）
 *
 * [Fix] loading="lazy" 画像の load イベント待ちを廃止
 *       waitForImages() は lazy 画像に対して機能しないため削除
 *       代わりに rAF で1フレーム待ってからクラス付与し描画を安定化
 */
(function () {
  'use strict';

  var diagram = document.getElementById('js-about-detail-diagram');
  if (!diagram) return;

  // SP では静的 SVG のみ（図解非表示・アニメーションなし）
  var mqMobile = window.matchMedia('(max-width: 767px)');
  if (mqMobile.matches) return;

  // ステップごとの遅延時間（ms）
  var stepDelays = {
    1: 200,    // 中央矢印＋ロゴ（ビューポート進入後すぐ開始）
    2: 800,    // Starting Point
    3: 800,    // Hub リスト
    4: 1600,   // INDONESIA
    5: 1600,   // JAPAN
    6: 2200    // Business 矢印
  };

  var hasPlayed = false;

  /**
   * アニメーション再生
   * rAF で1フレーム待ってから各ステップに is-active を遅延付与
   */
  function playAnimation() {
    if (hasPlayed) return;
    hasPlayed = true;

    var steps = diagram.querySelectorAll('[data-about-detail-step]');

    requestAnimationFrame(function () {
      steps.forEach(function (el) {
        var step = parseInt(el.getAttribute('data-about-detail-step'), 10);
        var delay = stepDelays[step] || 0;

        setTimeout(function () {
          el.classList.add('is-active');
        }, delay);
      });
    });
  }

  // IntersectionObserver でビューポート 20% 進入時に発火
  // threshold を 0.3 → 0.2 に下げ、図解が大きい場合でも確実に発火させる
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playAnimation();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(diagram);
  } else {
    // フォールバック：即時表示
    playAnimation();
  }

})();