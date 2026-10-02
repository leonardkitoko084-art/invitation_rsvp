(() => {
  const form = document.getElementById('checkinForm');
  const input = document.getElementById('tokenInput');
  const result = document.getElementById('checkinResult');
  const status = document.getElementById('scannerStatus');
  const start = document.getElementById('startScanner');
  const frame = document.getElementById('scannerFrame');
  const video = document.getElementById('scannerVideo');
  if (!form || !input || !result || !status || !start || !frame || !video) return;

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);
  const verify = async (token) => {
    if (!String(token).trim()) return;
    try {
    const body = new FormData(); body.append('token', String(token).trim());
    const response = await fetch('/api/admin/checkin', { method: 'POST', body, headers: { Accept: 'application/json' } });
    const data = await response.json().catch(() => ({}));
    result.hidden = false;
    result.className = `checkin-result ${data.ok ? (data.already_checked_in ? 'duplicate' : 'valid') : 'invalid'}`;
    result.innerHTML = data.ok
      ? `<strong>${data.already_checked_in ? 'Déjà contrôlé' : 'Entrée validée'}</strong><span>${escapeHtml(data.name)}</span><span>Table : ${escapeHtml(data.table)}</span>`
      : `<strong>QR invalide</strong><span>${escapeHtml(data.message || 'Invitation introuvable.')}</span>`;
    } catch {
      result.hidden = false;
      result.className = 'checkin-result invalid';
      result.textContent = 'Vérification impossible. Vérifiez la connexion au serveur puis réessayez.';
    }
  };
  form.addEventListener('submit', (event) => { event.preventDefault(); verify(input.value); });
  start.addEventListener('click', async () => {
    if (!('BarcodeDetector' in window)) { status.textContent = 'La caméra QR n’est pas disponible sur ce navigateur. Utilisez la saisie manuelle.'; return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } } });
      video.srcObject = stream; frame.hidden = false; await video.play();
      const detector = new BarcodeDetector({ formats: ['qr_code'] });
      status.textContent = 'Présentez le QR Code devant la caméra.';
      const scan = async () => {
        if (frame.hidden) return;
        const codes = await detector.detect(video).catch(() => []);
        if (codes[0]?.rawValue) { await verify(codes[0].rawValue); stream.getTracks().forEach((track) => track.stop()); frame.hidden = true; start.textContent = 'Scanner à nouveau'; }
        else requestAnimationFrame(scan);
      };
      scan();
    } catch { status.textContent = 'Caméra inaccessible. Vérifiez les permissions ou utilisez la saisie manuelle.'; }
  });
})();
