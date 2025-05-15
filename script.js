document.addEventListener("DOMContentLoaded", () => {
  const cardContainer = document.getElementById("card-container");

  function generateRandomCards() {
    const cards = [];
    const values = [];

    for (let i = 0; i < 8; i++) { // 8 paires
      const randomValue = Math.floor(Math.random() * 100);
      values.push(randomValue, randomValue);
    }

    values.sort(() => Math.random() - 0.5);

    values.forEach(value => {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `<div class='card-inner'><div class='card-front'>?</div><div class='card-back'>${value}</div></div>`;
      card.addEventListener('click', function() {
        card.classList.toggle('flipped');
      });
      cardContainer.appendChild(card);
    });
  }

  generateRandomCards();
});

//chrono


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

