/* ============================================================
   AMP — Subscription changes (shared by member + admin apps)
   ------------------------------------------------------------
   • CANCEL_REASONS: the quick radio choices a member picks when
     cancelling (admin Reports → Subscriptions groups by these)
   • AmpSubEvents: cancellations made in the member prototype,
     saved to localStorage so they show up in admin Reports.
     Production: Stripe subscription webhooks + a cancel_reason
     column written by the cancel flow.
   ============================================================ */
window.CANCEL_REASONS = [
  'Too expensive',
  'Not using it enough',
  "Benefits didn't fit my business",
  'Switching to another membership or service',
  'Leaving the industry or retiring',
  'Technical or billing problems',
  'Other',
];

window.AmpSubEvents = (function () {
  const KEY = 'amp-sub-events-v1';
  const read = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } };
  const write = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch (e) { /* in-memory only */ } };
  return {
    all: read,
    add(ev) { const list = read(); list.unshift(Object.assign({ at: new Date().toISOString() }, ev)); write(list); },
    // Undo the member's own pending cancellation (they resumed before the period ended)
    removeLatest(email, type) {
      const list = read(), i = list.findIndex((e) => e.email === email && e.type === type);
      if (i > -1) { list.splice(i, 1); write(list); }
    },
    latest: (email, type) => read().find((e) => e.email === email && e.type === type) || null,
  };
})();
