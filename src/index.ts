const wordsByCategory = {
    animais: ["cachorro", "gato", "elefante"],
    paises: ["brasil", "canada", "japao"],
    comidas: ["pizza", "sushi", "chocolate"]
};

let selectedCategory: keyof typeof wordsByCategory = "animais";
let selectedWord: string = getRandomWord(wordsByCategory[selectedCategory]);
let correctGuesses: string[] = [];
let incorrectGuesses: string[] = [];
let errorCount: number = 0;

const categorySelectElement = document.getElementById("category-select") as HTMLSelectElement;
const wordElement = document.getElementById("word") as HTMLElement;
const incorrectLettersElement = document.getElementById("wrong-letters") as HTMLElement;
const hangmanImageElement = document.getElementById("hangman") as HTMLImageElement;
const guessInputElement = document.getElementById("guess-input") as HTMLInputElement;
const guessButtonElement = document.getElementById("guess-button") as HTMLButtonElement;
const messageElement = document.getElementById("message") as HTMLElement;
const newGameButtonElement = document.getElementById("new-game-button") as HTMLButtonElement;

categorySelectElement.addEventListener("change", handleCategoryChange);
guessButtonElement.addEventListener("click", handleGuess);
newGameButtonElement.addEventListener("click", resetGame);

initializeGame();

function initializeGame() {
    displayWord();
    updateIncorrectGuesses();
    guessInputElement.value = '';
    newGameButtonElement.style.display = "none";
}

function getRandomWord(wordList: string[]): string {
    return wordList[Math.floor(Math.random() * wordList.length)];
}

function displayWord() {
    wordElement.innerHTML = selectedWord
        .split("")
        .map(letter => correctGuesses.includes(letter) ? letter : '<span class="underline-bold">_</span>')
        .join(" ");
}

function updateIncorrectGuesses() {
    incorrectLettersElement.innerHTML = incorrectGuesses.join(", ");
    hangmanImageElement.src = `assets/imagens/forca${errorCount}.jpg`;
}

function handleCategoryChange() {
    selectedCategory = categorySelectElement.value as keyof typeof wordsByCategory;
    resetGame();
}

function handleGuess() {
    const guessedLetter = guessInputElement.value.toLowerCase();

    if (!/^[a-z]$/.test(guessedLetter)) {
        showMessage("Por favor, insira uma letra válida!");
        return;
    }

    if (isAlreadyGuessed(guessedLetter)) {
        showMessage("Você já tentou essa letra!");
    } else {
        processGuess(guessedLetter);
    }

    guessInputElement.value = '';
}

function isAlreadyGuessed(letter: string): boolean {
    return correctGuesses.includes(letter) || incorrectGuesses.includes(letter);
}

function processGuess(letter: string) {
    if (selectedWord.includes(letter)) {
        correctGuesses.push(letter);
    } else {
        incorrectGuesses.push(letter);
        errorCount++;
    }

    displayWord();
    updateIncorrectGuesses();
    checkGameStatus();
}

function checkGameStatus() {
    if (isGameOver()) {
        endGame(`Você perdeu! A palavra era "${selectedWord}"`);
    } else if (isGameWon()) {
        endGame("Parabéns! Você venceu!");
    }
}

function isGameOver(): boolean {
    return errorCount >= 7;
}

function isGameWon(): boolean {
    return !wordElement.innerText.includes("_");
}

function endGame(message: string) {
    alert(message);
    newGameButtonElement.style.display = "block";
}

function showMessage(message: string) {
    messageElement.innerText = message;
    messageElement.style.display = "block";
    setTimeout(() => {
        messageElement.style.display = "none";
    }, 2000);
}

function resetGame() {
    correctGuesses = [];
    incorrectGuesses = [];
    errorCount = 0;
    selectedWord = getRandomWord(wordsByCategory[selectedCategory]);
    initializeGame();
}
