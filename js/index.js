// Game Constants & Variables
let direction = {x: 0, y: 0};
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const backgroundMusic = new Audio('music/music.mp3');
let gameSpeed = 19;
let gameScore = 0;
let lastUpdateTime = 0;
let snake = [{x: 13, y: 15}];
let food = {x: 6, y: 7};

// Game Functions
function main(currentTime) {
    window.requestAnimationFrame(main);
    if((currentTime - lastUpdateTime)/1000 < 1/gameSpeed) return;
    lastUpdateTime = currentTime;
    updateGame();
}

function checkCollision(snake) {
    for (let i = 1; i < snake.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if(snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

function updateGame(){
    if(checkCollision(snake)){
        gameOverSound.play();
        backgroundMusic.pause();
        direction = {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snake = [{x: 13, y: 15}];
        backgroundMusic.play();
        gameScore = 0; 
    }

    if(snake[0].y === food.y && snake[0].x === food.x){
        foodSound.play();
        gameScore += 1;
        if(gameScore > highScoreValue){
            highScoreValue = gameScore;
            localStorage.setItem("highScore", JSON.stringify(highScoreValue));
            highScoreBox.innerHTML = "HiScore: " + highScoreValue;
        }
        scoreBox.innerHTML = "Score: " + gameScore;
        snake.unshift({x: snake[0].x + direction.x, y: snake[0].y + direction.y});
        let min = 2;
        let max = 16;
        food = {x: Math.round(min + (max - min) * Math.random()), y: Math.round(min + (max - min) * Math.random())}
    }

    for (let i = snake.length - 2; i >= 0; i--) { 
        snake[i + 1] = {...snake[i]};
    }

    snake[0].x += direction.x;
    snake[0].y += direction.y;

    board.innerHTML = "";
    snake.forEach((segment, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = segment.y;
        snakeElement.style.gridColumnStart = segment.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

// Main logic starts here
backgroundMusic.play();
let highScore = localStorage.getItem("highScore");
if(highScore === null){
    var highScoreValue = 0;
    localStorage.setItem("highScore", JSON.stringify(highScoreValue))
}
else{
    var highScoreValue = JSON.parse(highScore);
    highScoreBox.innerHTML = "HiScore: " + highScore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    direction = {x: 0, y: 1} 
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            direction.x = 0;
            direction.y = -1;
            break;

        case "ArrowDown":
            direction.x = 0;
            direction.y = 1;
            break;

        case "ArrowLeft":
            direction.x = -1;
            direction.y = 0;
            break;

        case "ArrowRight":
            direction.x = 1;
            direction.y = 0;
            break;
    }
});
