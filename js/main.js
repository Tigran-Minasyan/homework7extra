const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const rand = function(num){
    return Math.floor(Math.random() * num) + 1;
}
const randSign = function(){
    const a = rand(2);
    if(a === 1){
        return -1;
    } else {
        return 1;
    }
}

const barImg1 = new Image();
barImg1.src = 'js/images/bar1.png';
const barImg2 = new Image();
barImg2.src = 'js/images/bar2.png';
const ballImg = new Image();
ballImg.src = 'js/images/ball.png';
const hitSound1 = new Audio('js/sounds/hit1.wav');
const hitSound2 = new Audio('js/sounds/hit2.wav');
const scoreSound = new Audio('js/sounds/score.wav');
const wallHit = new Audio('js/sounds/wallHit.wav');

const wKey = 87;
const sKey = 83;
const upArrow = 38;
const downArrow = 40;
const spaceKey = 32;

const gameData = {
    player1: {
        x: 0,
        y: 0,
        w: 10,
        h: 150,
        up: false,
        down: false,
    },
    player2: {
        x: 1290,
        y: 0,
        w: 10,
        h: 150,
        up: false,
        down: false,
    },
    ball: {
        x: 650,
        y: 300,
        w: 10,
        h: 10,
        xDelta: 8*randSign(),
        yDelta: (rand(5)+5)*randSign()
    },
    score1: 0,
    score2: 0,
    gameStarted: false,
    isScore: false
};

const player1 = gameData.player1;
const player2 = gameData.player2;
const ball = gameData.ball;
context.font = '100px Arial';
context.fillStyle = 'yellow';

const ballMovement = function(){

    ball.x += ball.xDelta;
    ball.y += ball.yDelta;

    if(ball.y <= 0){
        ball.yDelta = -ball.yDelta;
        wallHit.play();
    }
    if(ball.y >= canvas.height - ball.h){
        ball.yDelta = -ball.yDelta;
        wallHit.play();
    }

    if(ball.x < player2.x + player2.w && ball.x + ball.w > player2.x && 
       ball.y < player2.y + player2.h && ball.y + ball.h > player2.y){
            ball.x = canvas.width - 11 - ball.w;
            ball.xDelta++;
            ball.xDelta = -ball.xDelta;
            hitSound2.play();
    }
    if(ball.x < player1.x + player1.w && ball.x + ball.w > player1.x && 
       ball.y < player1.y + player1.h && ball.y + ball.h > player1.y){
            ball.x = 11;
            ball.xDelta--;
            ball.xDelta = -ball.xDelta;
            hitSound1.play();
    }
    if(ball.xDelta >= 25){
        ball.xDelta = 24;
    }

    if(ball.x>canvas.width && gameData.isScore === false){
        gameData.isScore = true;
        gameData.score1++;
        scoreSound.play();
        ball.yDelta = 0;
        setTimeout(restart,1000)
    }
    if(ball.x < -ball.h && gameData.isScore === false){
        gameData.isScore = true;
        gameData.score2++;
        scoreSound.play();
        ball.yDelta = 0;
        setTimeout(restart,1000)
    }
}

const restart = function(){
    gameData.isScore = false;
    ball.x = 650;
    ball.y = 300;
    ball.xDelta = 8*randSign();
    ball.yDelta = (rand(5)+5)*randSign();
}

const update = function(){

    if(player1.up === true){
    	player1.y -= 10;
	}else if(player1.down === true){
		player1.y += 10;
	}
    
    if(player2.up === true){
    	player2.y -= 10;
	}else if(player2.down === true){
		player2.y += 10;
	}

    if(player1.y<0){
        player1.y += 10;
    }
    if(player1.y>canvas.height-player1.h){
        player1.y -= 10;
    }
    if(player2.y<0){
        player2.y += 10;
    }
    if(player2.y>canvas.height-player2.h){
        player2.y -= 10;
    }

    ballMovement();
}

const draw = function(){

    context.clearRect(0,0,canvas.width,canvas.height);
    context.strokeStyle = 'yellow';
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(canvas.width/2,0);
    context.lineTo(canvas.width/2,canvas.height);
    context.stroke();
    context.drawImage(barImg1, player1.x, player1.y, player1.w, player1.h);
    context.drawImage(barImg2, player2.x, player2.y, player2.w, player2.h);
    context.drawImage(ballImg, ball.x, ball.y, ball.w, ball.h);

    context.fillStyle = 'red';
    if(gameData.score1<10){
        context.fillText(gameData.score1,550,80,1000);
    } else {
        context.fillText(gameData.score1,500,80,1000);
    }
    context.fillStyle = 'blue';
    context.fillText(gameData.score2,700,80,1000);

    update();
    requestAnimationFrame(draw)
};

context.fillText('PRESS SPACE TO START', 50, 325);

document.addEventListener('keydown', function(event){

    if(event.keyCode === wKey){
        player1.up = true;
    }
    if(event.keyCode === sKey){
        player1.down = true;
    }
    if(event.keyCode === upArrow){
        player2.up = true;
    }
    if(event.keyCode === downArrow){
        player2.down = true;
    }
    if(event.keyCode === spaceKey && gameData.gameStarted === false){
        gameData.gameStarted = true;
        draw();
    }
})
document.addEventListener('keyup', function(event){

    if(event.keyCode === wKey){
        player1.up = false;
    }
    if(event.keyCode === sKey){
        player1.down = false;
    }
    if(event.keyCode === upArrow){
        player2.up = false;
    }
    if(event.keyCode === downArrow){
        player2.down = false;
    }
})