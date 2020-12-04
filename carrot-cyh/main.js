'use strict';
const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect(); // 필드의 전체적인 사이즈와 포지션까지 알 수 있다.
const gameBtn = document.querySelector(".game__button");
const gameTimer = document.querySelector(".game__timer");
const gameScore = document.querySelector(".game__score");
const CARROT_SIZE = 80;
const CARROT_COUNT = 5;
const BUG_COUNT = 5;
const GAME_DURAION_SEC = 10;
const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message")
const popUpRefresh = document.querySelector(".pop-up__refresh")

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const winSound = new Audio("./sound/game_win.mp3");
let started= false;
let score = 0;
let timer = undefined;


field.addEventListener("click",onFieldClick);
gameBtn.addEventListener("click",() =>{
    if(started){
        stopGame();
    }else{
        startGame();
    }
});
popUpRefresh.addEventListener("click", ()=>{
    startGame();
    hidePopup();
})
function startGame(){
    started = true;
    score = 0;
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
    playSound(bgSound);
}
function finishGame(win){
    started = false;
    stopGameTimer();
    hideGameButton();
    if(win){
        playSound(winSound);
    }else{
        playSound(bugSound);
    }
    showPopUpWithText(win ? "YOU WON ❤" : "YOU LOST 💨");
    stopSound(bgSound);
}
function stopGame(){
    started = false;
    stopGameTimer();
    hideGameButton();
    playSound(alertSound);
    stopSound(bgSound);
    showPopUpWithText("REPLAY❓");
}

function startGameTimer(){
    let remainingTimeSec = GAME_DURAION_SEC;
    updateTimerText(remainingTimeSec);
    timer = setInterval(() => {
        if(remainingTimeSec <= 0){
            clearInterval(timer);
            finishGame(CARROT_COUNT === score);
            return;
        }
        updateTimerText(--remainingTimeSec);
    }, 1000);
}
function stopGameTimer(){
    clearInterval(timer);
}
function updateTimerText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerText = `${minutes}:${seconds}`;
}

function hideGameButton(){
    gameBtn.style.visibility = "hidden";
}
function showTimerAndScore(){
    gameTimer.style.visibility = "visible";
    gameScore.style.visibility = "visible";
}
function showStopButton(){
    const icon = gameBtn.querySelector(".fas");
    icon.classList.add("fa-stop");
    icon.classList.remove("fa-play");
    gameBtn.style.visibility = "visible";
}
function showPopUpWithText(text){
    popUpText.innerText = text;
    popUp.classList.remove("pop-up--hide");
    
}
function hidePopup(){
    popUp.classList.add("pop-up--hide");
}
//defer를 쓰지않으면 (html script에) 스크립트가 html이 준비되기 이전에 실행이 되기 때문에 안된다. window onload리스너를 등록하던지 defer옵션을 쓰라
function initGame(){
    field.innerHTML = "";
    gameScore.innerText = CARROT_COUNT;
    //벌레와 당근을 생성 한 뒤 field에 추가해줌
    addItem('carrot',5,'img/carrot.png');
    addItem('bug',5,'img/bug.png');
}
function onFieldClick(event){
    if(!started){
        return;
    }
    const target = event.target;
    if(target.matches(".carrot")){
        //당근!!
        target.remove();
        score++;
        updateScoreBoard();
        playSound(carrotSound);
        if(score === CARROT_COUNT){
            finishGame(true);
        }
    }
    else if(target.matches(".bug")){
        //벌레!!
        stopGameTimer();
        finishGame(false);
    }
}
function playSound(sound){
    sound.play();
}
function stopSound(sound){
    sound.pause();
}
function updateScoreBoard(){
    gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className,count,imgPath){
    const x1 = 0;
    const y1 = 0;
    const x2 = fieldRect.width - CARROT_SIZE;
    const y2 = fieldRect.height - CARROT_SIZE;
    for(let i = 0; i< count; i++){
        const item = document.createElement('img');
        item.setAttribute('class',className);
        item.setAttribute('src',imgPath);
        item.style.position = 'absolute';
        const x = randomNumber(x1,x2)
        const y = randomNumber(y1,y2);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        field.appendChild(item); //gamefield에 추가된다. gamefield는 relatvie로 설정함
    }
}

function randomNumber(min,max){
    return Math.random() * (max-min) + min;
}

initGame();
