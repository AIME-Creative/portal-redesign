/* ============================================================
   AMP Member Portal — Cancel membership
   ------------------------------------------------------------
   Settings → Membership & Billing → "Cancel membership" opens a
   short form: a required radio choice of reason (CANCEL_REASONS,
   shared with admin Reports → Subscriptions), "Other" detail,
   optional feedback, and a cheaper-plan offer when the reason is
   cost or low usage. Cancelling keeps benefits to the end of the
   paid period; "Resume membership" undoes it until then.
   Prototype: saved via AmpSubEvents (localStorage) so the admin
   report shows it. Uses app.js globals: closeModals, showToast.
   ============================================================ */
(function () {
  const REASONS = window.CANCEL_REASONS, EV = window.AmpSubEvents;
  if (!REASONS || !EV || !document.getElementById('modal-cancel')) return;
  const $ = (id) => document.getElementById(id);
  const ME = { name: 'Kyle Lord', email: 'kyle@aimegroup.com', plan: 'Elite', ends: 'Jan 14, 2027' };
  const OFFER_FOR = ['Too expensive', 'Not using it enough'];

  $('cancel-reasons').innerHTML = REASONS.map((r) =>
    `<label><input type="radio" name="cancel-reason" value="${r}"> ${r}</label>`).join('');

  const chosen = () => { const c = document.querySelector('input[name="cancel-reason"]:checked'); return c ? c.value : ''; };
  function update() {
    const r = chosen();
    $('cancel-other-wrap').hidden = r !== 'Other';
    $('cancel-offer').hidden = !OFFER_FOR.includes(r);
    $('cancel-confirm').disabled = !r || (r === 'Other' && !$('cancel-other').value.trim());
  }
  function resetForm() {
    document.querySelectorAll('input[name="cancel-reason"]').forEach((i) => { i.checked = false; });
    $('cancel-other').value = ''; $('cancel-note').value = '';
    update();
  }

  // Membership card reflects a pending cancellation
  function renderCard() {
    const pending = EV.latest(ME.email, 'cancellation');
    const status = $('mb-status'), next = $('mb-next'), link = $('mb-cancel');
    if (pending) {
      status.className = 'badge badge-amber'; status.textContent = 'Cancelling';
      next.textContent = `Benefits active until ${ME.ends} · no further charges`;
      link.textContent = 'Resume membership'; link.removeAttribute('data-modal'); link.dataset.resume = '';
    } else {
      status.className = 'badge badge-green'; status.textContent = 'Active';
      next.textContent = 'Next billing ' + ME.ends;
      link.textContent = 'Cancel membership'; link.dataset.modal = 'cancel'; delete link.dataset.resume;
    }
  }

  document.addEventListener('change', (e) => { if (e.target.name === 'cancel-reason') update(); });
  document.addEventListener('input', (e) => { if (e.target.id === 'cancel-other') update(); });
  document.addEventListener('click', (e) => {
    if (e.target.closest('#mb-cancel[data-modal]')) { resetForm(); return; }        // app.js opens the modal
    if (e.target.closest('#mb-cancel[data-resume]')) {
      e.preventDefault();
      EV.removeLatest(ME.email, 'cancellation'); renderCard();
      showToast('Welcome back — your membership will renew as usual.');
      return;
    }
    if (e.target.closest('#cancel-switch')) {
      e.preventDefault(); closeModals();
      $('mb-change').focus();
      showToast('Pick a new plan with "Change / renew plan" — your benefits carry over.');
      return;
    }
    if (e.target.closest('#cancel-confirm')) {
      e.preventDefault();
      const reason = chosen(); if (!reason) return;
      const other = $('cancel-other').value.trim(), note = $('cancel-note').value.trim();
      EV.add({ name: ME.name, email: ME.email, type: 'cancellation', from: ME.plan, to: 'Canceled', reason,
        detail: [other, note].filter(Boolean).join(' — ') });
      closeModals(); renderCard();
      showToast(`Your membership will end on ${ME.ends}. You can resume any time before then.`);
    }
  });

  update();
  renderCard();
})();
