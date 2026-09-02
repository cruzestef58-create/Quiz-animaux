/* ============================================================
   Animation d'entree + visite guidee — QuizzlyUnivers
   Uniquement sur la page d'accueil.

   Le projecteur est fait avec un masque SVG : un voile sombre
   plein ecran auquel on decoupe un trou arrondi sur l'element
   a montrer. C'est la seule methode qui donne un vrai bord net
   quel que soit le fond derriere.
   ============================================================ */
(() => {
    'use strict';

    const sobre = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- Animation d'entree ---------- */

    function animationEntree() {
        // Une seule fois par session : au retour sur l'accueil, on n'impose pas l'attente.
        let dejaVue = false;
        try { dejaVue = sessionStorage.getItem('qz_intro') === '1'; } catch (e) {}
        if (dejaVue || sobre) return;
        try { sessionStorage.setItem('qz_intro', '1'); } catch (e) {}

        const ecran = document.createElement('div');
        ecran.id = 'intro-ecran';
        ecran.setAttribute('aria-hidden', 'true');
        ecran.innerHTML =
            '<div class="intro-halo"></div>' +
            '<img src="logo-icone.png" alt="" class="intro-logo">' +
            '<div class="intro-nom">QuizzlyUnivers</div>' +
            '<div class="intro-trait"></div>';
        document.body.appendChild(ecran);
        document.body.classList.add('intro-en-cours');

        setTimeout(() => {
            ecran.classList.add('intro-sortie');
            document.body.classList.remove('intro-en-cours');
            ecran.addEventListener('transitionend', () => ecran.remove(), { once: true });
            setTimeout(() => ecran.remove(), 1200);
        }, 1150);
    }

    /* ---------- Visite guidee ---------- */

    const ETAPES = [
        {
            titre: 'Bienvenue',
            texte: "QuizzlyUnivers, ce sont des quiz gratuits sur une vingtaine de sujets — des animaux à Marvel, de la géographie à l'histoire de France. Chaque question est écrite à la main, vérifiée, et accompagnée de sa source.",
            cible: null
        },
        {
            titre: 'Choisis un thème',
            texte: "Les quiz sont regroupés par catégorie. Clique sur une carte pour découvrir les quiz qu'elle contient.",
            cible: () => document.querySelector('#categories-view .category-card')
        },
        {
            titre: 'Puis un quiz précis',
            texte: "Chaque catégorie contient un ou plusieurs quiz. Ici, les Félins regroupent les chats, le lion et le tigre.",
            cible: () => document.querySelector('#subthemes-grid .quiz-card'),
            avant: () => { if (typeof openCategory === 'function') openCategory('felins'); },
            apresRetour: () => { if (typeof closeCategory === 'function') closeCategory(); }
        },
        {
            titre: 'Ou cherche directement',
            texte: "Si tu sais déjà ce que tu veux, tape-le. La recherche trouve le quiz par son nom, sa catégorie ou son sujet.",
            cible: () => document.getElementById('search-wrapper'),
            avant: () => { if (typeof closeCategory === 'function') closeCategory(); }
        },
        {
            titre: 'Règle la difficulté',
            texte: "Avant de commencer, tu choisis ton niveau. Les questions ne sont pas les mêmes : le niveau expert va chercher des détails que peu de gens connaissent.",
            cible: null,
            apercu:
                '<div class="visite-niveaux">' +
                '<span class="visite-niveau"><b>⭐ Facile</b>pour découvrir</span>' +
                '<span class="visite-niveau"><b>⭐⭐ Moyen</b>pour se tester</span>' +
                '<span class="visite-niveau"><b>⭐⭐⭐ Difficile</b>pour les experts</span>' +
                '</div>'
        },
        {
            titre: "Et tu apprends quelque chose",
            texte: "Après chaque réponse, bonne ou mauvaise, tu as l'explication et la source. C'est là tout l'intérêt : on ressort en sachant quelque chose de plus.",
            cible: null,
            apercu:
                '<div class="visite-fiche">' +
                '<div class="visite-fiche-ligne"><span>💡 Explication</span>Le chat possède 18 doigts : 5 à chaque patte avant, 4 à chaque patte arrière.</div>' +
                '<div class="visite-fiche-ligne visite-fiche-src"><span>📚 Source</span>Vétérinaire Felino International</div>' +
                '</div>'
        },
        {
            titre: 'Deux modes rapides',
            texte: "Le mode Aléatoire pioche dans tous les thèmes à la fois. QuizzlySpeed te chronomètre : dix secondes par question, et les points dépendent de ta vitesse.",
            cible: () => document.querySelector('.btn-random') && document.querySelector('.btn-random').parentElement
        }
    ];

    let index = 0, voile = null, bulle = null, ouverte = false;

    function creer() {
        voile = document.createElement('div');
        voile.id = 'visite-voile';
        voile.innerHTML =
            '<svg id="visite-svg" aria-hidden="true">' +
              '<defs><mask id="visite-masque">' +
                '<rect x="0" y="0" width="100%" height="100%" fill="#fff"/>' +
                '<rect id="visite-trou" rx="18" ry="18" fill="#000"/>' +
              '</mask></defs>' +
              '<rect x="0" y="0" width="100%" height="100%" fill="rgba(5,2,14,0.86)" mask="url(#visite-masque)"/>' +
              '<rect id="visite-halo" rx="18" ry="18" fill="none"/>' +
            '</svg>';
        document.body.appendChild(voile);

        bulle = document.createElement('div');
        bulle.id = 'visite-bulle';
        bulle.setAttribute('role', 'dialog');
        bulle.setAttribute('aria-modal', 'true');
        bulle.setAttribute('aria-labelledby', 'visite-titre');
        document.body.appendChild(bulle);

        bulle.addEventListener('click', (e) => {
            const b = e.target.closest('[data-visite]');
            if (!b) return;
            const a = b.dataset.visite;
            if (a === 'fin') fermer();
            else if (a === 'suivant') aller(index + 1);
            else if (a === 'precedent') aller(index - 1);
        });
        window.addEventListener('resize', repositionner, { passive: true });
        window.addEventListener('scroll', repositionner, { passive: true });
        document.addEventListener('keydown', clavier);
    }

    function clavier(e) {
        if (!ouverte) return;
        if (e.key === 'Escape') { e.preventDefault(); fermer(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); aller(index + 1); }
        else if (e.key === 'ArrowLeft')  { e.preventDefault(); aller(index - 1); }
    }

    function rectangleCible() {
        const et = ETAPES[index];
        if (!et.cible) return null;
        const el = et.cible();
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return null;
        const m = 10;
        return { x: r.left - m, y: r.top - m, w: r.width + 2 * m, h: r.height + 2 * m };
    }

    function repositionner() {
        if (!ouverte) return;
        const trou = document.getElementById('visite-trou');
        const halo = document.getElementById('visite-halo');
        const r = rectangleCible();

        if (r) {
            for (const n of [trou, halo]) {
                n.setAttribute('x', r.x); n.setAttribute('y', r.y);
                n.setAttribute('width', Math.max(0, r.w)); n.setAttribute('height', Math.max(0, r.h));
            }
            halo.style.display = '';
        } else {
            // Pas de cible : le voile est plein, on cache le trou hors ecran
            for (const n of [trou, halo]) {
                n.setAttribute('x', -9999); n.setAttribute('y', -9999);
                n.setAttribute('width', 0); n.setAttribute('height', 0);
            }
            halo.style.display = 'none';
        }

        // Placement de la bulle. On essaie dessous, dessus, puis sur les cotes :
        // une carte de theme est haute, et sans le placement lateral la bulle
        // finirait par recouvrir la zone qu'elle est censee montrer.
        const bw = bulle.offsetWidth, bh = bulle.offsetHeight;
        const W = window.innerWidth, H = window.innerHeight;
        const marge = 16, bord = 8;
        let gauche, haut;

        if (!r) {
            gauche = (W - bw) / 2;
            haut = (H - bh) / 2;
            bulle.dataset.place = 'centre';
        } else {
            const essais = [
                { nom: 'dessous', l: r.x + r.w / 2 - bw / 2, t: r.y + r.h + marge },
                { nom: 'dessus',  l: r.x + r.w / 2 - bw / 2, t: r.y - bh - marge },
                { nom: 'droite',  l: r.x + r.w + marge,      t: r.y + r.h / 2 - bh / 2 },
                { nom: 'gauche',  l: r.x - bw - marge,       t: r.y + r.h / 2 - bh / 2 }
            ];
            const tient = e => {
                const l = Math.min(Math.max(bord, e.l), W - bw - bord);
                const t = Math.min(Math.max(bord, e.t), H - bh - bord);
                // La bulle ne doit ni deborder ni mordre sur la zone eclairee
                if (e.t < bord || e.t + bh > H - bord) return null;
                if (e.l < bord || e.l + bw > W - bord) return null;
                const chevauche = !(l + bw < r.x || l > r.x + r.w || t + bh < r.y || t > r.y + r.h);
                return chevauche ? null : { l, t };
            };
            let choisi = null;
            for (const e of essais) {
                const p = tient(e);
                if (p) { choisi = p; bulle.dataset.place = e.nom; break; }
            }
            if (choisi) {
                gauche = choisi.l; haut = choisi.t;
            } else {
                // Cible trop grande pour l'ecran : on se colle au bord le plus degage
                bulle.dataset.place = 'repli';
                gauche = r.x + r.w / 2 - bw / 2;
                haut = (r.y + r.h / 2 > H / 2) ? bord : H - bh - bord;
            }
        }
        gauche = Math.min(Math.max(bord, gauche), W - bw - bord);
        haut   = Math.min(Math.max(bord, haut),   H - bh - bord);
        bulle.style.transform = 'translate(' + Math.round(gauche) + 'px,' + Math.round(haut) + 'px)';
    }

    function dessiner() {
        const et = ETAPES[index];
        const points = ETAPES.map((_, i) =>
            '<span class="visite-point' + (i === index ? ' actif' : '') + '"></span>').join('');
        bulle.innerHTML =
            '<button class="visite-fermer" data-visite="fin" aria-label="Fermer la visite">&times;</button>' +
            '<div class="visite-etape">Étape ' + (index + 1) + ' sur ' + ETAPES.length + '</div>' +
            '<h3 id="visite-titre">' + et.titre + '</h3>' +
            '<p>' + et.texte + '</p>' +
            (et.apercu || '') +
            '<div class="visite-pied">' +
              '<div class="visite-points">' + points + '</div>' +
              '<div class="visite-boutons">' +
                (index > 0 ? '<button class="visite-btn visite-btn-plat" data-visite="precedent">Retour</button>' : '') +
                (index < ETAPES.length - 1
                    ? '<button class="visite-btn" data-visite="suivant">Suivant →</button>'
                    : '<button class="visite-btn" data-visite="fin">C\'est parti !</button>') +
              '</div>' +
            '</div>';
        // On donne le focus au bouton principal, pas au bouton Retour :
        // sinon la touche Entree ferait reculer la visite.
        // On vise le pied de la bulle : la croix de fermeture porte aussi
        // l'action "fin" et apparait avant dans le document.
        const p = bulle.querySelector('.visite-boutons [data-visite="suivant"], .visite-boutons [data-visite="fin"]');
        if (p) p.focus({ preventScroll: true });
    }

    function aller(n) {
        if (n < 0 || n >= ETAPES.length) return;
        const precedent = ETAPES[index];
        if (n < index && precedent.apresRetour) precedent.apresRetour();
        index = n;
        const et = ETAPES[index];
        if (et.avant) et.avant();

        dessiner();
        const el = et.cible ? et.cible() : null;
        amener(el);
        repositionner();
    }

    /* Amene la cible au centre de l'ecran.
       On calcule la position nous-memes plutot que d'utiliser scrollIntoView :
       le defilement doux ne s'execute pas quand les animations sont gelees
       (onglet en arriere-plan, fenetre masquee), et la visite se retrouverait
       alors a eclairer une zone hors ecran. Le filet ci-dessous force la
       position si le defilement n'a pas eu lieu. */
    function amener(el) {
        let haut = 0;
        if (el) {
            const r = el.getBoundingClientRect();
            const H = window.innerHeight;
            const marge = 16;
            const nav = document.querySelector('.navbar');
            const hautNav = nav ? nav.getBoundingClientRect().height : 0;

            // On ne centre pas la cible : on lui reserve la place au-dessus de
            // la bulle. Sans cela, une carte haute sur un ecran etroit ne laisse
            // aucun emplacement libre et la bulle finit par la recouvrir.
            const dispo = H - bulle.offsetHeight - 3 * marge - hautNav;
            const place = (r.height <= dispo)
                ? hautNav + marge + (dispo - r.height) / 2
                : hautNav + marge;

            const maxi = Math.max(0, document.documentElement.scrollHeight - H);
            haut = Math.min(Math.max(0, window.scrollY + r.top - place), maxi);
        }
        window.scrollTo({ top: haut, behavior: sobre ? 'auto' : 'smooth' });

        // Filet independant du rythme des animations : un minuteur unique, qui
        // se declenche meme si les intervalles courts sont ralentis par le
        // navigateur. Si le defilement doux n'a pas abouti, on force la position.
        clearTimeout(amener.filet);
        amener.filet = setTimeout(() => {
            if (Math.abs(window.scrollY - haut) > 4) window.scrollTo(0, haut);
            repositionner();
        }, 450);

        // Suivi pendant l'animation, pour que le projecteur colle au defilement
        clearInterval(amener.suivi);
        let n = 0;
        amener.suivi = setInterval(() => {
            repositionner();
            if (++n > 20) clearInterval(amener.suivi);
        }, 30);
    }

    function ouvrir() {
        if (ouverte) return;
        if (!voile) creer();
        ouverte = true;
        index = -1;
        document.body.classList.add('visite-active');
        voile.classList.add('visible');
        bulle.classList.add('visible');
        aller(0);
    }

    function fermer() {
        if (!ouverte) return;
        ouverte = false;
        const et = ETAPES[index];
        if (et && et.apresRetour) et.apresRetour();
        if (typeof closeCategory === 'function') closeCategory();
        document.body.classList.remove('visite-active');
        voile.classList.remove('visible');
        bulle.classList.remove('visible');
        const b = document.getElementById('bouton-visite');
        if (b) b.focus({ preventScroll: true });
    }

    window.ouvrirVisite = ouvrir;

    document.addEventListener('DOMContentLoaded', () => {
        animationEntree();
        const b = document.getElementById('bouton-visite');
        if (b) b.addEventListener('click', ouvrir);
    });
})();
