// setup canvas

var canvas = document.getElementById('background');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

var start_sound; 
var alerta_sound; 
var game_over_sound;  
var infected;


// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// define Ball constructor

function Ball(x, y, velX, velY, color, size) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.color = color;
  this.size = size;
}

// define ball draw method

Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

// define ball update method

Ball.prototype.update = function() {
  if((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
};

// define ball collision detection

Ball.prototype.collisionDetect = function() {
  for(let j = 0; j < balls.length; j++) {
    if(!(this === balls[j])) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        if (this.color == 'rgb(255,0,0)') {

            balls[j].color = this.color;
        }
       
      }
    }
  }
};

function countInfected() {
  infected = 0;
  for(let j = 0; j < balls.length; j++) {

        if  (balls[j].color == 'rgb(255,0,0)') {
            
            infected++;
        }
  }

  console.log(infected);
  if (infected == 26) {
    
    balls = [];

    gameOver();
    gameOverMessage();
    
    
  }
};

// define array to store balls and populate it

let balls = [];

while(balls.length < 25) {
  const size = random(10,20);
  let ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + size,width - size),
    random(0 + size,height - size),
    random(-7,7),
    random(-7,7),
    'rgb(255,255,255)',
    size
  );
  balls.push(ball);
}


function inciarContagio(){ 
  var virus_ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the adge of the canvas, to avoid drawing errors
    random(0 + 15,width - 15),
    random(0 + 15,height - 15),
    random(-7,7),
    random(-7,7),
    'rgb(255,0,0)',
    15
  );

balls.push(virus_ball);

alertaContagio();

}

function alertaContagio() {
    var loops = 3;
    var looped = 0;
    start_sound.stop();
    alerta_sound = soundManager.createSound({
                     id: 'alerta',
                     url: 'audios/alarma-de-evacuacin-evacuacion.mp3',
                     volume: 100,
                      onfinish:function() { 
                         if(looped<loops){
                             soundManager.play('alerta'); 
                             looped++; 
                          } else{   
                             looped = 0;
                          }
                      }
    });

    soundManager.play('alerta',{loops: 3});


  
}

function gameOver() {
    var loops = 3;
    var looped = 0;
    alerta_sound.stop();
    game_over_sound = soundManager.createSound({
                     id: 'game_over',
                     url: 'audios/game-over.mp3',
                     volume: 100,
                      onfinish:function() { 
                         if(looped<loops){
                             soundManager.play('game_over'); 
                             looped++; 
                          } else{   
                             looped = 0;
                          }
                      }
    });

    soundManager.play('game_over',{loops: 3});


  
}

function gameOverMessage() {
  var oldcanv = document.getElementById('background');
  oldcanv.style.display = 'none';

  var canv = document.getElementById('game-over-canvas');
  canv.style.display = 'block';
  canv.width = width;
  canv.height = height;

  ctx = canv.getContext('2d');

  ctx.clearRect(0, 0, width, height);
  ctx.font="30px Comic Sans MS";
  ctx.fillStyle = "red";
  ctx.textAlign = "center";
  ctx.fillText("Quédate en Casa!!!", width/2, height/2);
  ctx.font="18px Comic Sans MS";
  ctx.fillStyle = "black";
  ctx.fillText("Click para volver al menú principal", width/2, height/2+40);


  ctx.fillText("Autor", width/2, height/2+65);
  ctx.fillText("Ing. Alfredo Galano Loyola", width/2, height/2+80);
  ctx.fillText("Idea Original", width/2, height/2+100);
  ctx.fillText("Msc. Fidel Padilla Herrera", width/2, height/2+120);

  requestAnimationFrame(gameOverMessage);
}

// define loop that keeps drawing the scene constantly

function loop() {
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(0,0,width,height);
  
    

    for(let i = 0; i < balls.length; i++) {
      if (infected < 26) {
          balls[i].draw();
          balls[i].update();
          balls[i].collisionDetect();

      }
        
      


    }

      requestAnimationFrame(loop);
  
  

}

function playSimulacion(){
    var texto = document.getElementById('texto');
    texto.style.display = 'none';

    start_sound = soundManager.createSound({
      url: 'audios/mariobros.mp3'
    });  

    start_sound.play();
    loop();
    setTimeout(inciarContagio, 5000);

    setInterval(countInfected, 1000);


  
}

function stopSimulacion() {
  location.reload(); 
}
