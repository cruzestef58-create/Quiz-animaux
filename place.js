/* ============================================================
   Mode "Prends Ta Place" — QuizzlyUnivers
   Format televise en 3 manches (10 questions au total) :
     Manche 1 : 1 question d'ouverture tiree au sort
     Manche 2 : le champion choisit 4 themes pour piéger le joueur
     Manche 3 : le joueur choisit 1 theme -> 5 questions dessus
   Le champion repond aux memes questions en parallele.
   Progression sauvegardee en localStorage.
   ============================================================ */
const Place = (() => {
    'use strict';

    /* ---------- Les 9 themes du plateau ---------- */
    const THEMES = [
        { ic: '🐕', nm: 'Canidés',      keys: ['educationCanine', 'lesChiens'] },
        { ic: '🐱', nm: 'Félins',       keys: ['lesChats', 'letion', 'letigre'] },
        { ic: '🦅', nm: 'Oiseaux',      keys: ['ornithologie', 'laigleroyal'] },
        { ic: '🐍', nm: 'Reptiles',     keys: ['reptiles'] },
        { ic: '🌊', nm: 'Marins',       keys: ['mammiferesMarin'] },
        { ic: '🫀', nm: 'Corps Humain', keys: ['corpsHumain'] },
        { ic: '🌍', nm: 'Géographie',   keys: ['geographie'] },
        { ic: '⚜️', nm: 'Histoire',     keys: ['histoireFrance'] },
        { ic: '🎬', nm: 'Fiction',      keys: ['harryPotter', 'starWars', 'jujutsuKaisen'] },
    ];

    const CHAMPIONS = [
        { av: '🦊', nm: 'Renard',   acc: 0.45, desc: 'Champion débutant — il doute encore' },
        { av: '🦉', nm: 'Hibou',    acc: 0.55, desc: 'Il a de la lecture' },
        { av: '🐺', nm: 'Loup',     acc: 0.63, desc: 'Rapide et sûr de lui' },
        { av: '🦁', nm: 'Lion',     acc: 0.70, desc: 'Il règne depuis un moment' },
        { av: '🐉', nm: 'Dragon',   acc: 0.78, desc: 'Peu lui ont résisté' },
        { av: '👑', nm: 'Monarque', acc: 0.85, desc: 'Le sommet. Bonne chance.' },
    ];

    const RANKS = [
        { min: 0,  t: 'Challenger' },
        { min: 1,  t: 'Champion' },
        { min: 3,  t: 'Maître du Quiz' },
        { min: 5,  t: 'Grand Maître' },
        { min: 10, t: 'Légende' },
    ];

    const STORE = 'quizzly_place_v2';
    const TIME = 20;                                   // secondes par question
    const R3_LEVELS = ['facile', 'facile', 'moyen', 'moyen', 'difficile'];  // difficulte croissante

    let S = null, rafId = null;

    /* ---------- Persistance ---------- */
    function load() {
        try {
            const raw = localStorage.getItem(STORE);
            if (raw) { const d = JSON.parse(raw); return { streak: d.streak | 0, best: d.best | 0 }; }
        } catch (e) { /* stockage indisponible (navigation privee) */ }
        return { streak: 0, best: 0 };
    }
    function save(p) { try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) {} }

    const rankFor = (n) => RANKS.filter(r => n >= r.min).pop().t;
    const champFor = (n) => CHAMPIONS[Math.min(n, CHAMPIONS.length - 1)];
    const $ = (id) => document.getElementById(id);
    const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    /* questions.js declare `const quizzesData` : une const de haut niveau n'est pas
       exposee sur window, on lit donc la portee de script directement. */
    const data = () => (typeof quizzesData !== 'undefined') ? quizzesData : {};

    function pool(theme, levels) {
        const src = data(), out = [];
        for (const k of theme.keys) {
            const q = src[k];
            if (!q) continue;
            for (const lv of levels) if (Array.isArray(q[lv])) out.push(...q[lv]);
        }
        return out;
    }

    /* Tire une question inedite pour la partie, propositions melangees. */
    function draw(theme, levels) {
        let p = pool(theme, levels).filter(q => !S.used.has(q.question));
        if (!p.length) p = pool(theme, ['facile', 'moyen', 'difficile']).filter(q => !S.used.has(q.question));
        if (!p.length) return null;

        const q = p[(Math.random() * p.length) | 0];
        S.used.add(q.question);

        const order = shuffle(q.options.map((_, i) => i));
        return {
            theme: theme.nm,
            question: q.question,
            options: order.map(i => q.options[i]),
            correct: order.indexOf(q.correct),
        };
    }

    /* ---------- Affichage ---------- */
    function show(name) {
        ['intro', 'game', 'end'].forEach(s => {
            const el = $('screen-' + s);
            if (el) el.style.display = (s === name) ? '' : 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function refreshIntro() {
        const p = load(), c = champFor(p.streak);
        $('intro-avatar').textContent = c.av;
        $('intro-name').textContent = `${c.nm} — ${rankFor(p.streak)}`;
        $('intro-desc').textContent = c.desc;
        $('intro-streak').textContent = p.streak;
        $('intro-best').textContent = p.best;
    }

    const setLog = (html) => { $('log').innerHTML = html; };
    function setScores() { $('sc-you').textContent = S.you; $('sc-opp').textContent = S.opp; }

    function setRound(n) {
        for (let i = 1; i <= 3; i++) {
            const c = $('chip-' + i);
            c.classList.toggle('active', i === n);
            c.classList.toggle('done', i < n);
        }
        $('g-phase').textContent = ['', 'Manche 1 — Ouverture', 'Manche 2 — Le champion attaque', 'Manche 3 — Ton thème'][n];
    }

    function renderBoard(state) {
        const b = $('board');
        b.style.display = '';
        b.innerHTML = '';
        S.themes.forEach((t, i) => {
            const d = document.createElement('div');
            const st = state(i, t);
            d.className = 'cell' + (st.cls ? ' ' + st.cls : '');
            d.innerHTML = `<div class="ic">${t.ic}</div><div class="nm">${t.nm}</div>`;
            if (st.onClick) d.onclick = st.onClick;
            b.appendChild(d);
        });
    }
    const hideBoard = () => { $('board').style.display = 'none'; };

    /* ---------- Une question ---------- */
    function ask(q, label) {
        return new Promise(resolve => {
            const panel = $('q-panel');
            panel.style.display = '';
            $('q-theme').textContent = q.theme;
            $('q-count').textContent = label;
            $('q-text').textContent = q.question;

            const box = $('q-opts');
            box.innerHTML = '';
            let settled = false;

            const done = (chosen) => {
                if (settled) return;
                settled = true;
                stopTimer();
                [...box.children].forEach((b, i) => {
                    b.disabled = true;
                    if (i === q.correct) b.classList.add('correct');
                    else if (i === chosen) b.classList.add('wrong');
                });
                setTimeout(() => { panel.style.display = 'none'; resolve(chosen === q.correct); }, 1300);
            };

            q.options.forEach((opt, i) => {
                const b = document.createElement('button');
                b.className = 'q-opt'; b.type = 'button'; b.textContent = opt;
                b.onclick = () => done(i);
                box.appendChild(b);
            });

            startTimer(TIME, () => done(-1));
        });
    }

    /* Chrono base sur requestAnimationFrame : pas de derive, pas de setInterval orphelin. */
    function startTimer(seconds, onTimeout) {
        const fill = $('timer-fill');
        const end = performance.now() + seconds * 1000;
        const step = () => {
            const left = end - performance.now();
            fill.style.transform = `scaleX(${Math.max(0, left / (seconds * 1000))})`;
            if (left <= 0) { rafId = null; return onTimeout(); }
            rafId = requestAnimationFrame(step);
        };
        rafId = requestAnimationFrame(step);
    }
    function stopTimer() { if (rafId) cancelAnimationFrame(rafId); rafId = null; }

    /* Le champion repond a la meme question, selon sa force. */
    function champAnswers() { return Math.random() < S.champ.acc; }

    async function resolveQuestion(q, label) {
        const ok = await ask(q, label);
        const oppOk = champAnswers();
        if (ok) S.you++;
        if (oppOk) S.opp++;
        setScores();
        setLog(`${ok ? '✅ Bonne réponse.' : '❌ Raté.'} &nbsp; <strong class="opp">${S.champ.nm}</strong> ${oppOk ? 'marque aussi.' : 'se trompe.'}`);
        await wait(1500);
        return ok;
    }

    /* ---------- Déroulé ---------- */
    async function run() {
        /* ---- Manche 1 : question d'ouverture, thème tiré au sort ---- */
        setRound(1);
        hideBoard();
        setLog('🎲 Question d\'ouverture — thème tiré au sort…');
        await wait(1200);

        const t1 = S.themes[(Math.random() * S.themes.length) | 0];
        const q1 = draw(t1, ['facile', 'moyen']);
        if (!q1) return finish();
        const openOk = await resolveQuestion(q1, 'Question 1 / 10');

        setLog(openOk
            ? '🎯 Ouverture réussie — tu prends la main.'
            : `😬 Ouverture manquée — <strong class="opp">${S.champ.nm}</strong> mène la danse.`);
        await wait(1600);

        /* ---- Manche 2 : le champion choisit 4 thèmes ---- */
        setRound(2);
        setLog(`<strong class="opp">${S.champ.nm}</strong> choisit 4 thèmes pour te piéger…`);
        renderBoard(() => ({ cls: '' }));
        await wait(1000);

        const picks = shuffle(S.themes.map((_, i) => i)).slice(0, 4);
        const chosen = [];
        for (const idx of picks) {
            chosen.push(idx);
            renderBoard(i => ({ cls: chosen.includes(i) ? 'chosen-opp' : 'dim' }));
            setLog(`<strong class="opp">${S.champ.nm}</strong> choisit <strong>${S.themes[idx].nm}</strong>`);
            await wait(750);
        }
        await wait(700);

        for (let n = 0; n < picks.length; n++) {
            const idx = picks[n];
            renderBoard(i => ({ cls: i === idx ? 'chosen-opp current' : (chosen.includes(i) ? 'chosen-opp' : 'dim') }));
            setLog(`Thème imposé : <strong>${S.themes[idx].nm}</strong>`);
            await wait(800);
            const q = draw(S.themes[idx], ['moyen', 'difficile']);
            if (!q) break;
            await resolveQuestion(q, `Question ${n + 2} / 10`);
        }

        /* ---- Manche 3 : le joueur choisit son thème ---- */
        setRound(3);
        setLog('🎯 À toi de choisir ton thème — 5 questions dessus.');
        const myTheme = await pickTheme();
        hideBoard();

        for (let n = 0; n < 5; n++) {
            const q = draw(myTheme, [R3_LEVELS[n]]);
            if (!q) break;
            await resolveQuestion(q, `Question ${n + 6} / 10 · ${['Facile', 'Facile', 'Moyen', 'Moyen', 'Difficile'][n]}`);
        }

        finish();
    }

    /* Attend que le joueur clique un thème sur le plateau. */
    function pickTheme() {
        return new Promise(resolve => {
            renderBoard((i, t) => ({
                cls: 'pickable',
                onClick: async () => {
                    renderBoard(j => ({ cls: j === i ? 'chosen-you current' : 'dim' }));
                    setLog(`Ton thème : <strong class="you">${t.nm}</strong> — 5 questions.`);
                    await wait(1200);
                    resolve(t);
                },
            }));
        });
    }

    /* ---------- Fin ---------- */
    function finish() {
        stopTimer();
        $('q-panel').style.display = 'none';
        hideBoard();

        const won = S.you > S.opp;                 // egalite = le champion garde sa place
        const p = load();
        const before = p.streak;
        p.streak = won ? before + 1 : 0;
        p.best = Math.max(p.best, p.streak);
        save(p);

        const rBefore = rankFor(before), rAfter = rankFor(p.streak);

        $('end-emoji').textContent = won ? '👑' : '💀';
        $('end-title').textContent = won ? 'Tu prends sa place !' : `${S.champ.nm} garde sa place`;
        $('end-sub').textContent = won
            ? `Tu finis ${S.you} à ${S.opp}. Le prochain champion sera plus coriace.`
            : (S.you === S.opp
                ? `Égalité ${S.you} partout — en cas d'égalité, le champion conserve son titre.`
                : `Tu perds ${S.you} à ${S.opp}. Ta série repart de zéro.`);

        const rk = $('end-rank');
        if (won && rAfter !== rBefore) { rk.style.display = ''; rk.textContent = `🎖️ Nouveau titre débloqué : ${rAfter}`; }
        else rk.style.display = 'none';

        $('end-stats').innerHTML =
            `Série : <strong>${p.streak}</strong> &nbsp;·&nbsp; Record : <strong>${p.best}</strong> &nbsp;·&nbsp; Titre : <strong>${rAfter}</strong>`;

        show('end');
        refreshIntro();
    }

    /* ---------- Démarrage ---------- */
    function start() {
        const p = load(), c = champFor(p.streak);
        S = { champ: c, you: 0, opp: 0, used: new Set(), themes: shuffle(THEMES) };

        $('g-avatar').textContent = c.av;
        $('g-name').textContent = c.nm;
        $('lbl-opp').textContent = c.nm;
        $('g-streak').textContent = p.streak;
        $('q-panel').style.display = 'none';
        setScores();
        show('game');
        run();
    }

    document.addEventListener('DOMContentLoaded', refreshIntro);
    if (document.readyState !== 'loading') refreshIntro();

    return { start };
})();

window.Place = Place;
