(() => {
  "use strict";
  /**
   * 2C = Two of Clubs (Tréboles)
   * 2D = Two of Diamonds (Diamantes)
   * 2H = Two of Hearts (Corazones)
   * 2S = Two of Spades (Espadas)
   */

  let deck = [];
  const types = ["C", "D", "H", "S"],
    specialTypes = ["A", "J", "Q", "K"];

  let playerPoints = [];

  // HTML References
  /**
   * The symbol '#' means querySelector is looking for an id reference
   * The symbol '.' means querySelector is looking for a class
   * No symbol means querySelector is looking for a tag element
   */
  const btnAsk = document.querySelector("#askCard"),
    btnStop = document.querySelector("#stop"),
    btnReset = document.querySelector("#newGame");

  const pointTags = document.querySelectorAll("small"),
    playerCardDivs = document.querySelectorAll(".divCards");

  // SOUND EFFECTS
  const ouhEffect = new Audio("assets/tracks/ouh.mp4"),
    yesEffect = new Audio("assets/tracks/yes.mp4"),
    askEffect = new Audio("assets/tracks/ask.mp4"),
    backgroundMusic = new Audio("assets/tracks/blackjack.mp3"),
    shuffleEffect = new Audio("assets/tracks/shuffling-cards.mp3");

  function initGame(numOfPlayers = 2) {
    deck = createDeck();
    playerPoints = [];
    for (let i = 0; i < numOfPlayers; i++) {
      playerPoints.push(0);
    }

    pointTags.forEach((elem) => (elem.innerText = 0));
    playerCardDivs.forEach((elem) => (elem.innerHTML = ""));
    disabledButtons(false);
  }

  function createDeck() {
    deck = [];
    for (let i = 2; i <= 10; i++) {
      for (let type of types) {
        deck.push(i + type);
      }
    }

    for (let type of types) {
      for (let special of specialTypes) {
        deck.push(special + type);
      }
    }

    shuffleEffect.play();
    return _.shuffle(deck);
  }

  function askCard() {
    if (deck.length === 0) throw "No cards in deck";
    askEffect.play();
    return deck.pop();
  }

  function cardValue(card) {
    const value = card.substring(0, card.length - 1);
    let points = 0;
    if (isNaN(value)) points = value === "A" ? 11 : 10;
    else points = Number(value);

    return points;
  }

  function disabledButtons(value) {
    btnAsk.disabled = value;
    btnStop.disabled = value;
  }

  const accumulatePoints = (card, turn) => {
    playerPoints[turn] = playerPoints[turn] + cardValue(card);
    pointTags[turn].innerText = playerPoints[turn];
    return playerPoints[turn];
  };

  const createCard = (card, turn) => {
    const newCardTag = document.createElement("img");
    newCardTag.src = `assets/cards/${card}.png`;
    newCardTag.classList.add("card");
    playerCardDivs[turn].append(newCardTag);
  };

  const getWinner = () => {
    const [minPoints, pcPoints] = playerPoints;
    setTimeout(() => {
      if (pcPoints === minPoints) {
        ouhEffect.play();
        alert("Nadie gana ):");
      } else if (pcPoints > 21) {
        yesEffect.play();
        alert("El jugador gana (:<");
      } else {
        ouhEffect.play();
        alert("La computadora gana ):<");
      }
    }, 100);
  };

  // PC TURN

  const pcTurn = (minPoints) => {
    let pcPoints = 0;
    do {
      const card = askCard();
      pcPoints = accumulatePoints(card, playerPoints.length - 1);
      createCard(card, playerPoints.length - 1);
      if (minPoints > 21) {
        break;
      }
    } while (pcPoints < minPoints && minPoints <= 32);

    getWinner();
  };

  // Events

  btnAsk.addEventListener("click", function () {
    const card = askCard();

    const plyrPoints = accumulatePoints(card, 0);
    createCard(card, 0);

    if (plyrPoints > 21) {
      disabledButtons(true);
      pcTurn(plyrPoints);
    } else if (plyrPoints === 21) {
      disabledButtons(true);
      pcTurn(plyrPoints);
    }
  });

  btnStop.addEventListener("click", () => {
    disabledButtons(true);
    pcTurn(playerPoints[0]);
  });

  btnReset.addEventListener("click", () => {
    initGame();
  });

  backgroundMusic.play();
  backgroundMusic.loop = true;

  initGame(2);
})();
