const container = document.querySelector(".container")
const ground = document.querySelector(".ground")
const sky = document.querySelector(".sky")
const skyPipe = document.querySelector(".sky-pipe")
const groundPipe = document.querySelector(".ground-pipe")
const bird = document.querySelector(".bird")
const popup = document.querySelector(".popup")
const scoreDisplay = document.querySelector(".score-display")

let timerId = null
let collisionId = null
let animationId = null
let scoreId = null
let displayId = null
let pipePassed = false;

let flappyBottom = 100
let flappyLeft = 10
let gravity = 2
let score = 0;

const maxHeight = 600
const minHeight = 30

function createAnimations() {
    ground.style.animation = "move-ground 4s linear infinite"
    groundPipe.style.animation = "pipe-ground 3s linear infinite"
    sky.style.animation = "move-sky 4s linear infinite"
    skyPipe.style.animation = "pipe-sky 3s linear infinite"
}


function hidePopup() {
    popup.classList.add("hidden")
}

function enableGame(e) {
    if(e.code === "Space") {
        hidePopup();
        createAnimations();
        pipeAnimation();
        timerId = setInterval(updateFlappyPosition, 20)
        document.removeEventListener("keydown", enableGame)
        clickToJump();
        checkCollision();
        scoreId = setInterval(updateScore, 100)
        displayId = setInterval(updateScoreDisplay, 100)
    } else {
        return
    }
}

function startGame() {
    document.addEventListener("keydown", enableGame)


}

 
function updateFlappyPosition() {
    // Decrease the bird's height by 2 pixels every second (20 milliseconds)
    flappyBottom -= gravity;

    if(flappyBottom > maxHeight) {
        flappyBottom = maxHeight;
    } else if (flappyBottom < minHeight) {
        flappyBottom = minHeight
    }

    bird.style.bottom = flappyBottom + "px";
}


function alternatePipeLength() {
  // Generate a random number between 1 and 3
    const length = Math.floor(Math.random() * 3) + 1;
    console.log(length)

    if(length === 1) {
        skyPipe.style.height = "300px";
        groundPipe.style.height = "150px"
    } else if (length === 2) {
        skyPipe.style.height = "220px";
        groundPipe.style.height = "160px"
    } else if(length === 3) {
        skyPipe.style.height = "300px";
        groundPipe.style.height = "120px"
    }
}

function pipeAnimation() {
    pipeId = setInterval(alternatePipeLength, 4000)
}


function jump() {
    flappyBottom += 50;
    flappyLeft += 6;
    bird.style.bottom  = flappyBottom + "px"
    bird.style.left = flappyLeft + "px"
}


// document.addEventListener("keyup", jump)

function clickToJump() {
    document.addEventListener("click", () => {
    if(!popup.classList.contains("hidden")) {
        return
    } else {
        jump()
    }
})
}

startGame();

// collision detection

function flappyCollision() {

    const birdRect = bird.getBoundingClientRect();
    const groundPipeRect = groundPipe.getBoundingClientRect();
    const skyPipeRect = skyPipe.getBoundingClientRect();
    const groundRect = ground.getBoundingClientRect()

    const collisionWithGroundPipe = (
        birdRect.x < groundPipeRect.x + groundPipeRect.width &&
        birdRect.x + birdRect.width > groundPipeRect.x &&
        birdRect.y < groundPipeRect.y + groundPipeRect.height &&
        birdRect.y + birdRect.height > groundPipeRect.y
    );

    const collisionWithSkyPipe = (
        birdRect.x < skyPipeRect.x + skyPipeRect.width &&
        birdRect.x + birdRect.width > skyPipeRect.x &&
        birdRect.y < skyPipeRect.y + skyPipeRect.height &&
        birdRect.y + birdRect.height > skyPipeRect.y
    );

    const collisionWithGround = (
        birdRect.x < groundRect.x + groundRect.width &&
        birdRect.x + birdRect.width > groundRect.x &&
        birdRect.y < groundRect.y + groundRect.height &&
        birdRect.y + birdRect.height > groundRect.y
    )


    if (collisionWithGroundPipe || collisionWithSkyPipe || collisionWithGround) {
        console.log("collided!");
        endGame();
    }
}

function checkCollision() {
    collisionId = setInterval(flappyCollision, 40)
}

// use a flag variable to counter issue of the function running every 20 ms and 
// catching every single frame

// The pipePassed variable is initially set to false,
// which means that the bird has not passed through a pipe yet.

function updateScore() {

    const birdRect = bird.getBoundingClientRect();
    const groundPipeRect = groundPipe.getBoundingClientRect();
    const skyPipeRect = skyPipe.getBoundingClientRect();

    if(birdRect.x > skyPipeRect.x + skyPipeRect.width && birdRect.x > groundPipeRect.x + groundPipeRect.width) {

        if (!pipePassed) {
            score += 1;
            pipePassed = true;
          } 
    } else {
        pipePassed = false
    }
    }



function updateScoreDisplay() {
    scoreDisplay.innerHTML = score;
}



function restartGame() {
    popup.addEventListener("click", () => {
        console.log("popup clicked!")
        popup.textContent = "Press the Space Bar to Start!"
        // popup.classList.toggle("hidden")
        startGame();
    })
};

function endGame() {
    clearInterval(timerId);
    clearInterval(collisionId);
    clearInterval(pipeId);
    clearInterval(scoreId);
    clearInterval(displayId)


    // Reset flappyBottom and flappyLeft
    flappyBottom = 100;
    flappyLeft = 10;
    score = 0;


    // Reset the animations and position of the bird
    ground.style.animation = ""
    groundPipe.style.animation = ""
    sky.style.animation = ""
    skyPipe.style.animation = ""
    bird.style.bottom = flappyBottom + "px";
    bird.style.left = flappyLeft + "px"

    // Show the game over popup and set its text
    popup.classList.toggle("hidden")
    popup.textContent = `Game Over! Your Score is ${scoreDisplay.textContent} ! Click Here to Play Again! `

    restartGame();
}








    









