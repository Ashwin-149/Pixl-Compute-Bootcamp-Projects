
// Create the container and input elements
const container = document.createElement("div");
container.id = "container";

const inputcontainer = document.createElement("div");
inputcontainer.id = "inputcontainer";

const heading = document.createElement("h1");
heading.textContent = "Wordle Game";

container.appendChild(heading);
container.appendChild(inputcontainer);
document.body.appendChild(container);

let input = document.createElement('input');
input.type = 'text';
input.autofocus = true;
input.maxLength = 5;
inputcontainer.appendChild(input);
input.focus();

// Create the submit button
let submitButton = document.createElement('button');
submitButton.textContent = 'Submit Guess';
inputcontainer.appendChild(submitButton); //submit button and input field are in the same container

// Apply CSS styles
submitButton.style.padding = "10px 10px";
submitButton.style.fontWeight = "bold";

document.body.style.fontFamily = "Arial";
document.body.style.backgroundColor = "#f4f4f4";

heading.style.textAlign = "center";
heading.style.fontSize = "40px";
heading.style.marginBottom = "20px";

input.style.width = "180px";

container.style.width = "800px";
container.style.padding = "20px";
container.style.margin = "50px auto";
container.style.backgroundColor = "#fff";
container.style.borderRadius = "8px";
container.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";

inputcontainer.style.display = "flex";
inputcontainer.style.justifyContent = "center";
inputcontainer.style.marginBottom = "20px";
inputcontainer.style.gap = "8px";

// Create the board for guesses(To place the Squares)
const board = document.createElement("div");
container.insertBefore(board, inputcontainer);

board.style.display = "grid";
board.style.gridTemplateColumns = "repeat(5, 60px)";
board.style.gap = "5px";
board.style.marginBottom = "10px";
board.style.justifyContent = "center";

// Create the cells for the board(squares)
const cells = [];
for (let i = 0; i < 30; i++) {
    const cell = document.createElement("div");
    board.appendChild(cell);
    cell.style.width = "60px";
    cell.style.height = "60px";
    cell.style.border = "2px solid #ccc";
    cell.style.boxSizing = "border-box";
    cell.style.display = "flex";
    cell.style.alignItems = "center";
    cell.style.justifyContent = "center";
    cell.style.fontSize = "24px";
    cell.style.fontWeight = "bold";
    cells.push(cell);
}

// Create feedback message
const feedback = document.createElement("p");
feedback.textContent = "";
container.appendChild(feedback);

feedback.style.textAlign = "center";
feedback.style.fontWeight = "bold";


//Game logic

const words = [
    "which", "there", "their", "about", "would", "these", "other", "words", "could", "write", "first", "water",
    "after", "where", "right", "think", "three", "years", "place", "sound", "great", "again", "still", "every",
    "small", "found", "those", "never", "under", "might", "while", "house", "world", "below", "asked", "going",
    "large", "until", "along", "shall", "being", "often", "earth", "began", "since", "study", "night", "light",
    "above", "paper", "parts", "young", "story", "point", "times", "heard", "whole", "white", "given", "means",
    "music", "miles", "thing", "today", "later", "using", "money", "lines", "order", "group", "among", "learn",
    "known", "space", "table", "early", "trees", "short", "hands", "state", "black", "shown", "stood", "front",
    "voice", "kinds", "makes", "comes", "close", "power", "lived", "vowel", "taken", "built", "heart", "ready",
    "quite", "class", "bring", "round", "horse", "shows", "piece", "green", "stand", "birds", "start", "river",
    "tried", "least", "field", "whose", "girls", "leave", "added", "color", "third", "hours", "moved", "plant",
    "doing", "names", "forms", "heavy", "ideas", "cried", "check", "floor", "begin", "woman", "alone", "plane",
    "spell", "watch", "carry", "wrote", "clear", "named", "books", "child", "glass", "human", "takes", "party",
    "build", "seems", "blood", "sides", "seven", "mouth", "solve", "north", "value", "death", "maybe", "happy",
    "tells", "gives", "looks", "shape", "lives", "steps", "areas", "sense", "speak", "force", "ocean", "speed",
    "women", "metal", "south", "grass", "scale", "cells", "lower", "sleep", "wrong", "pages", "ships", "needs",
    "rocks", "eight", "major", "level", "total", "ahead", "reach", "stars", "store", "sight", "terms", "catch",
    "works", "board", "cover", "songs", "equal", "stone", "waves", "guess", "dance", "spoke", "break", "cause",
    "radio", "weeks", "lands", "basic", "liked", "trade", "fresh", "final", "fight", "meant", "drive", "spent",
    "local", "waxes", "knows", "train", "bread", "homes", "teeth", "coast", "thick", "brown", "clean", "quiet",
    "sugar", "facts", "steel", "forth", "rules", "notes", "units", "peace", "month", "verbs", "seeds", "helps",
    "sharp", "visit", "woods", "chief", "walls", "cross", "wings", "grown", "cases", "foods", "crops", "fruit",
    "stick", "wants", "stage", "sheep", "nouns", "plain", "drink", "bones", "apart", "turns", "moves", "touch",
    "angle", "based", "range", "marks", "tired", "older", "farms", "spend", "shoes", "goods", "chair", "twice",
    "cents", "empty", "alike", "style", "broke", "pairs", "count", "enjoy", "score", "shore", "roots", "paint",
    "heads", "shook", "serve", "angry", "crowd", "wheel", "quick", "dress", "share", "alive", "noise", "solid",
    "cloth", "signs", "hills", "types", "drawn", "worth", "truck", "piano", "upper", "loved", "usual", "faces",
    "drove", "cabin", "boats", "towns", "proud", "court", "model", "prime", "fifty", "plans", "yards", "prove",
    "tools", "price", "sheet", "smell", "boxes", "raise", "match", "truth", "roads", "threw", "enemy", "lunch",
    "chart", "scene", "graph", "doubt", "guide", "winds", "block", "grain", "smoke", "mixed", "games", "wagon",
    "sweet", "topic", "extra", "plate", "title", "knife", "fence", "falls", "cloud", "wheat", "plays", "enter",
    "broad", "steam", "atoms", "press", "lying", "basis", "clock", "taste", "grows", "thank", "storm", "agree",
    "brain", "track", "smile", "funny", "beach", "stock", "hurry", "saved", "sorry", "giant", "trail", "offer",
    "ought", "rough", "daily", "avoid", "keeps", "throw", "allow", "cream", "laugh", "edges", "teach", "frame",
    "bells", "dream", "magic", "occur", "ended", "chord", "false", "skill", "holes", "dozen", "brave", "apple",
    "climb", "outer", "pitch", "ruler", "holds", "fixed", "costs", "calls", "blank", "staff", "labor", "eaten",
    "youth", "tones", "honor", "globe", "gases", "doors", "poles", "loose", "apply", "tears", "exact", "brush",
    "chest", "layer", "whale", "minor", "faith", "tests", "judge", "items", "worry", "waste", "hoped", "strip",
    "begun", "aside", "lakes", "bound", "depth", "candy", "event", "worse", "aware", "shell", "rooms", "ranch",
    "image", "snake", "aloud", "dried", "likes", "motor", "pound", "knees", "refer", "fully", "chain", "shirt",
    "flour", "drops", "spite", "orbit", "banks", "shoot", "curve", "tribe", "tight", "blind", "slept", "shade",
    "claim", "flies", "theme", "queen", "fifth", "union", "hence", "straw", "entry", "issue", "birth", "feels",
    "anger", "brief", "rhyme", "glory", "guard", "flows", "flesh", "owned", "trick", "yours", "sizes", "noted",
    "width", "burst", "route", "lungs", "uncle", "bears", "royal", "kings", "forty", "trial", "cards", "brass",
    "opera", "chose", "owner", "vapor", "beats", "mouse", "tough", "wires", "meter", "tower", "finds", "inner",
    "stuck", "arrow", "poems", "label", "swing", "solar", "truly", "tense", "beans", "split", "rises", "weigh",
    "hotel", "stems", "pride", "swung", "grade", "digit", "badly", "boots", "pilot", "sales", "swept", "lucky",
    "prize", "stove", "tubes", "acres", "wound", "steep", "slide", "trunk", "error", "porch", "slave", "exist",
    "faced", "mines", "marry", "juice", "raced", "waved", "goose", "trust", "fewer", "favor", "mills", "views",
    "joint", "eager", "spots", "blend", "rings", "adult", "index", "nails", "horns", "balls", "flame", "rates",
    "drill", "trace", "skins", "waxed", "seats", "stuff", "ratio", "minds", "silly", "coins", "hello", "trips"]

// Function to get a random word from the list
const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

const targetWord = getRandomWord();
let currentRow = 0; //shows the current row of guesses (0-5)


// Event listener for the submit button
submitButton.addEventListener("click", () => {
    const guess = input.value.toLowerCase();

    // Check the guess length
    if(guess.length !== 5) {
        feedback.textContent = "Please enter a 5-letter word.";
        feedback.style.color = "red";
        return;
    }else{
        feedback.textContent = "";
        feedback.style.color = "black";
    }

    // place the letters in boxes
    [...guess].forEach((letter, i) => {
        cells[currentRow * 5 + i].textContent = letter.toUpperCase();
    });

    // Check the guess against the target word and color the cells accordingly
    const remainingLetters = [...targetWord];

    //checking for green
    [...guess].forEach((letter, i) => {
        const cell = cells[currentRow * 5 + i];

        if (letter === targetWord[i]) {
            cell.style.backgroundColor = "green";
            cell.style.color = "white";

            // This occurrence has been used
            remainingLetters[i] = null;
        }
    });

    //checking for yellow and grey
    [...guess].forEach((letter, i) => {
        const cell = cells[currentRow * 5 + i];

        
        if (letter === targetWord[i]) {
            return;
        }

        const matchIndex = remainingLetters.indexOf(letter);

        if (matchIndex !== -1) {
            
            cell.style.backgroundColor = "yellow";
            cell.style.color = "black";

            
            remainingLetters[matchIndex] = null;
        } else {
            
            cell.style.backgroundColor = "grey";
            cell.style.color = "white";
        }
    });

    currentRow++;

    // Check if the guess is correct or if the game is over
    if(guess === targetWord) {
        feedback.textContent = "Congratulations! You guessed the word!";
        feedback.style.color = "green";
        input.disabled = true;
        input.value = "";
        submitButton.disabled = true;
    }else if(currentRow === 6) {
        feedback.textContent = `Game Over! The word was: ${targetWord.toUpperCase()}`;
        feedback.style.color = "red";
        input.disabled = true;
        submitButton.disabled = true;
    }

    input.value = ""; // Clear the input field for the next guess
    input.focus();

});

//To prevent numbers from being entered in the input field
input.addEventListener("input", () => {
    input.value = input.value.replace(/[0-9]/g, "");
});

// Allow pressing Enter key to submit the guess
input.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        submitButton.click();
    }
});



