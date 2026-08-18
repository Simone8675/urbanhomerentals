(function () {
  var KEY = 'uhr-consent';
  var banner = document.getElementById('cookie-banner');
  var modal = document.getElementById('cookie-modal');
  var optMarketing = document.getElementById('cookie-opt-marketing');
  var optStatistik = document.getElementById('cookie-opt-statistik');
  var marketingLoaded = false;
  var statistikLoaded = false;

  function readConsent() {
    try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; }
  }
  function writeConsent(marketing, statistik) {
    var c = { v: 2, necessary: true, statistik: !!statistik, marketing: !!marketing, date: new Date().toISOString() };
    try { localStorage.setItem(KEY, JSON.stringify(c)); } catch (e) {}
    return c;
  }
  function applyConsent(c) {
    if (c && c.statistik) loadStatistik();
    if (c && c.marketing) loadMarketing();
  }
  function loadStatistik() {
    if (statistikLoaded) return;
    statistikLoaded = true;
    // === Microsoft Clarity (Heatmaps) – laedt nur nach Einwilligung ===
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = "https://www.clarity.ms/tag/" + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, "clarity", "script", "y3x4yrcnk9");
  }
  function loadMarketing() {
    if (marketingLoaded) return;
    marketingLoaded = true;
    // === Google Ads Tag ===
    // Sobald die Google-Ads-Conversion-ID vorliegt, hier einsetzen (AW-XXXXXXXXX):
    // var s = document.createElement('script');
    // s.async = true;
    // s.src = 'https://www.googletagmanager.com/gtag/js?id=AW-XXXXXXXXX';
    // document.head.appendChild(s);
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){ dataLayer.push(arguments); }
    // gtag('js', new Date());
    // gtag('config', 'AW-XXXXXXXXX');
  }
  function openBanner() { banner.hidden = false; }
  function closeBanner() { banner.hidden = true; }
  function openModal() {
    var c = readConsent();
    optMarketing.checked = !!(c && c.marketing);
    optStatistik.checked = !!(c && c.statistik);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = '';
  }
  function decide(marketing, statistik) {
    applyConsent(writeConsent(marketing, statistik));
    closeBanner();
    closeModal();
  }

  document.getElementById('cookie-accept').addEventListener('click', function () { decide(true, true); });
  document.getElementById('cookie-reject').addEventListener('click', function () { decide(false, false); });
  document.getElementById('cookie-open-settings').addEventListener('click', openModal);
  document.getElementById('cookie-accept-all-2').addEventListener('click', function () { decide(true, true); });
  document.getElementById('cookie-save').addEventListener('click', function () { decide(optMarketing.checked, optStatistik.checked); });
  document.getElementById('cookie-modal-backdrop').addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) closeModal(); });
  var footLink = document.getElementById('cookie-settings-link');
  if (footLink) footLink.addEventListener('click', function (e) { e.preventDefault(); openModal(); });

  var existing = readConsent();
  if (existing) { applyConsent(existing); } else { openBanner(); }
})();
