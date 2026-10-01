import gsap from "gsap";
import { difficulties } from "./difficulties";

const mainMenu = document.querySelector(".main-menu") as HTMLDivElement;
const homeIcon = document.querySelector(".home") as SVGElement;
const winMenu = document.querySelector(".win-menu") as HTMLDivElement;
const winMessageEl = document.querySelector(
  ".win-message",
) as HTMLParagraphElement;
const playAgainBtn = document.querySelector(
  ".play-again-btn",
) as HTMLButtonElement;

mainMenu?.addEventListener("click", (e) => {
  if (e.target instanceof HTMLButtonElement) {
    resetGame();
    generateBoard(e.target.id);
    mainMenu.style.display = "none";
    homeIcon.style.visibility = "visible";
    winMenu.style.display = "none";
  }
});

homeIcon.addEventListener("click", () => {
  resetGame();
  mainMenu.style.display = "flex";
  homeIcon.style.visibility = "hidden";
});

let cards = [];
let firstCard: HTMLDivElement | undefined;
let secondCard: HTMLDivElement | undefined;
let isBoardLocked = false;
let moves = 0;

function resetGame() {
  const boardEl = document.querySelector(".board") as HTMLDivElement;
  const movesEl = document.querySelector(".moves") as HTMLDivElement;
  if (boardEl) boardEl.remove();
  if (movesEl) movesEl.remove();
  cards = [];
  firstCard = undefined;
  secondCard = undefined;
  isBoardLocked = false;
  moves = 0;
}

function shuffle(array: Array<any>) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function generateBoard(difficulty: string) {
  const selectedDifficulty = difficulties.find(
    (item) => item.diffuculty === difficulty,
  );

  if (!selectedDifficulty) return;

  cards = [...selectedDifficulty.cards, ...selectedDifficulty.cards];
  cards = shuffle(cards);

  const boardElement = document.createElement("div");
  boardElement.classList.add("board", selectedDifficulty.board);

  const movesElement = document.createElement("p");
  movesElement.classList.add("moves");
  movesElement.textContent = `Moves: ${moves}`;
  document.body.appendChild(movesElement);

  // temp
  document.body.appendChild(boardElement);

  cards.forEach((card) => {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img src="${card.img}" alt="${card.name}" />
      </div>
      <div class="back"></div>
    `;
    boardElement.appendChild(cardElement);
    cardElement.addEventListener("click", () =>
      handleCardClick(cardElement, movesElement),
    );
  });
}

function handleCardClick(
  cardElement: HTMLDivElement,
  movesElement: HTMLParagraphElement,
) {
  if (isBoardLocked) return;

  if (cardElement === firstCard) return;

  if (!firstCard) {
    firstCard = cardElement;
    gsap.to(firstCard, {
      duration: 0.5,
      rotationY: 180,
    });
    return;
  }

  isBoardLocked = true;
  secondCard = cardElement;
  gsap.to(secondCard, { duration: 0.5, rotationY: 180 });
  moves++;
  movesElement.textContent = `Moves: ${moves}`;

  if (firstCard.dataset.name === secondCard.dataset.name) {
    const matchedCards = document.querySelectorAll(
      `.card[data-name="${firstCard.dataset.name}"]`,
    );
    matchedCards.forEach((card) => {
      card.setAttribute("data-solved", "true");
    });

    firstCard = undefined;
    secondCard = undefined;
    isBoardLocked = false;

    if (
      document.querySelectorAll(".card[data-solved='true']").length ===
      cards.length
    ) {
      winMenu.style.display = "flex";
      winMessageEl.textContent = `You won in ${moves} moves!`;
      playAgainBtn.addEventListener("click", () => {
        winMenu.style.display = "none";
        mainMenu.style.display = "flex";
        homeIcon.style.visibility = "hidden";
        resetGame();
      });
    }
  } else {
    gsap
      .timeline({
        delay: 1,
        onComplete: () => {
          firstCard = undefined;
          secondCard = undefined;
          isBoardLocked = false;
        },
      })
      .to(firstCard, { duration: 0.5, rotationY: 0 })
      .to(secondCard, { duration: 0.5, rotationY: 0 }, "<");
  }
}

// generateBoard("easy");
