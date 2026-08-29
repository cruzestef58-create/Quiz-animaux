/* ============================================================
   Mode "Prends Ta Place" — QuizzlyUnivers
   Plateau 3x3 de thèmes + duel final contre un champion IA.
   Progression sauvegardée en localStorage.
   ============================================================ */
const Place = (() => {
    'use strict';

    /* ---------- Plateau : 9 thèmes, chacun agrège un ou plusieurs quiz ---------- */
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

    /* ---------- Champions : de plus en plus forts ---------- */
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

    const LINES = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6],
    ];

    const STORE = 'quizzly_place_v1';
    const DUEL_Q = 5, DUEL_TIME = 12;

    /* ---------- État ---------- */
    let S = null;
    let timerId = null, deadline = 0;

    /* ---------- Persistance (robuste : marche même si localStorage est bloqué) ---------- */
    function load() {
        try {
            const raw = localStorage.getItem(STORE);
            if (raw) {
                const d = JSON.parse(raw);
                return { streak: d.streak | 0, best: d.best | 0 };
            }
        } catch (e) { /* mode privé / stockage désactivé */ }
        return { streak: 0, best: 0 };
    }
    function save(p) {
        try { localStorage.setItem(STORE, JSON.stringify(p)); } catch (e) { /* ignore */ }
    }

    const rankFor = (n) => RANKS.filter(r => n >= r.min).pop().t;
    const champFor = (n) => CHAMPIONS[Math.min(n, CHAMPIONS.length - 1)];
    const $ = (id) => document.getElementById(id);
    const shuffle = (a) => { const b = a.slice(); for (let i = b.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [b[i], b[j]] = [b[j], b[i]]; } return b; };

    /* ---------- Pioche de questions ---------- */
    /* questions.js declare `const quizzesData` : une const de haut niveau n'est PAS
       exposee sur window, on passe donc par la portee de script directement. */
    function data() {
        return (typeof quizzesData !== 'undefined') ? quizzesData : {};
    }

    function pool(theme, levels) {
        const src = data();
        const out = [];
        for (const k of theme.keys) {
            const q = src[k];
            if (!q) continue;
            for (const lv of levels) if (Array.isArray(q[lv])) out.push(...q[lv]);
        }
        return out;
    }

    /* Renvoie une question jamais posée dans cette partie. */
    function draw(theme, levels) {
        const p = pool(theme, levels).filter(q => !S.used.has(q.question));
        const src = p.length ? p : pool(theme, levels);
        if (!src.length) return null;
        const q = src[(Math.random() * src.length) | 0];
        S.used.add(q.question);

        // On mélange les propositions pour ne pas figer la position de la bonne réponse.
        const idx = q.options.map((_, i) => i);
        const order = shuffle(idx);
        return {
            theme: theme.nm,
            question: q.question,
            options: order.map(i => q.options[i]),
            correct: order.indexOf(q.correct),
            explanation: q.explanation || '',
        };
    }

    /* ---------- Écrans ---------- */
    function show(name) {
        ['intro', 'game', 'end'].forEach(s => {
            const el = $('screen-' + s);
            if (el) el.style.display = (s === name) ? '' : 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function refreshIntro() {
        const p = load();
        const c = champFor(p.streak);
        $('intro-avatar').textContent = c.av;
        $('intro-name').textContent = `${c.nm} — ${rankFor(p.streak)}`;
        $('intro-desc').textContent = c.desc;
        $('intro-streak').textContent = p.streak;
        $('intro-best').textContent = p.best;
    }

    /* ---------- Démarrage ---------- */
    function start() {
        const p = load();
        const c = champFor(p.streak);
        S = {
            champ: c, streak: p.streak, best: p.best,
            phase: 'board',
            cells: Array(9).fill(null),      // null | 'you' | 'opp'
            themes: shuffle(THEMES),
            used: new Set(),
            turn: 'you',
            busy: false,
            duelIdx: 0, duelYou: 0, duelOpp: 0, duelRes: [],
        };

        $('g-avatar').textContent = c.av;
        $('g-name').textContent = c.nm;
        $('lbl-opp').textContent = c.nm;
        $('g-streak').textContent = p.streak;
        $('g-phase').textContent = 'Manche 1 — Le Plateau';
        $('duel-zone').style.display = 'none';
        $('board').style.display = '';
        $('q-panel').style.display = 'none';
        $('timer-bar').style.display = 'none';

        renderBoard();
        updateScores();
        setLog('À toi de jouer — choisis un thème.');
        show('game');
    }

    /* ---------- Plateau ---------- */
    function renderBoard() {
        const b = $('board');
        b.innerHTML = '';
        S.themes.forEach((t, i) => {
            const owner = S.cells[i];
            const d = document.createElement('div');
            d.className = 'cell' + (owner ? ` taken ${owner}` : '');
            d.innerHTML = `<div class="ic">${t.ic}</div><div class="nm">${t.nm}</div>`;
            if (!owner) d.onclick = () => pick(i);
            b.appendChild(d);
        });
    }

    function updateScores() {
        $('sc-you').textContent = S.phase === 'duel' ? S.duelYou : S.cells.filter(c => c === 'you').length;
        $('sc-opp').textContent = S.phase === 'duel' ? S.duelOpp : S.cells.filter(c => c === 'opp').length;
        $('box-you').classList.toggle('turn-active', S.turn === 'you');
        $('box-opp').classList.toggle('turn-active', S.turn === 'opp');
    }

    const setLog = (html) => { $('log').innerHTML = html; };

    /* ---------- Tour du joueur ---------- */
    function pick(i) {
        if (S.busy || S.cells[i] || S.turn !== 'you') return;
        S.busy = true;
        $('board').classList.add('locked');

        const q = draw(S.themes[i], ['facile', 'moyen']);
        if (!q) { S.busy = false; $('board').classList.remove('locked'); return; }

        askQuestion(q, false, (ok) => {
            S.cells[i] = ok ? 'you' : 'opp';
            setLog(ok
                ? `✅ Bonne réponse — tu captures <strong class="you">${S.themes[i].nm}</strong>.`
                : `❌ Raté — <strong class="opp">${S.champ.nm}</strong> prend ${S.themes[i].nm}.`);
            renderBoard();
            updateScores();
            setTimeout(() => afterMove('you'), 1400);
        });
    }

    /* ---------- Tour du champion ---------- */
    function oppTurn() {
        S.turn = 'opp';
        updateScores();
        setLog(`<strong class="opp">${S.champ.nm}</strong> réfléchit…`);

        setTimeout(() => {
            const free = S.cells.map((c, i) => c === null ? i : -1).filter(i => i >= 0);
            if (!free.length) return endBoard();

            // L'IA privilégie une case qui la fait gagner, sinon qui te bloque, sinon au hasard.
            const target = bestCell(free, 'opp') ?? bestCell(free, 'you') ?? free[(Math.random() * free.length) | 0];
            const ok = Math.random() < S.champ.acc;
            S.cells[target] = ok ? 'opp' : 'you';

            setLog(ok
                ? `<strong class="opp">${S.champ.nm}</strong> répond juste et prend ${S.themes[target].nm}.`
                : `<strong class="opp">${S.champ.nm}</strong> se trompe — <strong class="you">${S.themes[target].nm}</strong> est à toi !`);
            renderBoard();
            updateScores();
            setTimeout(() => afterMove('opp'), 1400);
        }, 1100);
    }

    /* Case qui complète un alignement pour `who` (2 sur 3 + 1 libre). */
    function bestCell(free, who) {
        for (const L of LINES) {
            const own = L.filter(i => S.cells[i] === who).length;
            const emptyCells = L.filter(i => S.cells[i] === null);
            if (own === 2 && emptyCells.length === 1 && free.includes(emptyCells[0])) return emptyCells[0];
        }
        return null;
    }

    function winningLine(who) {
        return LINES.find(L => L.every(i => S.cells[i] === who)) || null;
    }

    function afterMove(who) {
        const line = winningLine('you') || winningLine('opp');
        if (line) {
            const w = S.cells[line[0]];
            highlight(line);
            setLog(w === 'you'
                ? '🎯 Alignement ! Tu remportes la manche.'
                : `🎯 <strong class="opp">${S.champ.nm}</strong> aligne trois cases.`);
            return setTimeout(() => w === 'you' ? startDuel() : finish(false), 1900);
        }
        if (S.cells.every(c => c !== null)) return endBoard();

        S.turn = (who === 'you') ? 'opp' : 'you';
        S.busy = false;
        $('board').classList.remove('locked');
        updateScores();

        if (S.turn === 'opp') oppTurn();
        else setLog('À toi — choisis un thème.');
    }

    function highlight(line) {
        const cells = $('board').children;
        line.forEach(i => cells[i] && cells[i].classList.add('win'));
    }

    function endBoard() {
        const you = S.cells.filter(c => c === 'you').length;
        const opp = S.cells.filter(c => c === 'opp').length;
        setLog(`Plateau complet — ${you} contre ${opp}.`);
        setTimeout(() => you > opp ? startDuel() : finish(false), 1700);
    }

    /* ---------- Manche 2 : le duel ---------- */
    function startDuel() {
        S.phase = 'duel';
        S.turn = 'you';
        $('board').style.display = 'none';
        $('duel-zone').style.display = '';
        $('g-phase').textContent = 'Manche 2 — Le Duel';
        renderPips();
        updateScores();
        setLog(`⚔️ Duel final — ${DUEL_Q} questions difficiles, ${DUEL_TIME} secondes chacune.`);
        setTimeout(duelNext, 1600);
    }

    function renderPips() {
        const p = $('pips');
        p.innerHTML = '';
        for (let i = 0; i < DUEL_Q; i++) {
            const d = document.createElement('div');
            d.className = 'pip' + (S.duelRes[i] ? ' ' + S.duelRes[i] : '');
            p.appendChild(d);
        }
    }

    function duelNext() {
        if (S.duelIdx >= DUEL_Q) {
            return finish(S.duelYou > S.duelOpp);
        }
        const theme = S.themes[(Math.random() * S.themes.length) | 0];
        const q = draw(theme, ['difficile', 'moyen']);
        if (!q) return finish(S.duelYou > S.duelOpp);

        setLog(`Question ${S.duelIdx + 1} sur ${DUEL_Q}`);
        askQuestion(q, true, (ok) => {
            const oppOk = Math.random() < S.champ.acc;
            if (ok) S.duelYou++;
            if (oppOk) S.duelOpp++;
            S.duelRes[S.duelIdx] = ok && !oppOk ? 'you' : (!ok && oppOk ? 'opp' : '');
            S.duelIdx++;

            setLog(`${ok ? '✅ Tu marques.' : '❌ Manqué.'} &nbsp; ${oppOk
                ? `<strong class="opp">${S.champ.nm}</strong> marque aussi.`
                : `<strong class="opp">${S.champ.nm}</strong> se trompe.`}`);
            renderPips();
            updateScores();
            setTimeout(duelNext, 1700);
        });
    }

    /* ---------- Affichage d'une question ---------- */
    function askQuestion(q, timed, done) {
        const panel = $('q-panel');
        panel.style.display = '';
        $('q-theme').textContent = q.theme;
        $('q-text').textContent = q.question;

        const box = $('q-opts');
        box.innerHTML = '';
        let settled = false;

        const finishQ = (chosen) => {
            if (settled) return;
            settled = true;
            stopTimer();
            const ok = chosen === q.correct;
            [...box.children].forEach((b, i) => {
                b.disabled = true;
                if (i === q.correct) b.classList.add('correct');
                else if (i === chosen) b.classList.add('wrong');
            });
            setTimeout(() => { panel.style.display = 'none'; done(ok); }, 1200);
        };

        q.options.forEach((opt, i) => {
            const b = document.createElement('button');
            b.className = 'q-opt';
            b.type = 'button';
            b.textContent = opt;
            b.onclick = () => finishQ(i);
            box.appendChild(b);
        });

        if (timed) startTimer(DUEL_TIME, () => finishQ(-1));
        else $('timer-bar').style.display = 'none';
    }

    /* ---------- Chrono (requestAnimationFrame : pas de setInterval qui dérive) ---------- */
    function startTimer(seconds, onTimeout) {
        const bar = $('timer-bar'), fill = $('timer-fill');
        bar.style.display = '';
        deadline = performance.now() + seconds * 1000;

        const step = () => {
            const left = deadline - performance.now();
            const ratio = Math.max(0, left / (seconds * 1000));
            fill.style.transform = `scaleX(${ratio})`;
            if (left <= 0) { timerId = null; return onTimeout(); }
            timerId = requestAnimationFrame(step);
        };
        timerId = requestAnimationFrame(step);
    }
    function stopTimer() {
        if (timerId) cancelAnimationFrame(timerId);
        timerId = null;
        $('timer-bar').style.display = 'none';
    }

    /* ---------- Fin de partie ---------- */
    function finish(won) {
        stopTimer();
        $('q-panel').style.display = 'none';

        const before = S.streak;
        const p = load();
        p.streak = won ? before + 1 : 0;
        p.best = Math.max(p.best, p.streak);
        save(p);

        const rankBefore = rankFor(before), rankAfter = rankFor(p.streak);

        $('end-emoji').textContent = won ? '👑' : '💀';
        $('end-title').textContent = won ? 'Tu prends sa place !' : 'Le champion garde sa place';
        $('end-sub').textContent = won
            ? `Tu as battu ${S.champ.nm}. Le prochain sera plus coriace.`
            : `${S.champ.nm} t'a résisté. Ta série repart de zéro.`;

        const rk = $('end-rank');
        if (won && rankAfter !== rankBefore) {
            rk.style.display = '';
            rk.textContent = `🎖️ Nouveau titre débloqué : ${rankAfter}`;
        } else {
            rk.style.display = 'none';
        }

        $('end-stats').innerHTML =
            `Série : <strong>${p.streak}</strong> &nbsp;·&nbsp; Record : <strong>${p.best}</strong> &nbsp;·&nbsp; Titre : <strong>${rankAfter}</strong>`;

        show('end');
        refreshIntro();
    }

    /* ---------- Init ---------- */
    document.addEventListener('DOMContentLoaded', refreshIntro);
    if (document.readyState !== 'loading') refreshIntro();

    return { start };
})();

window.Place = Place;
