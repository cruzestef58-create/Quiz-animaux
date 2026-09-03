/* ============================================================
   Icônes SVG des thèmes — QuizzlyUnivers
   Illustrations plates mais travaillées : dégradés, ombres portées
   internes et reflets, pour sortir du pictogramme générique.
   Chaque dégradé porte un identifiant unique afin que plusieurs
   icônes puissent coexister sur la même page sans conflit.
   ============================================================ */
const ICONES = {

  /* ---------- Animaux ---------- */

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
  des: `<img src="img/des.png" alt="" class="img-icone" width="256" height="256">`,

  note: `<img src="img/note.png" alt="" class="img-icone" width="256" height="256">`,
  micro: `<img src="img/micro.png" alt="" class="img-icone" width="256" height="256">`,
  chrono: `<img src="img/chrono.png" alt="" class="img-icone" width="256" height="256">`,
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
