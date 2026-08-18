/* Menue: Burger-Knopf, Untermenue "Leistungen" und die Umleitung alter
   #/-Adressen auf die neuen Einzelseiten. */
(function () {
  var ZIEL = {
    'start': 'index.html', 'leistungen': 'leistungen.html',
    'umsatzrechner': 'umsatzrechner.html', 'standorte-preise': 'standorte-preise.html',
    'ueber-uns': 'ueber-uns.html', 'kontakt': 'kontakt.html',
    'impressum': 'impressum.html', 'datenschutz': 'datenschutz.html'
  };
  /* Alte Lesezeichen und geteilte Links wie #/leistungen/svc-foto */
  if (location.hash.indexOf('#/') === 0) {
    var teile = location.hash.slice(2).split('/');
    var datei = ZIEL[teile[0]];
    if (datei) {
      location.replace('/' + datei + (teile[1] ? '#' + teile[1] : ''));
      return;
    }
  }
  var nav = document.getElementById('mainnav');
  var burger = document.getElementById('burger');
  if (burger && nav) {
    burger.addEventListener('click', function () {
      var offen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', offen);
    });
  }
  document.querySelectorAll('.sub-toggle').forEach(function (t) {
    t.addEventListener('click', function (e) {
      e.preventDefault();
      var hs = t.closest('.has-sub');
      var offen = hs.classList.toggle('open');
      t.setAttribute('aria-expanded', offen);
    });
  });
})();
