/* ============================================================
   Icônes SVG des thèmes — QuizzlyUnivers
   Dessinées à plat, sans dépendance externe. Chaque icône tient
   dans un viewBox 64×64 et s'adapte à la taille via CSS.
   ============================================================ */
const ICONES = {

  /* ---------- Animaux ---------- */
  patte: `<svg viewBox="0 0 64 64" fill="none"><ellipse cx="32" cy="41" rx="15" ry="12" fill="#c084fc"/><ellipse cx="15" cy="26" rx="6.5" ry="8.5" fill="#a855f7"/><ellipse cx="26" cy="17" rx="6" ry="8.5" fill="#a855f7"/><ellipse cx="38" cy="17" rx="6" ry="8.5" fill="#a855f7"/><ellipse cx="49" cy="26" rx="6.5" ry="8.5" fill="#a855f7"/></svg>`,

  chat: `<svg viewBox="0 0 64 64" fill="none"><path d="M14 26 L12 8 L26 18 Z" fill="#f0abfc"/><path d="M50 26 L52 8 L38 18 Z" fill="#f0abfc"/><ellipse cx="32" cy="37" rx="20" ry="18" fill="#e879f9"/><circle cx="24" cy="34" r="3" fill="#1a0b2e"/><circle cx="40" cy="34" r="3" fill="#1a0b2e"/><path d="M32 41 l-4 3 4 3 4-3z" fill="#1a0b2e"/><path d="M8 38h12M8 44h12M44 38h12M44 44h12" stroke="#f0abfc" stroke-width="2" stroke-linecap="round"/></svg>`,

  lion: `<svg viewBox="0 0 64 64" fill="none"><g fill="#f59e0b"><circle cx="32" cy="10" r="7"/><circle cx="49" cy="16" r="7"/><circle cx="56" cy="32" r="7"/><circle cx="49" cy="48" r="7"/><circle cx="32" cy="54" r="7"/><circle cx="15" cy="48" r="7"/><circle cx="8" cy="32" r="7"/><circle cx="15" cy="16" r="7"/></g><circle cx="32" cy="32" r="17" fill="#fbbf24"/><circle cx="26" cy="29" r="2.6" fill="#1a0b2e"/><circle cx="38" cy="29" r="2.6" fill="#1a0b2e"/><path d="M32 36 l-3.5 3 3.5 3 3.5-3z" fill="#1a0b2e"/></svg>`,

  tigre: `<svg viewBox="0 0 64 64" fill="none"><path d="M15 24 L13 8 L26 17 Z" fill="#fb923c"/><path d="M49 24 L51 8 L38 17 Z" fill="#fb923c"/><ellipse cx="32" cy="36" rx="20" ry="19" fill="#f97316"/><path d="M22 20 l3 9M32 17 l0 10M42 20 l-3 9M14 34 l8 2M50 34 l-8 2M16 44 l7 -1M48 44 l-7 -1" stroke="#1a0b2e" stroke-width="3" stroke-linecap="round"/><circle cx="25" cy="35" r="2.8" fill="#1a0b2e"/><circle cx="39" cy="35" r="2.8" fill="#1a0b2e"/><path d="M32 42 l-3.5 3 3.5 3 3.5-3z" fill="#1a0b2e"/></svg>`,

  oiseau: `<svg viewBox="0 0 64 64" fill="none"><path d="M6 26 C18 14 34 12 46 20 L34 34 Z" fill="#38bdf8"/><path d="M14 46 C22 34 34 28 48 30 L40 44 Z" fill="#0ea5e9"/><ellipse cx="44" cy="26" rx="13" ry="9" transform="rotate(-15 44 26)" fill="#0284c7"/><circle cx="50" cy="22" r="2.6" fill="#f8fafc"/><path d="M56 23 l8 -1 -7 5z" fill="#fbbf24"/><path d="M34 34 C30 42 26 48 20 52" stroke="#0ea5e9" stroke-width="5" stroke-linecap="round"/></svg>`,

  aigle: `<svg viewBox="0 0 64 64" fill="none"><path d="M10 20 C6 30 8 44 18 50 L24 34 Z" fill="#92400e"/><path d="M54 20 C58 30 56 44 46 50 L40 34 Z" fill="#92400e"/><path d="M32 12 C43 12 51 21 51 33 C51 44 43 52 32 52 C21 52 13 44 13 33 C13 21 21 12 32 12Z" fill="#f8fafc"/><path d="M32 12 C24 12 18 17 15 24 C21 21 27 20 32 20 C37 20 43 21 49 24 C46 17 40 12 32 12Z" fill="#e2e8f0"/><circle cx="24" cy="30" r="3" fill="#0b1220"/><circle cx="40" cy="30" r="3" fill="#0b1220"/><path d="M32 34 L26 44 L32 56 L38 44 Z" fill="#f59e0b"/><path d="M32 34 L32 56" stroke="#d97706" stroke-width="1.6"/></svg>`,

  chien: `<svg viewBox="0 0 64 64" fill="none"><path d="M12 18 C6 24 6 40 14 46 L20 30 Z" fill="#a16207"/><path d="M52 18 C58 24 58 40 50 46 L44 30 Z" fill="#a16207"/><ellipse cx="32" cy="36" rx="18" ry="17" fill="#ca8a04"/><ellipse cx="32" cy="45" rx="9" ry="7" fill="#fde68a"/><circle cx="25" cy="32" r="2.8" fill="#1a0b2e"/><circle cx="39" cy="32" r="2.8" fill="#1a0b2e"/><ellipse cx="32" cy="42" rx="3.6" ry="2.8" fill="#1a0b2e"/></svg>`,

  dressage: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" fill="none" stroke="#22d3ee" stroke-width="3" stroke-dasharray="6 5"/><path d="M18 34 c0-5 4-8 8-6 l12 0 c4-2 8 1 8 6 0 5-4 8-8 6 l-12 0 c-4 2-8-1-8-6z" fill="#67e8f9"/><circle cx="22" cy="28" r="4" fill="#22d3ee"/><circle cx="22" cy="40" r="4" fill="#22d3ee"/><circle cx="42" cy="28" r="4" fill="#22d3ee"/><circle cx="42" cy="40" r="4" fill="#22d3ee"/></svg>`,

  serpent: `<svg viewBox="0 0 64 64" fill="none"><path d="M14 50 C14 38 30 38 30 30 C30 22 18 22 18 16 C18 11 24 8 30 10" stroke="#4ade80" stroke-width="8" stroke-linecap="round" fill="none"/><path d="M14 50 C24 54 42 54 50 46 C56 40 54 30 46 28" stroke="#22c55e" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="46" cy="27" r="8" fill="#16a34a"/><circle cx="44" cy="24" r="2.2" fill="#0b1220"/><circle cx="50" cy="26" r="2.2" fill="#0b1220"/><path d="M48 33 l0 6 -3 3 M48 39 l3 3" stroke="#f43f5e" stroke-width="2" stroke-linecap="round"/></svg>`,

  baleine: `<svg viewBox="0 0 64 64" fill="none"><path d="M6 40 C14 26 30 22 44 28 C52 32 56 40 54 46 C40 50 20 50 6 40Z" fill="#3b82f6"/><path d="M54 46 C58 40 62 34 60 26 C54 30 50 36 50 42Z" fill="#2563eb"/><circle cx="20" cy="36" r="2.6" fill="#f8fafc"/><path d="M16 22 c0-4 3-7 6-6 M22 22 c0-4 3-7 6-6" stroke="#93c5fd" stroke-width="2.4" stroke-linecap="round"/></svg>`,

  /* ---------- Savoirs ---------- */
  coeur: `<svg viewBox="0 0 64 64" fill="none"><path d="M32 55 C10 40 6 26 14 18 C21 11 30 15 32 22 C34 15 43 11 50 18 C58 26 54 40 32 55Z" fill="#f43f5e"/><path d="M20 30 l6 0 3 -7 5 15 3 -8 3 4 5 0" stroke="#fecdd3" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,

  globe: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="24" fill="#2563eb"/><path d="M12 22 h40 M8 32 h48 M12 42 h40" stroke="#93c5fd" stroke-width="2"/><ellipse cx="32" cy="32" rx="11" ry="24" fill="none" stroke="#93c5fd" stroke-width="2"/><path d="M20 20 c5 4 3 10 8 11 c4 1 2 7 6 8 c3 1 6-2 8-6" fill="#4ade80" opacity=".85"/></svg>`,

  lys: `<svg viewBox="0 0 64 64" fill="none"><path d="M32 3 C38 14 39 23 32 32 C25 23 26 14 32 3Z" fill="#c7d2fe"/><path d="M31 32 C20 22 8 24 6 34 C4 45 18 50 31 41Z" fill="#818cf8"/><path d="M33 32 C44 22 56 24 58 34 C60 45 46 50 33 41Z" fill="#818cf8"/><rect x="14" y="38" width="36" height="6" rx="3" fill="#e0e7ff"/><path d="M32 44 C28 50 28 57 32 62 C36 57 36 50 32 44Z" fill="#a5b4fc"/><circle cx="32" cy="27" r="3" fill="#e0e7ff"/></svg>`,

  livre: `<svg viewBox="0 0 64 64" fill="none"><path d="M8 14 C16 10 26 10 31 14 L31 52 C26 48 16 48 8 52Z" fill="#7c3aed"/><path d="M56 14 C48 10 38 10 33 14 L33 52 C38 48 48 48 56 52Z" fill="#a855f7"/><path d="M13 22 h13 M13 30 h13 M38 22 h13 M38 30 h13" stroke="#e9d5ff" stroke-width="2" stroke-linecap="round"/></svg>`,

  astro: `<svg viewBox="0 0 64 64" fill="none"><path d="M42 8 C28 12 20 24 22 38 C24 50 34 58 46 56 C34 50 28 38 30 26 C31 18 36 12 42 8Z" fill="#fbbf24"/><path d="M50 12 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" fill="#e879f9"/><path d="M18 46 l1.6 4 4 1.6 -4 1.6 -1.6 4 -1.6 -4 -4 -1.6 4 -1.6z" fill="#22d3ee"/><circle cx="52" cy="40" r="2.6" fill="#c084fc"/></svg>`,

  /* ---------- Pop culture ---------- */
  clap: `<svg viewBox="0 0 64 64" fill="none"><rect x="6" y="26" width="52" height="30" rx="4" fill="#334155"/><path d="M6 14 L54 6 L57 18 L9 26Z" fill="#0f172a"/><path d="M14 12 l4 12 M26 10 l4 12 M38 8 l4 12 M50 7 l3 11" stroke="#f8fafc" stroke-width="3"/><rect x="14" y="34" width="36" height="4" rx="2" fill="#64748b"/><rect x="14" y="44" width="24" height="4" rx="2" fill="#64748b"/></svg>`,

  eclair: `<svg viewBox="0 0 64 64" fill="none"><circle cx="20" cy="42" r="11" fill="none" stroke="#e2e8f0" stroke-width="3"/><circle cx="44" cy="42" r="11" fill="none" stroke="#e2e8f0" stroke-width="3"/><path d="M31 42 h2" stroke="#e2e8f0" stroke-width="3"/><path d="M36 8 L22 30 h9 L26 48 L44 24 h-9z" fill="#fbbf24"/></svg>`,

  sabre: `<svg viewBox="0 0 64 64" fill="none"><g transform="rotate(-35 32 32)"><rect x="29" y="6" width="6" height="30" rx="3" fill="#60a5fa"/><rect x="27.5" y="36" width="9" height="18" rx="3" fill="#94a3b8"/><rect x="27.5" y="42" width="9" height="3" fill="#475569"/></g><g transform="rotate(35 32 32)"><rect x="29" y="6" width="6" height="30" rx="3" fill="#f87171"/><rect x="27.5" y="36" width="9" height="18" rx="3" fill="#94a3b8"/><rect x="27.5" y="42" width="9" height="3" fill="#475569"/></g></svg>`,

  oeil: `<svg viewBox="0 0 64 64" fill="none"><path d="M4 32 C14 18 26 12 32 12 C38 12 50 18 60 32 C50 46 38 52 32 52 C26 52 14 46 4 32Z" fill="#1e1b4b"/><circle cx="32" cy="32" r="13" fill="#a855f7"/><circle cx="32" cy="32" r="6" fill="#0b0616"/><path d="M32 12 v-6 M14 18 l-4 -5 M50 18 l4 -5 M32 52 v6" stroke="#c084fc" stroke-width="2.6" stroke-linecap="round"/></svg>`,

  bille: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="25" fill="#f8fafc"/><path d="M7 32 A25 25 0 0 1 57 32Z" fill="#ef4444"/><rect x="7" y="29" width="50" height="6" fill="#1e293b"/><circle cx="32" cy="32" r="9" fill="#1e293b"/><circle cx="32" cy="32" r="6" fill="#f8fafc"/></svg>`,

  bouclier: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="27" fill="#dc2626"/><circle cx="32" cy="32" r="21" fill="#f8fafc"/><circle cx="32" cy="32" r="15" fill="#dc2626"/><circle cx="32" cy="32" r="10" fill="#1d4ed8"/><path d="M32 23 l2.6 6.3 6.8.5 -5.2 4.4 1.6 6.6 -5.8 -3.6 -5.8 3.6 1.6 -6.6 -5.2 -4.4 6.8 -.5z" fill="#f8fafc"/></svg>`,

  /* ---------- Modes de jeu ---------- */
  des: `<svg viewBox="0 0 64 64" fill="none"><rect x="9" y="9" width="46" height="46" rx="10" fill="#7c3aed"/><circle cx="22" cy="22" r="4.2" fill="#f8fafc"/><circle cx="42" cy="22" r="4.2" fill="#f8fafc"/><circle cx="32" cy="32" r="4.2" fill="#f8fafc"/><circle cx="22" cy="42" r="4.2" fill="#f8fafc"/><circle cx="42" cy="42" r="4.2" fill="#f8fafc"/></svg>`,

  chrono: `<svg viewBox="0 0 64 64" fill="none"><circle cx="32" cy="36" r="22" fill="none" stroke="#fb923c" stroke-width="4"/><rect x="26" y="4" width="12" height="6" rx="3" fill="#fb923c"/><rect x="29" y="9" width="6" height="6" fill="#fb923c"/><path d="M32 22 v14 h10" stroke="#fbbf24" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

/* Renvoie le SVG d'une icône, ou une chaîne vide si la clé est inconnue */
function icone(cle) {
    return ICONES[cle] || '';
}
