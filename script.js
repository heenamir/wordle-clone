import { WORDS } from "./words.js";

const NUMBER_OF_GUESSES = 6;
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(rightGuessString);
let charWords = rightGuessString.split('');
console.log(charWords);

let count = 1;

let board = document.getElementById("game-board");

for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    let row = document.createElement("letter-row");
    row.setAttribute("maxlength", 6);
    row.setAttribute("id", "gamerow");

    for (let j = 0; j < 5; j++) {
        let box = document.createElement('div');

        box.setAttribute("class", "tile");
        
        box.setAttribute("id", count);
        box.setAttribute("maxlength", 1);
        box.setAttribute("type", "text");
        count++;

        row.appendChild(box);
    }
    board.appendChild(row);
}

document.addEventListener('DOMContentLoaded', () => {
    const keys = document.querySelectorAll('.row button');
    let guessedWords = [[]];
    let availableSpace = 1;
    let guessedWordCount = 1;

    function getCurrentWordArr() {
        const numberOfGuessedWords = guessedWords.length;
        return guessedWords[numberOfGuessedWords - 1];
    }

    function updateGuessedWord(letter) {
        const currentWordArr = getCurrentWordArr();

        if(currentWordArr && currentWordArr.length < 5) {
            currentWordArr.push(letter);

            const availableSpaceEl = document.getElementById(String(availableSpace));
            document.getElementById(String(availableSpace)).classList.add('active');
            availableSpace = availableSpace + 1;
            availableSpaceEl.textContent = letter;
        }
    }

    function update() {
        const currentWordArr = getCurrentWordArr();
        const currentWord = currentWordArr.join('');

        if(!WORDS.includes(currentWord.toLowerCase())){
            return;
        }

        for(let c = 0; c < 5; c++) {
            let currTile = document.getElementById(String(guessedWordCount));
            let letters = currTile.innerText;
            setTimeout(() => { 
                if(charWords[c] == letters.toLowerCase()) {
                    currTile.classList.add('correct');
                }
                
                if(charWords.includes(letters.toLowerCase())){
                    currTile.classList.add('wrong-location');
                }
                else {
                    currTile.classList.add('wrong');
                }
                currTile.classList.add('animated');}, (c*365));

            currTile.classList.remove('active');
            guessedWordCount++;
        } 
    }

    function handleSubmitWord() {
        const currentWordArr = getCurrentWordArr();
        if(currentWordArr.length !== 5) {
            showAlert("Not enough letters");
            if(guessedWords.length > 6) {
                guessedWords.length = guessedWords.length - 1;
            }
            else {
                return;
            }
        }

        const currentWord = currentWordArr.join('');

        if(!WORDS.includes(currentWord.toLowerCase()) && currentWordArr.length === 5){
            showAlert("Not in word list");
            if(guessedWords.length > 1) {
                guessedWords.length = guessedWords.length - 1;
            }
            else {
                return;
            }
        }
        
        if(currentWord.toLowerCase() === rightGuessString){
            for(let i = 5; i > 0; i--) {
                let currentTile = document.getElementById(String(availableSpace - i));
                currentTile.addEventListener('animationend', () => {
                    setTimeout(() => {
                        currentTile.classList.add('win');
                    }, (i*500) / 2);
                })
            }
            setTimeout(() => { showAlert("Congratulations"); }, 2050);
            return;
        }

        if(guessedWords.length === 6){
            showAlert(rightGuessString.toUpperCase());
        }

        if(guessedWords.length % 6 !== 0) {
            guessedWords.push([]);
        }

    }

    function handleDelete() {
        const currentWordArr = getCurrentWordArr();
    
        guessedWords[guessedWords.length - 1] = currentWordArr;
    
        const lastLetterEl = document.getElementById(String(availableSpace - 1));
        if(!lastLetterEl.classList.contains('active') && 
            (availableSpace - 1 === 0 || (availableSpace - 1) % 5 === 0)) return;
    
        lastLetterEl.textContent = "";
        currentWordArr.pop(lastLetterEl.textContent);
        
        document.getElementById(String(availableSpace-1)).classList.remove('active');
        availableSpace = availableSpace - 1;
    }

    function showAlert(message, duration = 1000) {
        let alert = document.createElement("div");
        alert.textContent = message;
        alert.classList.add("alert");
        document.getElementById('alert-container').prepend(alert);
        if (duration == null) return;
        
        setTimeout(() => {
            alert.classList.add("hide")
            alert.addEventListener("transitionend", () => {
            alert.remove()
            })
        }, duration);
    }

    function updateKey() {
        let counter = guessedWordCount - 5;

        let keyboard = document.getElementsByClassName('key');
        for(var key of keyboard) {
            
            for(let l = 0; l < 5; l++) {
                let currTile = document.getElementById(String(counter + l));
                let letters = currTile.innerText;
                if(key.getAttribute('data-key') === letters.toLowerCase()) {
                    if(charWords[l] == letters.toLowerCase()) {
                        key.classList.add('correct');
                    }
                    else if(charWords.includes(letters.toLowerCase())){
                        key.classList.add('wrong-location');
                    }
                    else {
                        key.classList.add('wrong');
                    }
                }
            }            
        }
    }

    for (let i = 0; i < keys.length; i++) {
        keys[i].onclick = ({ target }) => {
            const letter = target.getAttribute("data-key");
            
            if(letter === "enter"){
                update();
                updateKey();
                handleSubmitWord();
                return;
            }

            if(letter === "backspace"){
                handleDelete();
                return;
            }

            updateGuessedWord(letter);
        }
    }

    document.addEventListener('keyup', (e) => {
        {
            let alpha = e.code;

            if (e.key === 'Enter') {
                update();
                updateKey();
                handleSubmitWord();
                return;
            }
            if(e.key === 'Backspace') {
                handleDelete();
                return;
            }
            else {
                if("KeyA" <= e.code && e.code <= "KeyZ"){
                    let part = alpha.slice(3);
                    updateGuessedWord(part);
                }
            }
        }
    });
})

