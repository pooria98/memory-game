const BASE = import.meta.env.BASE_URL;

const card = (name: string) => ({ name, img: `${BASE}images/${name}.svg` });

const easy = [
  "cherry",
  "banana",
  "kiwi",
  "pineapple",
  "raspberry",
  "watermelon",
];
const normal = [...easy, "beet", "pear"];
const hard = [...normal, "cucumber", "pomegranate"];

export const difficulties = [
  { diffuculty: "easy", board: "board-4x", cards: easy.map(card) },
  { diffuculty: "normal", board: "board-4x", cards: normal.map(card) },
  { diffuculty: "hard", board: "board-5x", cards: hard.map(card) },
];
