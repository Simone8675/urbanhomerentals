(function () {
  const basePreis = { studio: 55, two: 79, three: 109 };
  const locMult   = { zentral: 1.12, stadt: 1.0, umland: 0.88, andere: 1.0 };
  const baseOcc   = { zentral: 60, stadt: 56, umland: 50, andere: 54 };
  const PLATFORM  = 0.15;
  const CLEANING  = 0.03;
  const PROVISION = { cohosting: 0.20, marketing: 0.12 };
  let mode = 'monat';
  const el = id => document.getElementById(id);
  const fmt = n => n.toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €';
  function applyPreset() {
    const loc = el('standort').value, size = el('groesse').value;
    const p = Math.round((basePreis[size] * locMult[loc]) / 5) * 5;
    el('preis').value = Math.min(300, Math.max(30, p));
    el('auslastung').value = baseOcc[loc];
    update();
  }
  function setFill(input) {
    const min = +input.min, max = +input.max, v = +input.value;
    input.style.setProperty('--fill', ((v - min) / (max - min) * 100) + '%');
  }
  function setMode(m) {
    mode = m;
    el('tMonat').classList.toggle('active', m === 'monat');
    el('tJahr').classList.toggle('active', m === 'jahr');
    el('tMonat').setAttribute('aria-pressed', m === 'monat');
    el('tJahr').setAttribute('aria-pressed', m === 'jahr');
    update();
  }
  function update() {
    const preis = +el('preis').value;
    const occ = +el('auslastung').value;
    el('preisVal').textContent = preis;
    el('auslastungVal').textContent = occ;
    setFill(el('preis')); setFill(el('auslastung'));
    const umsatzJ = preis * (occ / 100) * 365;
    const platformJ = umsatzJ * PLATFORM;
    const reinigungJ = umsatzJ * CLEANING;
    const nettoumsatzJ = umsatzJ - platformJ - reinigungJ;
    const prov = PROVISION[el('paket').value] ?? 0.20;
    const provJ = nettoumsatzJ * prov;
    const nettoJ = nettoumsatzJ - provJ;
    el('provLbl').innerHTML = 'Unsere Betreuung (' + Math.round(prov * 100) + '&nbsp;% v. Netto)';
    const div = mode === 'monat' ? 12 : 1;
    const suffix = mode === 'monat' ? 'Monat' : 'Jahr';
    el('umsatz').textContent = fmt(umsatzJ / div);
    el('platform').textContent = '– ' + fmt(platformJ / div);
    el('reinigung').textContent = '– ' + fmt(reinigungJ / div);
    el('nettoumsatz').textContent = fmt(nettoumsatzJ / div);
    el('provision').textContent = '– ' + fmt(provJ / div);
    el('nettoRow').textContent = fmt(nettoJ / div);
    el('nettoBig').textContent = fmt(nettoJ / div);
    el('nettoCap').textContent = 'Netto-Ertrag pro ' + suffix;
    el('lblUmsatz').textContent = 'Geschätzter Umsatz (pro ' + suffix + ')';
    el('nettoSub').textContent = mode === 'monat' ? '≈ ' + fmt(nettoJ) + ' pro Jahr' : '≈ ' + fmt(nettoJ / 12) + ' pro Monat';
  }
  el('standort').addEventListener('change', applyPreset);
  el('groesse').addEventListener('change', applyPreset);
  el('preis').addEventListener('input', update);
  el('auslastung').addEventListener('input', update);
  el('paket').addEventListener('change', update);
  el('tMonat').addEventListener('click', () => setMode('monat'));
  el('tJahr').addEventListener('click', () => setMode('jahr'));
  applyPreset();
})();
