/* ============================================================
   Icônes SVG des thèmes — QuizzlyUnivers
   Illustrations plates mais travaillées : dégradés, ombres portées
   internes et reflets, pour sortir du pictogramme générique.
   Chaque dégradé porte un identifiant unique afin que plusieurs
   icônes puissent coexister sur la même page sans conflit.
   ============================================================ */
const ICONES = {

  /* ---------- Animaux ---------- */
  patte: `<svg viewBox="0 0 64 64" fill="none"><defs><linearGradient id="pa1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9d5ff"/><stop offset="1" stop-color="#a855f7"/></linearGradient><linearGradient id="pa2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8b4fe"/><stop offset="1" stop-color="#9333ea"/></linearGradient></defs><ellipse cx="32" cy="43" rx="16" ry="13" fill="url(#pa1)"/><path d="M32 30 c-9 0-16 6-16 13 0 3 1 5 3 7 -1-8 6-14 13-14 7 0 14 6 13 14 2-2 3-4 3-7 0-7-7-13-16-13z" fill="#c084fc" opacity=".5"/><ellipse cx="26" cy="45" rx="3.5" ry="4.5" fill="#7e22ce" opacity=".35"/><ellipse cx="38" cy="45" rx="3.5" ry="4.5" fill="#7e22ce" opacity=".35"/><ellipse cx="14" cy="27" rx="7" ry="9" fill="url(#pa2)"/><ellipse cx="25" cy="17" rx="6.5" ry="9" fill="url(#pa2)"/><ellipse cx="39" cy="17" rx="6.5" ry="9" fill="url(#pa2)"/><ellipse cx="50" cy="27" rx="7" ry="9" fill="url(#pa2)"/><ellipse cx="13" cy="24" rx="2.5" ry="3.5" fill="#f3e8ff" opacity=".55"/><ellipse cx="24" cy="14" rx="2.3" ry="3.5" fill="#f3e8ff" opacity=".55"/><ellipse cx="38" cy="14" rx="2.3" ry="3.5" fill="#f3e8ff" opacity=".55"/><ellipse cx="49" cy="24" rx="2.5" ry="3.5" fill="#f3e8ff" opacity=".55"/></svg>`,

  chat: `<img src="img/chat.png" alt="" class="img-icone" width="256" height="256">`,

  lion: `<img src="img/lion.png" alt="" class="img-icone" width="256" height="256">`,

  tigre: `<img src="img/tigre.png" alt="" class="img-icone" width="256" height="256">`,

  oiseau: `<img src="img/oiseau.png" alt="" class="img-icone" width="256" height="256">`,

  aigle: `<img src="img/aigle.png" alt="" class="img-icone" width="256" height="256">`,

  chien: `<img src="img/chien.png" alt="" class="img-icone" width="256" height="256">`,

  dressage: `<img src="img/dressage.png" alt="" class="img-icone" width="256" height="256">`,

  serpent: `<img src="img/serpent.png" alt="" class="img-icone" width="256" height="256">`,

  baleine: `<img src="img/baleine.png" alt="" class="img-icone" width="256" height="256">`,

  /* ---------- Savoirs ---------- */
  coeur: `<img src="img/coeur.png" alt="" class="img-icone" width="256" height="256">`,

  globe: `<img src="img/globe.png" alt="" class="img-icone" width="256" height="256">`,

  lys: `<img src="img/lys.png" alt="" class="img-icone" width="256" height="256">`,

  livre: `<img src="img/livre.png" alt="" class="img-icone" width="256" height="256">`,

  astro: `<img src="img/astro.png" alt="" class="img-icone" width="256" height="256">`,

  /* ---------- Pop culture ---------- */
  clap: `<img src="img/clap.png" alt="" class="img-icone" width="256" height="256">`,

  eclair: `<img src="img/eclair.png" alt="" class="img-icone" width="256" height="256">`,

  sabre: `<img src="img/sabre.png" alt="" class="img-icone" width="256" height="256">`,

  oeil: `<img src="img/oeil.png" alt="" class="img-icone" width="256" height="256">`,

  bille: `<img src="img/bille.png" alt="" class="img-icone" width="256" height="256">`,

  bouclier: `<img src="img/bouclier.png" alt="" class="img-icone" width="256" height="256">`,

  /* ---------- Modes de jeu ---------- */
  des: `<svg viewBox="0 0 64 64" fill="none"><defs><linearGradient id="de1" x1=".2" y1="0" x2=".8" y2="1"><stop offset="0" stop-color="#a855f7"/><stop offset="1" stop-color="#5b21b6"/></linearGradient></defs><rect x="7" y="7" width="50" height="50" rx="12" fill="url(#de1)"/><rect x="7" y="7" width="50" height="50" rx="12" fill="none" stroke="#7e22ce" stroke-width="2"/><path d="M14 18 c2-5 6-8 11-9" stroke="#e9d5ff" stroke-width="4" stroke-linecap="round" opacity=".55"/><g fill="#f8fafc"><circle cx="21" cy="21" r="4.6"/><circle cx="43" cy="21" r="4.6"/><circle cx="32" cy="32" r="4.6"/><circle cx="21" cy="43" r="4.6"/><circle cx="43" cy="43" r="4.6"/></g><g fill="#c4b5fd" opacity=".6"><circle cx="21" cy="19.6" r="1.6"/><circle cx="43" cy="19.6" r="1.6"/><circle cx="32" cy="30.6" r="1.6"/></g></svg>`,

  chrono: `<svg viewBox="0 0 64 64" fill="none"><defs><linearGradient id="cr1" x1=".3" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#fed7aa"/><stop offset="1" stop-color="#ea580c"/></linearGradient></defs><rect x="25" y="3" width="14" height="7" rx="3.5" fill="#c2410c"/><rect x="29" y="9" width="6" height="6" fill="#c2410c"/><path d="M47 14 l5 -5" stroke="#c2410c" stroke-width="4" stroke-linecap="round"/><circle cx="32" cy="37" r="24" fill="url(#cr1)"/><circle cx="32" cy="37" r="19" fill="#1e293b"/><circle cx="32" cy="37" r="19" fill="none" stroke="#fb923c" stroke-width="1.5"/><g stroke="#fdba74" stroke-width="2" stroke-linecap="round"><path d="M32 21 v3"/><path d="M48 37 h-3"/><path d="M32 53 v-3"/><path d="M16 37 h3"/></g><path d="M32 37 V25" stroke="#f8fafc" stroke-width="3.4" stroke-linecap="round"/><path d="M32 37 l9 5" stroke="#fbbf24" stroke-width="3.4" stroke-linecap="round"/><circle cx="32" cy="37" r="2.8" fill="#f8fafc"/><path d="M18 24 c3-4 7-7 11-8" stroke="#ffedd5" stroke-width="3" stroke-linecap="round" opacity=".5"/></svg>`,
};

/* Renvoie le SVG d'une icône, ou une chaîne vide si la clé est inconnue */
// Compteur pour rendre uniques les identifiants de degrades.
// Sans ca, deux copies de la meme icone sur la page partagent le meme id :
// le navigateur applique la premiere, et si elle est dans un bloc masque
// (display:none) les parties degradees ne s'affichent pas du tout.
let _icone_n = 0;

function icone(cle) {
    const src = ICONES[cle];
    if (!src) return '';
    if (src.indexOf('id="') === -1) return src;
    const sfx = '_' + (++_icone_n);
    return src
        .replace(/id="([\w-]+)"/g, (m, id) => 'id="' + id + sfx + '"')
        .replace(/url\(#([\w-]+)\)/g, (m, id) => 'url(#' + id + sfx + ')');
}
