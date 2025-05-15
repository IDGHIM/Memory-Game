document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");
  const counterDisplay = document.getElementById("moves-counter");
  const bestScoreDisplay = document.getElementById("best-score");
  const chrono = document.getElementById("chrono");
  const resetBtn = document.getElementById("reset");

  let movesCounter = 0;
  let flippedCards = [];
  let matchedPairs = 0;

  // Chronomètre
  let heures = 0;
  let minutes = 0;
  let secondes = 0;
  let timeout;
  let estArrete = true;

  // Récupération du meilleur score dans le localStorage
  let bestScore = localStorage.getItem("bestScore");
  if (bestScore === null) {
    bestScoreDisplay.textContent = "--";
  } else {
    bestScoreDisplay.textContent = bestScore;
  }

  const demarrerChrono = () => {
    if (estArrete) {
      estArrete = false;
      defilerTemps();
    }
  };

  const arreterChrono = () => {
    estArrete = true;
    clearTimeout(timeout);
  };

  const defilerTemps = () => {
    if (estArrete) return;

    secondes++;

    if (secondes === 60) {
      minutes++;
      secondes = 0;
    }

    if (minutes === 60) {
      heures++;
      minutes = 0;
    }

    const minStr = minutes < 10 ? "0" + minutes : minutes;
    const secStr = secondes < 10 ? "0" + secondes : secondes;

    chrono.textContent = `${minStr}:${secStr}`;

    timeout = setTimeout(defilerTemps, 1000);
  };

  const resetChrono = () => {
    chrono.textContent = "00:00";
    estArrete = true;
    heures = 0;
    minutes = 0;
    secondes = 0;
    clearTimeout(timeout);
  };

  function generateRandomCards() {
    const values = [];

    for (let i = 0; i < 8; i++) {
      const randomValue = Math.floor(Math.random() * 100);
      values.push(randomValue, randomValue); // 8 paires
    }

    values.sort(() => Math.random() - 0.5); // Mélanger les cartes

    cardContainer.innerHTML = ""; // Nettoyer l'affichage
    movesCounter = 0;
    matchedPairs = 0;
    counterDisplay.textContent = movesCounter;
    flippedCards = [];

    resetChrono(); // Remise à zéro du chrono
    estArrete = true;

    values.forEach((value) => {
      const card = document.createElement("div");
      card.className = "card";
      card.dataset.value = value;

      card.innerHTML = `
        <div class='card-inner'>
          <div class='card-front'>?</div>
          <div class='card-back'>${value}</div>
        </div>`;

      card.addEventListener("click", function () {
        if (estArrete) {
          demarrerChrono(); // Premier clic = démarrage chrono
        }
        
        // Empêcher de retourner 2 fois la même carte & empêcher de retourner 2 cartes ou plus
        if (card.classList.contains("flipped") || flippedCards.length >= 2)
          return;

        card.classList.add("flipped");
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          movesCounter++;
          counterDisplay.textContent = movesCounter;

          const [card1, card2] = flippedCards;

          if (card1.dataset.value === card2.dataset.value) {
            matchedPairs++;
            flippedCards = [];

            // Si toutes les paires sont trouvées
            if (matchedPairs === 8) {
              arreterChrono();

              // Mise à jour du meilleur score si battu
              if (bestScore === null || movesCounter < parseInt(bestScore)) {
                localStorage.setItem("bestScore", movesCounter);
                bestScoreDisplay.textContent = movesCounter;
                alert(`Félicitations ! Nouveau meilleur score : ${movesCounter} coups.`);
              } else {
                alert(`Bravo ! Tu as terminé en ${movesCounter} coups.`);
              }

              // Recommencer une nouvelle partie
              generateRandomCards();
            }
          } else {
            // Mauvaise paire => retourner les cartes après un délai
            setTimeout(() => {
              card1.classList.remove("flipped");
              card2.classList.remove("flipped");
              flippedCards = [];
            }, 1000);
          }
        }
      });

      cardContainer.appendChild(card);
    });
  }

  // Bouton reset : relance une nouvelle partie
  resetBtn.addEventListener("click", () => {
    arreterChrono();
    resetChrono();
    generateRandomCards();
  });

  // Démarrage initial du jeu
  generateRandomCards();
});
