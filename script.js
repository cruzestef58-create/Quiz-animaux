
// Quiz Controller
class QuizManager {
    constructor(quizData, difficulty = 'moyen') {
        this.allQuizData = quizData;
        this.difficulty = difficulty;
        
        // Get all questions for the selected difficulty
        // Si quizData.questions existe déjà (mode aléatoire), on l'utilise directement
        const allQuestions = quizData.questions || quizData[difficulty] || quizData.moyen;

        // Shuffle and select 10 random questions from the pool
        this.quizData = {
            ...quizData,
            questions: quizData.questions
                ? this.shuffle(quizData.questions)   // déjà sélectionnées, on ré-mélange juste l'ordre
                : this.getRandomQuestions(allQuestions, 10)
        };
        
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswers = [];
        this.quizStarted = false;
        this.quizFinished = false;
        this.answered = false;
    }

    // Shuffle array using Fisher-Yates algorithm
    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    // Get 10 random questions from the pool, guaranteeing at least 2 vrai/faux
    getRandomQuestions(allQuestions, count = 10) {
        const vfQuestions = allQuestions.filter(q => q.type === 'vrai_faux');
        const normalQuestions = allQuestions.filter(q => q.type !== 'vrai_faux');

        const shuffledVF = this.shuffle(vfQuestions);
        const shuffledNormal = this.shuffle(normalQuestions);

        const minVF = Math.min(2, shuffledVF.length);
        const selected = [
            ...shuffledVF.slice(0, minVF),
            ...shuffledNormal.slice(0, count - minVF)
        ];

        return this.shuffle(selected).slice(0, Math.min(count, selected.length));
    }

    init() {
        this.renderQuestion();
    }

    renderQuestion() {
        if (this.currentQuestion >= this.quizData.questions.length) {
            this.finishQuiz();
            return;
        }

        const question = this.quizData.questions[this.currentQuestion];
        const questionContainer = document.getElementById('question-container');
        const progressBar = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');

        // Update progress
        const progress = ((this.currentQuestion + 1) / this.quizData.questions.length) * 100;
        progressBar.style.width = progress + '%';
        progressText.textContent = `Question ${this.currentQuestion + 1}/${this.quizData.questions.length}`;

        let html = `
            <div class="question-number">Question ${this.currentQuestion + 1}</div>
            <div class="question-text">${question.question}</div>
            ${question.image ? `<div class="question-image"><img src="${question.image}" alt="Illustration de la question" loading="lazy" onerror="this.parentElement.style.display='none'"></div>` : ''}
        `;

        if (question.type === 'vrai_faux') {
            html += `<div class="vf-options">`;
            question.options.forEach((option, index) => {
                const icon = index === 0 ? '✅' : '❌';
                html += `<button class="vf-btn" data-index="${index}">${icon} ${option}</button>`;
            });
            html += `</div>`;
        } else {
            // Render question with randomized answer order
            const optionsWithIndex = question.options.map((option, index) => ({ option, index }));
            const shuffledOptions = this.shuffle(optionsWithIndex);
            html += `<div class="options">`;
            shuffledOptions.forEach((item) => {
                html += `
                    <label class="option" data-index="${item.index}">
                        <input type="radio" name="answer" value="${item.index}">
                        <span>${item.option}</span>
                    </label>
                `;
            });
            html += `</div>`;
        }

        html += `
            <div class="explanation" id="question-explanation">
                <div class="explanation-title">💡 Explication :</div>
                <div class="explanation-text">${question.explanation || 'Pas d\'explication disponible.'}</div>
            </div>
            <div class="source" id="question-source">
                <div class="source-title">📚 Source :</div>
                <div class="source-text">${question.source}</div>
            </div>
        `;

        questionContainer.innerHTML = html;

        if (question.type === 'vrai_faux') {
            document.querySelectorAll('.vf-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.selectAnswer(parseInt(e.currentTarget.dataset.index)));
            });
        } else {
            // Add event listeners to radio buttons
            document.querySelectorAll('input[name="answer"]').forEach(radio => {
                radio.addEventListener('change', (e) => this.selectAnswer(parseInt(e.target.value)));
            });
        }

        // Reset state
        this.answered = false;
        this.updateNavigationButtons();
    }

    selectAnswer(index) {
        if (this.answered) return; // Prevent changing answer after submission

        this.selectedAnswers[this.currentQuestion] = index;
        const question = this.quizData.questions[this.currentQuestion];
        const isCorrect = index === question.correct;

        // Mark answer as answered
        this.answered = true;

        // Update score
        if (isCorrect) {
            this.score++;
        }

        // Show feedback
        this.showFeedback(isCorrect, question);

        // Disable all options
        document.querySelectorAll('input[name="answer"]').forEach(radio => {
            radio.disabled = true;
        });

        // Update button state
        this.updateNavigationButtons();
    }

    showFeedback(isCorrect, question) {
        const isVF = question.type === 'vrai_faux';
        const options = document.querySelectorAll(isVF ? '.vf-btn' : '.option');

        options.forEach((option) => {
            const optionIndex = parseInt(option.dataset.index, 10);
            if (optionIndex === question.correct) {
                option.classList.add('correct');
            }
            if (optionIndex === this.selectedAnswers[this.currentQuestion] && !isCorrect) {
                option.classList.add('incorrect');
            }
            option.classList.add('disabled');
            if (isVF) option.disabled = true;
        });

        // Show explanation
        const explanationElement = document.getElementById('question-explanation');
        if (explanationElement) {
            explanationElement.classList.add('show');
        }

        // Show source
        const sourceElement = document.getElementById('question-source');
        if (sourceElement) {
            sourceElement.classList.add('show');
        }
    }

    updateNavigationButtons() {
        const nextBtn = document.getElementById('next-button');

        if (nextBtn) {
            if (this.answered) {
                if (this.currentQuestion === this.quizData.questions.length - 1) {
                    nextBtn.textContent = 'Voir les résultats';
                } else {
                    nextBtn.textContent = 'Suivant →';
                }
                nextBtn.disabled = false;
            } else {
                nextBtn.disabled = true;
                if (this.currentQuestion === this.quizData.questions.length - 1) {
                    nextBtn.textContent = 'Terminer';
                } else {
                    nextBtn.textContent = 'Suivant →';
                }
            }
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.quizData.questions.length - 1) {
            this.currentQuestion++;
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.renderQuestion();
        } else {
            this.finishQuiz();
        }
    }


    finishQuiz() {
        this.showResults();
    }

    showResults() {
        const quizContainer = document.getElementById('quiz-container');
        const resultsContainer = document.getElementById('results-container');
        
        quizContainer.style.display = 'none';
        resultsContainer.style.display = 'block';

        const percentage = (this.score / this.quizData.questions.length) * 100;
        
        // Support both old and new structure
        const scorePercentageElement = document.getElementById('score-percentage');
        const scoreTextElement = document.getElementById('score-text');
        const performanceMessageElement = document.getElementById('performance-message');
        const reviewSection = document.getElementById('review-section');
        const messageElement = document.getElementById('results-message');
        
        // Old structure elements
        const scoreElement = document.getElementById('results-score');
        const detailsElement = document.getElementById('results-details');

        // Update new structure if elements exist
        if (scorePercentageElement) {
            scorePercentageElement.textContent = `${Math.round(percentage)}%`;
        }
        if (scoreTextElement) {
            scoreTextElement.textContent = `${this.score}/${this.quizData.questions.length}`;
        }

        // Update old structure if elements exist
        if (scoreElement) {
            scoreElement.textContent = `${this.score}/${this.quizData.questions.length}`;
        }

        let message = '';
        if (percentage === 100) {
            message = 'Excellent ! Vous êtes un expert ! 🏆';
        } else if (percentage >= 80) {
            message = 'Très bien ! Vous avez des connaissances solides ! 👏';
        } else if (percentage >= 60) {
            message = 'Bien ! Vous avez une bonne compréhension du sujet. 😊';
        } else if (percentage >= 40) {
            message = 'À améliorer. Continuez à apprendre ! 📚';
        } else {
            message = 'Essayez encore ! Vous progresserez. 💪';
        }

        if (messageElement) {
            messageElement.textContent = message;
        }
        if (performanceMessageElement) {
            performanceMessageElement.textContent = message;
        }

        // Show detailed review
        let detailsHtml = '<h3 style="color: white; margin-bottom: 1.2rem; font-size: 1.2rem;">Récapitulatif de vos réponses :</h3>';
        this.quizData.questions.forEach((question, index) => {
            const isCorrect = this.selectedAnswers[index] === question.correct;
            const icon = isCorrect ? '✅' : '❌';
            const bgColor   = isCorrect ? 'rgba(16, 185, 129, 0.08)'  : 'rgba(239, 68, 68, 0.08)';
            const border    = isCorrect ? 'rgba(16, 185, 129, 0.35)'  : 'rgba(239, 68, 68, 0.35)';
            const labelGood = isCorrect ? 'rgba(16, 185, 129, 1)'     : 'rgba(239, 68, 68, 1)';
            detailsHtml += `
                <div style="
                    margin-bottom: 1rem;
                    padding: 1.2rem 1.4rem;
                    background: ${bgColor};
                    border: 1px solid ${border};
                    border-radius: 12px;
                ">
                    <p style="color: white; font-weight: 700; margin-bottom: 0.6rem; line-height: 1.5;">
                        ${icon} <span style="color: ${labelGood};">Question ${index + 1}</span> — ${question.question}
                    </p>
                    <p style="color: #94a3b8; margin-bottom: 0.3rem; font-size: 0.95rem;">
                        Votre réponse : <strong style="color: ${isCorrect ? 'rgba(16,185,129,0.9)' : 'rgba(239,68,68,0.9)'};">${question.options[this.selectedAnswers[index]] ?? '—'}</strong>
                    </p>
                    ${!isCorrect ? `
                    <p style="color: #94a3b8; margin-bottom: 0.3rem; font-size: 0.95rem;">
                        Bonne réponse : <strong style="color: rgba(16, 185, 129, 0.9);">${question.options[question.correct]}</strong>
                    </p>` : ''}
                    <p style="font-size: 0.75rem; color: #64748b; margin-top: 0.5rem; font-style: italic;">${question.source}</p>
                </div>
            `;
        });

        if (reviewSection) {
            reviewSection.innerHTML = detailsHtml;
        }
        if (detailsElement) {
            detailsElement.innerHTML = detailsHtml;
        }
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.selectedAnswers = [];
        this.answered = false;
        document.getElementById('quiz-container').style.display = 'block';
        document.getElementById('results-container').style.display = 'none';
        this.renderQuestion();
    }
}

// Function to start quiz with difficulty
function startQuiz(difficulty) {
    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme') || 'educationCanine';
    
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData[theme] || quizzesData.educationCanine;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button') || document.getElementById('next-btn');

    if (nextBtn) nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for education canine
function startQuizEducationCanine(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.educationCanine;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for cats
function startQuizChats(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.lesChats;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

function startQuizChiens(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.lesChiens;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}

function startQuizHarryPotter(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.harryPotter;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for ornithology
function startQuizOrnithologie(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.ornithologie;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for reptiles
function startQuizReptiles(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.reptiles;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for marine mammals
function startQuizMammiferesMarin(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.mammiferesMarin;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for lion
function startQuizLion(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.letion;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for aigle royal
function startQuizAigleRoyal(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.laigleroyal;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Function to start quiz with difficulty for tigre
function startQuizTigre(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    
    const quizData = quizzesData.letigre;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');

    nextBtn.onclick = () => quizManager.nextQuestion();
}

// Initialize quiz when page loads
let quizManager;

// ── Proposer un thème ──────────────────────────────────────────────────────

function showSuggestionModal() {
    if (!document.getElementById('suggestion-modal')) createSuggestionModal();
    const modal = document.getElementById('suggestion-modal');
    if (!document.body.contains(modal)) document.body.appendChild(modal);
    setTimeout(() => modal.classList.remove('hidden'), 10);
}

function hideSuggestionModal() {
    const modal = document.getElementById('suggestion-modal');
    if (modal) modal.classList.add('hidden');
}

function createSuggestionModal() {
    const modal = document.createElement('div');
    modal.id = 'suggestion-modal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-content suggestion-modal-content">
            <button class="modal-close" aria-label="Fermer">&times;</button>
            <h2>💡 Proposer un thème</h2>
            <p>Tu as une idée de thème pour un nouveau quiz ? Propose-la, on lit tous les messages !</p>
            <div class="modal-form">
                <input id="new-theme-input" type="text" placeholder="Ex : Les oiseaux marins, Les requins…" />
                <button id="submit-theme-button" class="btn btn-primary">Envoyer</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector('.modal-close').addEventListener('click', hideSuggestionModal);
    modal.addEventListener('click', e => { if (e.target === modal) hideSuggestionModal(); });
    modal.querySelector('#submit-theme-button').addEventListener('click', submitThemeSuggestion);
    modal.querySelector('#new-theme-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); submitThemeSuggestion(); }
    });
}

async function submitThemeSuggestion() {
    const input = document.getElementById('new-theme-input');
    const theme = input.value.trim();
    if (!theme) { alert('Écris un thème avant d\'envoyer !'); return; }

    const btn = document.getElementById('submit-theme-button');
    btn.disabled = true;
    btn.textContent = 'Envoi…';

    try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                type: '💡 Proposition de thème',
                message: theme,
                date: new Date().toLocaleDateString('fr-FR')
            })
        });
        if (res.ok) {
            input.value = '';
            btn.textContent = '✅ Envoyé !';
            setTimeout(() => {
                btn.disabled = false;
                btn.textContent = 'Envoyer';
                hideSuggestionModal();
            }, 1500);
        } else {
            throw new Error();
        }
    } catch {
        alert('Erreur lors de l\'envoi. Réessaie plus tard.');
        btn.disabled = false;
        btn.textContent = 'Envoyer';
    }
}

// ── Support / Don modal ────────────────────────────────────────────────────

const KOFI_URL = 'https://ko-fi.com/estebancruz0712';

function createSupportModal() {
    const modal = document.createElement('div');
    modal.id = 'support-modal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-content support-modal-content">
            <button class="modal-close" aria-label="Fermer">&times;</button>
            <div class="support-icon">♥</div>
            <h2>Soutenir QuizzlyUnivers</h2>
            <p class="support-intro">
                Le site est <strong>entièrement gratuit</strong> et <strong>sans aucune publicité</strong>.
                Chaque question est écrite, vérifiée et sourcée à la main — cela représente
                beaucoup de temps.
            </p>
            <ul class="support-list">
                <li>☕ Un café, c'est déjà énorme</li>
                <li>🎯 Ça m'aide à créer de nouveaux thèmes</li>
                <li>🔒 Le site restera gratuit dans tous les cas</li>
            </ul>
            <a href="${KOFI_URL}" class="btn-support-cta" target="_blank" rel="noopener noreferrer">
                ♥ Faire un don sur Ko-fi
            </a>
            <p class="support-note">Paiement sécurisé · Aucun compte requis · Montant libre</p>
            <button class="support-later">Une autre fois</button>
        </div>
    `;
    document.body.appendChild(modal);

    const fermer = () => closeSupportModal();
    modal.querySelector('.modal-close').addEventListener('click', fermer);
    modal.querySelector('.support-later').addEventListener('click', fermer);
    modal.addEventListener('click', e => { if (e.target === modal) fermer(); });
    // Le lien Ko-fi ouvre un nouvel onglet : on referme la fenetre derriere.
    modal.querySelector('.btn-support-cta').addEventListener('click', () => setTimeout(fermer, 300));
}

function openSupportModal() {
    if (!document.getElementById('support-modal')) createSupportModal();
    const modal = document.getElementById('support-modal');
    setTimeout(() => modal.classList.remove('hidden'), 10);
}

function closeSupportModal() {
    const modal = document.getElementById('support-modal');
    if (modal) modal.classList.add('hidden');
}

window.openSupportModal = openSupportModal;
window.closeSupportModal = closeSupportModal;

// Fermeture a la touche Echap, pour les deux fenetres
document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    closeSupportModal();
    if (typeof closeReportModal === 'function') closeReportModal();
});

// ── Report / Suggestion modal ──────────────────────────────────────────────

function createReportModal() {
    const modal = document.createElement('div');
    modal.id = 'report-modal';
    modal.className = 'modal hidden';
    modal.innerHTML = `
        <div class="modal-content report-modal-content">
            <button class="modal-close" aria-label="Fermer">&times;</button>
            <h2>🐛 Signaler un bug ou faire une suggestion</h2>
            <p>Tu as trouvé une erreur dans une question, une explication incorrecte, ou tu as une idée d'amélioration ? Dis-le nous !</p>
            <div class="report-form">
                <label class="report-label">Type</label>
                <div class="report-type-buttons">
                    <button class="report-type-btn active" data-type="bug">🐛 Bug / Erreur</button>
                    <button class="report-type-btn" data-type="suggestion">💡 Suggestion</button>
                </div>
                <label class="report-label">Quiz concerné</label>
                <select id="report-quiz-select" class="report-select">
                    <option value="">— Choisir un quiz —</option>
                    <option>Éducation Canine</option>
                    <option>Les Chats</option>
                    <option>Ornithologie</option>
                    <option>Reptiles</option>
                    <option>Mammifères Marins</option>
                    <option>Le Lion</option>
                    <option>L'Aigle Royal</option>
                    <option>Le Tigre</option>
                    <option value="general">Général / Autre</option>
                </select>
                <label class="report-label">Description</label>
                <textarea id="report-text" class="report-textarea" placeholder="Décris le problème ou la suggestion ici…" rows="4"></textarea>
                <button id="report-submit-btn" class="btn btn-primary">Envoyer</button>
            </div>
            <div id="report-history" class="report-history"></div>
        </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.modal-close').addEventListener('click', closeReportModal);
    modal.addEventListener('click', e => { if (e.target === modal) closeReportModal(); });

    modal.querySelectorAll('.report-type-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            modal.querySelectorAll('.report-type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    modal.querySelector('#report-submit-btn').addEventListener('click', submitReport);
    renderReportHistory();
}

function openReportModal() {
    if (!document.getElementById('report-modal')) createReportModal();
    renderReportHistory();
    const modal = document.getElementById('report-modal');
    setTimeout(() => modal.classList.remove('hidden'), 10);
}

function closeReportModal() {
    const modal = document.getElementById('report-modal');
    if (modal) modal.classList.add('hidden');
}

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xvzngdvd';

async function submitReport() {
    const typeBtn = document.querySelector('.report-type-btn.active');
    const type = typeBtn ? typeBtn.dataset.type : 'bug';
    const quiz = document.getElementById('report-quiz-select').value;
    const text = document.getElementById('report-text').value.trim();

    if (!text) { alert('Merci d\'écrire une description avant d\'envoyer.'); return; }

    const submitBtn = document.getElementById('report-submit-btn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours…';

    try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                type: type === 'bug' ? '🐛 Bug / Erreur' : '💡 Suggestion',
                quiz: quiz || 'Général',
                message: text,
                date: new Date().toLocaleDateString('fr-FR')
            })
        });

        if (res.ok) {
            document.getElementById('report-quiz-select').value = '';
            document.getElementById('report-text').value = '';
            submitBtn.textContent = '✅ Envoyé !';
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Envoyer';
                closeReportModal();
            }, 1500);
        } else {
            throw new Error('Erreur serveur');
        }
    } catch (e) {
        alert('Une erreur est survenue. Réessaie plus tard.');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer';
    }
}

function renderReportHistory() {
    const container = document.getElementById('report-history');
    if (!container) return;
    const reports = JSON.parse(localStorage.getItem('quizReports') || '[]');
    if (reports.length === 0) { container.innerHTML = ''; return; }
    container.innerHTML = `<h3>Tes signalements (${reports.length})</h3>` +
        reports.slice().reverse().map(r => `
            <div class="report-card">
                <span class="report-tag report-tag-${r.type}">${r.type === 'bug' ? '🐛 Bug' : '💡 Suggestion'}</span>
                <span class="report-quiz-tag">${r.quiz}</span>
                <p>${r.text}</p>
                <small>${r.date}</small>
            </div>
        `).join('');
}

// ── End Report modal ───────────────────────────────────────────────────────

function suggestNewTheme() {
    showSuggestionModal();
}

document.addEventListener('DOMContentLoaded', () => {
    // Show difficulty selection
    const difficultySelection = document.getElementById('difficulty-selection');
    if (difficultySelection) {
        difficultySelection.style.display = 'block';
        document.getElementById('quiz-container').style.display = 'none';
    }
    // ensure suggestion button works on all pages
    if (document.querySelector('.suggestion-button')) {
        if (!document.getElementById('suggestion-modal')) {
            createSuggestionModal();
        }
    }
});

// ── Catégories & sous-thèmes ───────────────────────────────────────────────

const categories = {
    felins: {
        label: '🐾 Félins',
        quizzes: [
            { icon: '🐱', title: 'Les Chats', desc: 'Comportement, biologie et secrets du monde félin domestique.', url: 'quiz-les-chats.html' },
            { icon: '🦁', title: 'Le Lion', desc: 'Le roi de la savane, sa vie sociale et ses stratégies de chasse.', url: 'quiz-le-lion.html' },
            { icon: '🐅', title: 'Le Tigre', desc: 'Le plus grand félin sauvage et ses mystères en forêt profonde.', url: 'quiz-le-tigre.html' },
        ]
    },
    oiseaux: {
        label: '🦅 Oiseaux',
        quizzes: [
            { icon: '🐦', title: 'L\'Ornithologie', desc: 'Biologie, migration et comportements du monde des oiseaux.', url: 'quiz-ornithologie.html' },
            { icon: '🦅', title: 'L\'Aigle Royal', desc: 'Le roi des rapaces et ses capacités de vol exceptionnelles.', url: 'quiz-aigle-royal.html' },
        ]
    },
    canides: {
        label: '🐕 Canidés',
        quizzes: [
            { icon: '🐕', title: 'Les Chiens', desc: 'Races, biologie, sens et histoire du meilleur ami de l\'humain.', url: 'quiz-les-chiens.html' },
            { icon: '🎓', title: 'L\'Éducation Canine', desc: 'Secrets pour éduquer votre chien et comprendre son comportement.', url: 'quiz-education-canine.html' },
        ]
    },
    reptiles: {
        label: '🐍 Reptiles',
        quizzes: [
            { icon: '🐍', title: 'Les Reptiles', desc: 'Serpents, lézards, tortues, crocodiliens et leurs adaptations.', url: 'quiz-reptiles.html' },
        ]
    },
    marins: {
        label: '🌊 Mammifères Marins',
        quizzes: [
            { icon: '🐋', title: 'Les Mammifères Marins', desc: 'Baleines, dauphins, phoques et merveilles des océans.', url: 'quiz-mammiferes-marins.html' },
        ]
    },
    sciences: {
        label: '🔬 Sciences',
        quizzes: [
            { icon: '🫀', title: 'Le Corps Humain', desc: 'Anatomie, physiologie et biologie — des organes aux cellules.', url: 'quiz-corps-humain.html' },
        ]
    },
    geographie: {
        label: '🌍 Géographie',
        quizzes: [
            { icon: '🌍', title: 'Géographie Mondiale', desc: 'Capitales, pays, fleuves, reliefs et géopolitique — partez à la conquête du monde.', url: 'quiz-geographie.html' },
        ]
    },
    histoire: {
        label: '🇫🇷 Histoire',
        quizzes: [
            { icon: '⚜️', title: 'Histoire de France', desc: 'Rois, révolutions, guerres et grands personnages qui ont forgé l\'identité française.', url: 'quiz-histoire-france.html' },
        ]
    },
    cultureg: {
        label: '🧠 Culture Générale',
        quizzes: [
            { icon: '🧠', title: 'Culture Générale', desc: 'Sciences, arts, littérature, sport, histoire — tous les savoirs essentiels.', url: 'quiz-culture-generale.html' },
        ]
    },
    astrologie: {
        label: '🔮 Astrologie',
        quizzes: [
            { icon: '🔮', title: 'Astrologie', desc: 'Les 12 signes, les éléments, les planètes et le zodiaque chinois.', url: 'quiz-astrologie.html' },
        ]
    },
    filmsseries: {
        label: '🎬 Films & Séries',
        quizzes: [
            { icon: '⚡', title: 'Harry Potter', desc: 'Sorts, Horcruxes, Poudlard et tous les secrets de l\'univers de J.K. Rowling.', url: 'quiz-harry-potter.html' },
            { icon: '⭐', title: 'Star Wars', desc: 'La Force, les Jedi, les Sith et toute la saga Skywalker dans une galaxie très très lointaine.', url: 'quiz-star-wars.html' },
            { icon: '🩸', title: 'Jujutsu Kaisen', desc: 'Sukuna, Gojo, les fléaux maudits et toute la saga Jujutsu Kaisen de Gege Akutami.', url: 'quiz-jujutsu-kaisen.html' },
            { icon: '🎥', title: 'Cinéma', desc: 'Acteurs, réalisateurs, films cultes, séries, Cannes et Oscars — le cinéma en grand.', url: 'quiz-cinema.html' },
        ]
    },
};

function openCategory(key) {
    const cat = categories[key];
    if (!cat) return;

    // Afficher les sous-thèmes
    const grid = document.getElementById('subthemes-grid');
    grid.innerHTML = cat.quizzes.map(q => `
        <div class="theme-card" style="animation: fadeInUp 0.4s ease both;">
            <div class="theme-icon">${q.icon}</div>
            <h3>${q.title}</h3>
            <p>${q.desc}</p>
            <a href="${q.url}" class="btn btn-primary">Commencer le Quiz</a>
        </div>
    `).join('');

    document.getElementById('themes-title').textContent = cat.label;
    document.getElementById('categories-view').classList.add('hidden');
    document.getElementById('subthemes-view').classList.remove('hidden');
    hideCategoryPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeCategory() {
    document.getElementById('themes-title').textContent = 'Thèmes de Quiz';
    document.getElementById('subthemes-view').classList.add('hidden');
    document.getElementById('categories-view').classList.remove('hidden');
    showCategoryPagination();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.openCategory = openCategory;
window.closeCategory = closeCategory;

// ── Barre de recherche ────────────────────────────────────────────────────────

// Index plat de tous les quiz (construit à partir de `categories`)
function buildSearchIndex() {
    const index = [];
    for (const [catKey, cat] of Object.entries(categories)) {
        for (const quiz of cat.quizzes) {
            index.push({
                icon: quiz.icon,
                title: quiz.title,
                desc: quiz.desc,
                url: quiz.url,
                category: cat.label,
                // Texte de recherche normalisé (minuscules, sans accents)
                search: normalize(quiz.title + ' ' + quiz.desc + ' ' + cat.label),
            });
        }
    }
    return index;
}

function normalize(str) {
    return str.toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '');
}

function highlight(text, query) {
    if (!query) return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(${escaped})`, 'gi');
    return text.replace(re, '<mark>$1</mark>');
}


/* ============================================================
   Pagination de la vue catégories — 9 cartes par page.
   Les cartes sont statiques dans index.html : on les masque
   plutôt que de les regénérer, pour ne rien casser ailleurs.
   ============================================================ */
const CARDS_PER_PAGE = 9;
let categoryPage = 1;

function categoryCards() {
    const cv = document.getElementById('categories-view');
    return cv ? [...cv.querySelectorAll('.category-card')] : [];
}

function totalCategoryPages() {
    return Math.max(1, Math.ceil(categoryCards().length / CARDS_PER_PAGE));
}

function renderCategoryPage(page) {
    const cards = categoryCards();
    if (!cards.length) return;

    const pages = totalCategoryPages();
    categoryPage = Math.min(Math.max(1, page), pages);

    const start = (categoryPage - 1) * CARDS_PER_PAGE;
    const end   = start + CARDS_PER_PAGE;

    cards.forEach((card, i) => {
        const visible = i >= start && i < end;
        card.style.display = visible ? '' : 'none';
        if (visible) {
            // Relance l'apparition en cascade sur la nouvelle page.
            card.style.animation = 'none';
            void card.offsetWidth;                       // force un reflow
            card.style.animation = '';
            card.style.animationDelay = ((i - start) * 0.05) + 's';
        }
    });

    renderCategoryPagination();
}

function renderCategoryPagination() {
    const box = document.getElementById('categories-pagination');
    if (!box) return;

    const pages = totalCategoryPages();
    if (pages <= 1) { box.innerHTML = ''; box.style.display = 'none'; return; }

    box.style.display = '';
    const prevOff = categoryPage === 1;
    const nextOff = categoryPage === pages;

    let dots = '';
    for (let p = 1; p <= pages; p++) {
        dots += `<button class="page-dot${p === categoryPage ? ' active' : ''}" onclick="goToCategoryPage(${p})" aria-label="Page ${p}">${p}</button>`;
    }

    box.innerHTML = `
        <button class="page-btn" ${prevOff ? 'disabled' : ''} onclick="goToCategoryPage(${categoryPage - 1})">← Précédent</button>
        <div class="page-dots">${dots}</div>
        <button class="page-btn" ${nextOff ? 'disabled' : ''} onclick="goToCategoryPage(${categoryPage + 1})">Suivant →</button>
    `;
}

function goToCategoryPage(page) {
    renderCategoryPage(page);
    const anchor = document.getElementById('themes-title');
    if (anchor) anchor.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function showCategoryPagination() {
    const box = document.getElementById('categories-pagination');
    if (box && totalCategoryPages() > 1) box.style.display = '';
}

function hideCategoryPagination() {
    const box = document.getElementById('categories-pagination');
    if (box) box.style.display = 'none';
}

window.goToCategoryPage = goToCategoryPage;

function initSearch() {
    const input = document.getElementById('quiz-search');
    if (!input) return;

    const searchIndex = buildSearchIndex();
    const resultsBox  = document.getElementById('search-results');
    const clearBtn    = document.getElementById('search-clear');
    const searchWrapper = document.getElementById('search-wrapper');

    input.addEventListener('input', () => {
        const raw   = input.value.trim();
        const query = normalize(raw);

        // Afficher / masquer bouton croix
        clearBtn.classList.toggle('hidden', raw === '');

        if (raw === '') {
            resultsBox.classList.add('hidden');
            showCategoriesView();
            return;
        }

        // Masquer les catégories pendant la recherche
        hideCategoriesView();

        // Filtrer
        const matches = searchIndex.filter(q => q.search.includes(query));

        if (matches.length === 0) {
            resultsBox.innerHTML = `<div class="search-no-result">😕 Aucun quiz trouvé pour "<strong>${raw}</strong>"</div>`;
        } else {
            resultsBox.innerHTML = matches.map(q => `
                <a class="search-result-item" href="${q.url}">
                    <span class="search-result-icon">${q.icon}</span>
                    <div class="search-result-info">
                        <div class="search-result-title">${highlight(q.title, raw)}</div>
                        <div class="search-result-desc">${q.desc}</div>
                    </div>
                    <span class="search-result-category">${q.category}</span>
                </a>
            `).join('');
        }

        resultsBox.classList.remove('hidden');
    });

    // Fermer les résultats si clic en dehors
    document.addEventListener('click', (e) => {
        if (!searchWrapper.contains(e.target)) {
            resultsBox.classList.add('hidden');
        }
    });

    // Rouvrir si on refocus l'input et qu'il y a du texte
    input.addEventListener('focus', () => {
        if (input.value.trim() !== '') {
            resultsBox.classList.remove('hidden');
        }
    });
}

function clearSearch() {
    const input = document.getElementById('quiz-search');
    const resultsBox = document.getElementById('search-results');
    const clearBtn = document.getElementById('search-clear');
    if (!input) return;
    input.value = '';
    clearBtn.classList.add('hidden');
    resultsBox.classList.add('hidden');
    showCategoriesView();
    input.focus();
}

function hideCategoriesView() {
    const cv = document.getElementById('categories-view');
    const sv = document.getElementById('subthemes-view');
    const title = document.getElementById('themes-title');
    if (cv) cv.classList.add('hidden');
    if (sv) sv.classList.add('hidden');
    if (title) title.style.display = 'none';
    hideCategoryPagination();
}

function showCategoriesView() {
    const cv = document.getElementById('categories-view');
    const title = document.getElementById('themes-title');
    if (cv) cv.classList.remove('hidden');
    if (title) { title.style.display = ''; title.textContent = 'Thèmes de Quiz'; }
    showCategoryPagination();
}

// Init au chargement de la page d'accueil
document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    renderCategoryPage(1);
    // Lance automatiquement le mode aléatoire si on est sur la bonne page
    if (document.getElementById('quiz-container') && window.location.pathname.includes('quiz-aleatoire')) {
        startRandomQuiz();
    }
});

window.clearSearch = clearSearch;

// ── Mode Aléatoire ────────────────────────────────────────────────────────────

function getAllQuestions() {
    const all = [];
    const levels = ['facile', 'moyen', 'difficile'];
    for (const [quizKey, quizData] of Object.entries(quizzesData)) {
        for (const level of levels) {
            if (!quizData[level]) continue;
            for (const q of quizData[level]) {
                all.push({
                    ...q,
                    _quizTitle: quizData.title,
                    _level: level,
                });
            }
        }
    }
    return all;
}

function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function startRandomQuiz() {
    const all = getAllQuestions();
    const picked = shuffleArray(all).slice(0, 10);

    // On construit un objet quizData factice compatible avec QuizManager
    const fakeQuizData = {
        title: '🎲 Mode Aléatoire',
        description: '10 questions piochées dans tous les thèmes',
        questions: picked,
    };

    // Mise à jour du badge thème dans le header
    const header = document.getElementById('quiz-header');
    if (header) {
        const themes = [...new Set(picked.map(q => q._quizTitle))];
        header.querySelector('p').textContent =
            `Thèmes : ${themes.join(' · ')}`;
    }

    quizManager = new QuizManager(fakeQuizData, 'random');
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    if (nextBtn) nextBtn.onclick = () => quizManager.nextQuestion();
}

window.startRandomQuiz = startRandomQuiz;

// Expose functions globally (requis pour type="module")
window.suggestNewTheme = suggestNewTheme;
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.hideSuggestionModal = hideSuggestionModal;
window.startQuiz = startQuiz;
window.startQuizEducationCanine = startQuizEducationCanine;
window.startQuizChats = startQuizChats;
window.startQuizOrnithologie = startQuizOrnithologie;
window.startQuizReptiles = startQuizReptiles;
window.startQuizMammiferesMarin = startQuizMammiferesMarin;
window.startQuizLion = startQuizLion;
window.startQuizAigleRoyal = startQuizAigleRoyal;
window.startQuizTigre = startQuizTigre;
window.startQuizChiens = startQuizChiens;
window.startQuizHarryPotter = startQuizHarryPotter;

function startQuizStarWars(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.starWars;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizStarWars = startQuizStarWars;

function startQuizJujutsuKaisen(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.jujutsuKaisen;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizJujutsuKaisen = startQuizJujutsuKaisen;

function startQuizCorpsHumain(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.corpsHumain;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizCorpsHumain = startQuizCorpsHumain;

function startQuizGeographie(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.geographie;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizGeographie = startQuizGeographie;

function startQuizHistoireFrance(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.histoireFrance;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizHistoireFrance = startQuizHistoireFrance;

function startQuizCinema(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.cinema;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizCinema = startQuizCinema;

function startQuizCultureG(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.cultureG;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizCultureG = startQuizCultureG;

function startQuizAstrologie(difficulty) {
    document.getElementById('difficulty-selection').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';

    const quizData = quizzesData.astrologie;
    quizManager = new QuizManager(quizData, difficulty);
    quizManager.init();

    const nextBtn = document.getElementById('next-button');
    nextBtn.onclick = () => quizManager.nextQuestion();
}
window.startQuizAstrologie = startQuizAstrologie;
