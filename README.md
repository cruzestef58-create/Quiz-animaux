# Quiz Univers Animal 🦁

Un site éducatif proposant des quizzes interactifs sur l'univers animal avec des questions vérifiées et des sources fiables.

## 📋 Structure du Projet

```
site/
├── index.html                  # Page d'accueil
├── quiz-education-canine.html  # Quiz sur l'éducation canine
├── styles.css                  # Feuille de style
├── script.js                   # Logique du quiz
├── questions.js                # Base de données des questions
└── README.md                   # Ce fichier
```

## 🚀 Comment utiliser

1. **Ouvrir le site** : Ouvrez `index.html` dans votre navigateur
2. **Choisir un thème** : Cliquez sur "Commencer le Quiz" sous le thème souhaité
3. **Répondre aux questions** : Sélectionnez votre réponse et cliquez sur "Suivant"
4. **Voir les résultats** : À la fin, consultez votre score et le détail de vos réponses
5. **Vérifier les sources** : Chaque question inclut sa source vérifiée

## 📚 Thèmes Disponibles

### 1. L'Éducation Canine ✅
- 10 questions sur l'éducation et le comportement canin
- Basées sur des sources de référence internationales
- Couvre : sociabilisation, apprentissage, comportement, exercice, etc.

### Autres thèmes (À venir)
- Les Félidés 🐱
- L'Ornithologie 🐦

## 📖 Sources Utilisées pour L'Éducation Canine

1. **Association Française de Comportement Animal (AFCA)**
   - Référence en comportement animal français

2. **American Kennel Club (AKC)**
   - Organisation canine américaine de référence
   - Standards de race et bonnes pratiques

3. **Université du Québec**
   - Recherches sur le conditionnement canin
   - Études comportementales

4. **IAABC (International Association of Animal Behavior Consultants)**
   - Certification professionnelle en comportement animal
   - Méthodes d'éducation positive

5. **Université de Bristol**
   - Études scientifiques sur l'agressivité canine
   - Recherche comportementale

6. **Veterinary American College**
   - Recommandations vétérinaires
   - Besoins d'exercice et santé

## 🎯 Fonctionnalités

- ✅ **Questions Vérifiées** : Toutes les questions sont basées sur des sources fiables
- ✅ **Sources Citées** : Chaque réponse inclut sa source pour la vérification
- ✅ **Rétroaction Détaillée** : Vous voyez vos erreurs et les bonnes réponses
- ✅ **Design Responsive** : Fonctionne sur tous les appareils (mobile, tablette, ordinateur)
- ✅ **Suivi de Progression** : Barre de progression visuelle pendant le quiz
- ✅ **Notation** : Système de notation clair et motivant

## 💡 Conseils pour Utiliser le Site

1. **Prenez votre temps** : Il n'y a pas de limite de temps
2. **Vérifiez les sources** : Après le quiz, consultez les sources pour approfondir
3. **Recommencez** : Rejouer le quiz pour vous améliorer
4. **Partagez** : Proposez ce site à d'autres amateurs d'animaux

## 🔧 Développement

### Pour ajouter de nouvelles questions :
Modifiez le fichier `questions.js` et ajoutez une nouvelle question dans le format suivant :

```javascript
{
    id: 11,
    question: "Votre question ?",
    options: [
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4"
    ],
    correct: 0,  // Index de la bonne réponse (0-3)
    source: "Source vérifiée - Description détaillée"
}
```

### Pour ajouter un nouveau thème :
1. Créez un nouveau fichier HTML (ex: `quiz-felides.html`)
2. Ajoutez les questions dans `questions.js`
3. Créez une entrée dans l'objet `quizzesData`
4. Ajoutez un lien dans la navigation

## 🌐 Déploiement (GitHub Pages)

Le site est 100% statique (aucun build step). Pour le publier sur GitHub Pages :

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<ton-pseudo>/<ton-repo>.git
git push -u origin main
```

Puis sur GitHub : **Settings → Pages → Source : `main` / `/ (root)`**.

Le site sera en ligne sur `https://<ton-pseudo>.github.io/<ton-repo>/`.

Le fichier `.nojekyll` à la racine désactive le traitement Jekyll de GitHub Pages
et garantit que tous les fichiers sont servis tels quels.

## 📞 Support et Questions

Pour toute question ou suggestion, veuillez consulter les sources citées pour approfondir vos connaissances.

## 📄 Licence

Site éducatif à usage libre. Les sources sont attribuées correctement.

---

**Créé en 2026** | Quiz Univers Animal | Site Éducatif
