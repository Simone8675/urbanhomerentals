(function () {
  // Voreinstellungen: Preis und Auslastung
  const basePreis = { studio: 55, two: 79, three: 109 };
  const locMult   = { zentral: 1.12, stadt: 1.0, umland: 0.88, andere: 1.0 };
  const baseOcc   = { zentral: 60, stadt: 56, umland: 50, andere: 54 };

  // Voreinstellungen: echte Kosten je Aufenthalt (nicht als Prozent vom Umsatz)
  const baseRein  = { studio: 45, two: 55, three: 75 };  // Vollreinigung je Aufenthalt
  const basePers  = { studio: 2, two: 3, three: 4 };     // Personen je Aufenthalt (ein Wäscheset pro Person)
  const baseGeb   = { studio: 45, two: 55, three: 75 };  // Reinigungsgebühr, die Gäste zahlen

  const PLATFORM  = 0.15;
  const PROVISION = { cohosting: 0.20, marketing: 0.12 };

  let mode = 'monat';
  const el = id => document.getElementById(id);
  const fmt = n => n.toLocaleString('de-DE', { maximumFractionDigits: 0 }) + ' €';
  const cnt = n => n.toLocaleString('de-DE', { maximumFractionDigits: n < 10 ? 1 : 0 });
  const eur = n => n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function applyPreset(auchKosten) {
    const loc = el('standort').value, size = el('groesse').value;
    const p = Math.round((basePreis[size] * locMult[loc]) / 5) * 5;
    el('preis').value = Math.min(300, Math.max(30, p));
    el('auslastung').value = baseOcc[loc];
    if (auchKosten) {
      el('kRein').value   = baseRein[size];
      el('kPers').value    = basePers[size];
      el('gGebuehr').value = baseGeb[size];
    }
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
    const preis   = +el('preis').value;
    const occ     = +el('auslastung').value;
    const dauer   = Math.max(1, +el('dauer').value);
    const kRein   = +el('kRein').value;
    const kPers   = +el('kPers').value;
    const kSet    = +el('kSet').value;
    const gGebuehr= +el('gGebuehr').value;

    // Anzeige der Schieberegler
    el('preisVal').textContent      = preis;
    el('auslastungVal').textContent = occ;
    el('dauerVal').textContent      = dauer + (dauer === 1 ? ' Nacht' : ' Nächte');
    el('kReinVal').textContent      = kRein;
    el('kPersVal').textContent      = kPers;
    el('kSetVal').textContent       = eur(kSet);
    el('gGebuehrVal').textContent   = gGebuehr;
    ['preis', 'auslastung', 'dauer', 'kRein', 'kPers', 'kSet', 'gGebuehr'].forEach(id => setFill(el(id)));

    // Rechnung pro Jahr
    const naechteJ     = (occ / 100) * 365;
    const aufenthalteJ = naechteJ / dauer;
    const mieteJ       = preis * naechteJ;
    const gebuehrenJ   = aufenthalteJ * gGebuehr;
    const umsatzJ      = mieteJ + gebuehrenJ;
    const platformJ    = umsatzJ * PLATFORM;
    const reinigungJ   = aufenthalteJ * kRein;
    const waescheJ     = aufenthalteJ * kPers * kSet;
    const nettoumsatzJ = umsatzJ - platformJ - reinigungJ - waescheJ;
    const prov  = PROVISION[el('paket').value] ?? 0.20;
    const provJ = Math.max(0, nettoumsatzJ) * prov;
    const nettoJ = nettoumsatzJ - provJ;

    const div    = mode === 'monat' ? 12 : 1;
    const suffix = mode === 'monat' ? 'Monat' : 'Jahr';
    const auf    = aufenthalteJ / div;

    el('detMiete').innerHTML   = cnt(naechteJ / div) + ' Nächte × ' + preis + '&nbsp;€';
    el('miete').textContent    = fmt(mieteJ / div);
    el('detGebuehren').innerHTML = cnt(auf) + ' Aufenthalte × ' + gGebuehr + '&nbsp;€';
    el('gebuehren').textContent  = '+ ' + fmt(gebuehrenJ / div);
    el('umsatz').textContent     = fmt(umsatzJ / div);
    el('platform').textContent   = '– ' + fmt(platformJ / div);
    el('detReinigung').innerHTML = cnt(auf) + ' Reinigungen × ' + kRein + '&nbsp;€';
    el('reinigung').textContent  = '– ' + fmt(reinigungJ / div);
    el('detWaesche').innerHTML   = kPers + (kPers === 1 ? ' Person × ' : ' Personen × ') + eur(kSet) + '&nbsp;€ je Aufenthalt';
    el('waesche').textContent    = '– ' + fmt(waescheJ / div);
    el('nettoumsatz').textContent = fmt(nettoumsatzJ / div);
    el('provLbl').innerHTML      = 'Unsere Betreuung (' + Math.round(prov * 100) + '&nbsp;% v. Netto)';
    el('provision').textContent  = '– ' + fmt(provJ / div);
    el('nettoRow').textContent   = fmt(nettoJ / div);
    el('nettoBig').textContent   = fmt(nettoJ / div);
    el('nettoCap').textContent   = 'Netto-Ertrag pro ' + suffix;
    el('nettoSub').textContent   = mode === 'monat'
      ? '≈ ' + fmt(nettoJ) + ' pro Jahr · ' + cnt(aufenthalteJ) + ' Aufenthalte'
      : '≈ ' + fmt(nettoJ / 12) + ' pro Monat · ' + cnt(aufenthalteJ) + ' Aufenthalte';
  }

  el('standort').addEventListener('change', () => applyPreset(false));
  el('groesse').addEventListener('change', () => applyPreset(true));
  ['preis', 'auslastung', 'dauer', 'kRein', 'kPers', 'kSet', 'gGebuehr'].forEach(id =>
    el(id).addEventListener('input', update));
  el('paket').addEventListener('change', update);
  el('tMonat').addEventListener('click', () => setMode('monat'));
  el('tJahr').addEventListener('click', () => setMode('jahr'));
  applyPreset(true);
})();
