/* ============================================================
   Effets interactifs — QuizzlyUnivers
   Delegation d'evenements : un seul listener pour toute la page,
   fonctionne aussi sur les boutons crees dynamiquement (options
   de quiz, cartes de sous-themes) contrairement a l'ancienne
   version qui n'attachait les listeners qu'au chargement.
   ============================================================ */
(() => {
    'use strict';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn');
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);

        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
        ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
    }, { passive: true });
})();
