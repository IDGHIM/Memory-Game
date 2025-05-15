/*Génération de cartes*/
document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");
  const counterDisplay = document.getElementById("moves-counter");
  let movesCounter = 0;
  let flippedCards = [];

  function generateRandomCards() {
    const cards = [];
    const values = [];

    for (let i = 0; i < 8; i++) {
      // 8 paires
      const randomValue = Math.floor(Math.random() * 100);
      values.push(randomValue, randomValue);
    }

    values.sort(() => Math.random() - 0.5);

    values.forEach((value) => {
      const card = document.createElement("div");
      card.className = "card";

      // card.dataset.value = value; Stocker la valeur des cartes pour les comparer plus tard notamment pour incrémenter le score et pour retourner les cartes qui ne forment pas de paire

      card.innerHTML = `<div class='card-inner'><div class='card-front'>?</div><div class='card-back'>${value}</div></div>`;

      card.addEventListener("click", function () {
        
// --------------- Modification pour éviter de pouvoir retourner une carte déjà retournée ou d'en retourner plus que 2 ---------------     
        
        if (card.classList.contains("flipped") || flippedCards.length >= 2)
          return;
        card.classList.add("flipped");
        flippedCards.push(card);

//-------------------------------------------------------------------------------------------------------------------------------------       


//   Compteur de coups:
           if (flippedCards.length === 2) {
          movesCounter++;
          counterDisplay.textContent = movesCounter;

        }
      });
      cardContainer.appendChild(card);
    });
  }

  generateRandomCards();
});

/*CHRONOMETRE*/
let chrono = document.getElementById("chrono");
let resetBtn = document.getElementById("reset");
let stopBtn = document.getElementById("stop");
let startBtn = document.getElementById("start");

let heures = 0;
let minutes = 0;
let secondes = 0;

let timeout;

let estArrete = true;

const demarrer = () => {
  if (estArrete) {
    estArrete = false;
    defilerTemps();
  }
};

const arreter = () => {
  if (!estArrete) {
    estArrete = true;
    clearTimeout(timeout);
  }
};

const defilerTemps = () => {
  if (estArrete) return;

  secondes = parseInt(secondes);
  minutes = parseInt(minutes);

  secondes++;

  if (secondes == 60) {
    minutes++;
    secondes = 0;
  }

  if (minutes == 60) {
    heures++;
    minutes = 0;
  }

  if (secondes < 10) {
    secondes = "0" + secondes;
  }

  if (minutes < 10) {
    minutes = "0" + minutes;
  }

  chrono.textContent = `${minutes}:${secondes}`;

  timeout = setTimeout(defilerTemps, 1000);
};

const reset = () => {
  chrono.textContent = "00:00";
  estArrete = true;
  minutes = 0;
  secondes = 0;
  clearTimeout(timeout);
};

startBtn.addEventListener("click", demarrer);
stopBtn.addEventListener("click", arreter);
resetBtn.addEventListener("click", reset);
