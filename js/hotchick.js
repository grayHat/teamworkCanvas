var gameStartTime=Date.now();
var lastMoved = gameStartTime;
var lastSpawn = gameStartTime;
var paused=false;
var level= 3000;  //na kolko vreme da spawnva monstercheta
var distance=0; //razstoqnieto m/u monster i hero
var isButtonPressed=false;//za tupata kosa

//===============================================================================================

var canvasBG=document.getElementById('canvasBg');
ctxBg=canvasBg.getContext('2d');
bgX=0;

//==============================================================================================

var canvasMONSTERS=document.getElementById('canvasMonsters');   
var ctxMon=canvasMONSTERS.getContext('2d');

//=============================================================================================

var canvasEND=document.getElementById('canvasEND');   
var ctxEND=canvasEND.getContext('2d');
ctxEND.font = "bold 40px Verdana";

//=============================================================================================

var canvasHero=document.getElementById('canvasHero');   //the HERO
var ctxHero=canvasHero.getContext('2d');

//=============================================================================================

var bgImage=new Image();
bgImage.src='images/background1.jpg';
var bgImage2=new Image();
bgImage2.src='images/background2.jpg';
var bgImage3=new Image();
bgImage3.src='images/background3.jpg';
var heroLeft=new Image();
heroLeft.src='images/characterLeft.png';
var heroRight=new Image();
heroRight.src='images/characterRight.png';
var heroStand=new Image();
heroStand.src='images/characterStand.png';
var heroImage=heroStand;
var monsterImage=new Image();
monsterImage.src='images/monster.png';
var fireballImage=new Image();
fireballImage.src='images/fireball.png';
var mercylessPrince = new Image();
mercylessPrince.src = 'images/gay1.png';
//var darkSideOfTheForce = new Image();
//darkSideOfTheForce = 'images/deamons.png';

var Chick=new hero();

//main

var main = function(){
	var now = Date.now();
	var delta = now - then;
	if(paused!=true){
		enemyFunctions(now);
		Chick.draw();
		deleteBullets();
		drawBullets();
		update(delta / 1000);
		ctxBg.drawImage(bgImage,bgX,0,2716,679);
		Chick.hair();
		checkForWinner();
	}

	then = now;
};

var then = Date.now();
setInterval(main, 1); // Execute as fast as possible

//PLAYER

function hero(){
	this.x=20;     //start position X
	this.y=500;	//start position Y
	this.positionCenterX=this.x+50;
	this.positionCenterY=this.y+75;
	this.speed= 250;   //hero speed
	this.isGrounded =  true;
	this.isJumping  =  false;
	this.isFalling  = false;
	this.gravityLevel = 0.97;   //0.95
	this.jumpSpeed =  4;
	this.fallingSpeed =  this.jumpSpeed;
	this.hair=function()
	{
		var timeNow=Date.now();
		timeFromLastMove=timeNow-lastMoved;
		if(timeFromLastMove>500) 
			heroImage=heroStand;
	}
	this.draw=function()
	{
		ctxHero.clearRect(0, 0, 900, 679);
		ctxHero.drawImage(heroImage, this.x, this.y,100,150);
	};
}

 //Bullets object 
 
var bullets = [2];
function Bullet(x,y) {  
    this.X = x;
    this.Y = y;
    this.speed=7; //3
}
function drawBullets(){
    for(var i=0;i<bullets.length;i++){
		ctxHero.drawImage(fireballImage,bullets[i].X,bullets[i].Y,30,30); 
		bullets[i].X+=bullets[i].speed;
		for(var p=0;p<enemies.length;p++){
			if(Math.sqrt(Math.pow(enemies[p].positionCenterY-bullets[i].Y,2)
			+Math.pow(enemies[p].positionCenterX-(bullets[i].X-bgX),2))<30){
				enemies.splice(p,1);
				bullets.splice(i,2);
			}
		}
    }
}
function fireBullets(){

    bullets[bullets.length] = new Bullet(Chick.positionCenterX,Chick.positionCenterY);
}
function deleteBullets(){
    for(var i=0;i<bullets.length;i++)
        if(bullets[i].X>900)
            bullets.splice(i,1);
}
 
// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) 
			{
				keysDown[e.keyCode] = true;
				isButtonPressed=true;
				lastMoved=Date.now();
				e.preventDefault();
			}
			, false);


addEventListener("keyup", function (e) 
			{
				isButtonPressed=false;
				delete keysDown[e.keyCode];
				e.preventDefault();
			}
			, false);


function update(modifier) {
        
        if(32 in keysDown && bullets.length<2){  //Chick firing
            fireBullets();
        }

        if (39 in keysDown) { // Player holding right
            if(Chick.x<784)
				if(Chick.x<=400||bgX<-1760)
					Chick.x += Chick.speed * modifier;
				else
					bgX-=Chick.speed * modifier;
					
				heroImage=heroRight;
        }
        else if (37 in keysDown) { // Player holding left
			Chick.x -= Chick.speed * modifier;
			
			if(Chick.x<5)
				Chick.x=5;
				
			heroImage=heroLeft;
        }
       //Player JUMPING----------------------------
        if(38 in keysDown){  
			if(Chick.isJumping!=true&&Chick.isFalling!=true){   
				Chick.isJumping=true;
				Chick.isGrounded=false;
			}
        }
        
        if(Chick.isJumping==true){
            Chick.y-=Chick.jumpSpeed;
            if(Chick.y < 370){
                Chick.isJumping=false;
                Chick.isFalling=true;
            }
        }
        
        else if(Chick.isFalling==true){
            Chick.y+=Chick.fallingSpeed;
            if(Chick.y > 500){
                Chick.isFalling=false;
                Chick.isGrounded=true;
            }
        }
        else if(Chick.isGrounded=true){
            Chick.y=500;
            Chick.isGrounded=false;
        }
        
        //Player jumped----------------------------

Chick.positionCenterX=Chick.x+50;
Chick.positionCenterY=Chick.y+75;
        
}

//ENEMY 

var enemies = [];
	//Enemy object
function enemy()
{
	this.x=0;    // X will be randomly chosen
	this.y=0;   //Y will be randomly chosen
	this.positionCenterX=0;
	this.positionCenterY=0;
	this.speed=1;
	this.isGrounded =  false;
	this.isJumping  =  false;
	this.isFalling  = true;
	this.gravityLevel = 0.97;   //0.95
	this.jumpSpeed =  3;
	this.fallingSpeed =  1.2;
	this.draw=function()
	{
		ctxMon.drawImage(monsterImage,this.x+bgX, this.y,50,50);
	}
}

function enemyFunctions(TimeNow){                //main enemy function
	ctxMon.clearRect(0, 0, 2800, 679);
	enemyJumping();
	drawEnemies();
	checkForKill()
if(TimeNow-lastSpawn>=level&&enemies.length<10)
	{spawnEnemy();
		lastSpawn=Date.now();
	}
}


function enemyJumping(){
	for(var i=0;i<enemies.length;i++){
		if(enemies[i].isJumping==true){
            enemies[i].y-=enemies[i].jumpSpeed;
            enemies[i].jumpSpeed=enemies[i].jumpSpeed*enemies[i].gravityLevel;
            if(enemies[i].jumpSpeed<1.3){
                enemies[i].jumpSpeed=5;
                enemies[i].isJumping=false;
                enemies[i].isFalling=true;
            }
        }
        else if(enemies[i].isFalling==true){
            enemies[i].y+=enemies[i].fallingSpeed;
            enemies[i].fallingSpeed=enemies[i].fallingSpeed*(2-enemies[i].gravityLevel);
            if(enemies[i].fallingSpeed>5){
                enemies[i].fallingSpeed=1.3;
                enemies[i].isFalling=false;
                enemies[i].isGrounded=true;
            }
        }
        else if(enemies[i].isGrounded=true){
            enemies[i].y=610;
            enemies[i].isGrounded=false;
            enemies[i].isJumping=true;
        }
        enemies[i].x-=enemies[i].speed ;
              
		enemies[i].positionCenterX=enemies[i].x+25;
		enemies[i].positionCenterY=enemies[i].y+25;
	}
}

function spawnEnemy(){
	enemies[enemies.length] = new enemy();
	enemies[enemies.length-1].x=2000+Math.random()*400; 
	enemies[enemies.length-1].y=(Math.random()*40)|0+550;
	
}

function drawEnemies(){
	for(var i=0;i<enemies.length;i++)
		enemies[i].draw();
}

function checkForKill(){
	for(var i=0;i<enemies.length;i++)                         
	{
		distance=Math.sqrt(Math.pow(enemies[i].positionCenterY-Chick.positionCenterY,2)
						  +Math.pow(enemies[i].positionCenterX-Chick.positionCenterX-Math.abs(bgX),2));
		if(distance<50)
			gameOver();
	}
}

function gameOver(){
	ctxEND.fillText("Game Over... Sucker (:", 200, 300);
	document.getElementById("restart").setAttribute("style", "display: block;");
	paused = true;
	bgImage.src='images/background1.jpg';
}

function checkForWinner(){
	if(Chick.x>700){
		paused = true;
		
		if(bgImage.src == bgImage2.src)
		{
			reload(bgImage3);
		}
		else if(bgImage.src == bgImage3.src)
		{
			ctxEND.clearRect(0, 0, 900, 650);
			ctxEND.drawImage(mercylessPrince, 0, 0, 900, 679);
			ctxEND.fillText("You saved me <3", 270, 300);
			ctxEND.fillText("Your reward is a kiss :* ", 217, 460);
			document.getElementById("restart").setAttribute("style", "display: block;");
		}
		else
		{
			reload(bgImage2);
		}
	}
}

function reload(img)
{
	if(img == bgImage2)
	{
		bgImage = bgImage2;
		level = 1000;
	}
	else if(img == bgImage3)
	{
		bgImage = bgImage3;
		level = 600;
	}
	else
	{
		bgImage.src='images/background1.jpg';
	}
	
	enemies.splice(0, enemies.length);
	Chick = new hero();
	bgX = 0;
	paused=false;
	distance=0; 
	isButtonPressed=false;
	ctxHero.clearRect(0, 0, 900, 679);
	ctxEND.clearRect(0, 0, 900, 679);
	ctxMon.clearRect(0, 0, 2800, 679);
	document.getElementById("restart").setAttribute("style", "display: none;");
}
