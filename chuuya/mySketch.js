var gameState = "start";//定义游戏状态
var runState;//设置跑步状态，其实就是玩家
var backR=[111,78],backG=[128,99],backB=[153,129];//背景颜色
var HPs=100;//血量
var MPs=0;//蓝条
var HPbs=100;//boss血量
var obstacles = [];//躲避物
var attacks=[];//攻击物
var collectablesX=[],collectablesY=[];//收集物坐标
var collectY=[];//判定y方向收集物生成
var boss;
var MPIsFull=false;//判定蓝条是否已满
var hat;
var bsattack;
var chuattack;
var dragon;
var dazai;
var chuDown;
var texts=[];
function preload(){
	hat=loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1907484/h4673482f6fdf4ebdd80245ebe006fcf5/hat.png');
	bsattack=loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1907484/h4673482f6fdf4ebdd80245ebe006fcf5/bsattack.png');
	dragon=loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1907484/h4673482f6fdf4ebdd80245ebe006fcf5/dragon.png');
	chuattack=loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1907484/h4673482f6fdf4ebdd80245ebe006fcf5/attack.png');
	dazai=loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1912163/h8bb62e157f8c01cf80b5128ab4e5fd43/dazai.png');
	chuDown=loadImage('https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1912163/h8bb62e157f8c01cf80b5128ab4e5fd43/down-1.png');
}

function setup() {
	createCanvas(900,500);
//加载开始界面动画
	chuuyaStart= loadAni('https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1901109/hc4056e6a61f50afeec2838e9f4420613/%E4%B8%AD%E4%B9%9F-1.png',16);
	chuuyaStart.frameDelay = 8;
//加载游戏角色
	runState = new Sprite(100,300);
	runState.addAni('attack','https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1907484/h4673482f6fdf4ebdd80245ebe006fcf5/attack-1.png',2);
	runState.addAni('run','https://openprocessing-usercontent.s3.amazonaws.com/files/user361875/visual1902486/hfc3af9207679422de0a987c0b74ccdfd/churun-1.png',4);
//在收集物数组中随机添加10个小球，小球的y位置随机生成
	for(i=0;i<10;i++){
		collectablesX[i]=random(900,1400);
		collectY[i]=random(0,1);
		if(collectY[i]>0.5){
    collectablesY[i]=190;
  }else{
		collectablesY[i]=320;
		}
	}
//加载boss及躲避物	
	boss = new Boss();
  boss.checkIfMove();
  setInterval(createObstacle, 2000); // 每2秒钟生成一个小球
//加载攻击
	setInterval(createAttack,1000);//每两秒生成攻击一次
}

function draw() {
	//根据游戏状态选择不同的游戏场景
  if(gameState==="start"){
    drawStartScreen();
  }else if(gameState ==="playing"){
    playGame();
  }else if(gameState==="win"){
    drawWinScreen();
  }else if(gameState==="lose"){
    drawLoseScreen();
  }
}

//游戏开始前页面
function drawStartScreen(){
	refresh()
  background(100);
  textSize(24);
  fill(255);
  textAlign(CENTER);
  text("Press SPACE to Start",width/2,height/2);
	animation(chuuyaStart, width/2,height/2);
	chuuyaStart.scale=0.07;//动画大小
	runState.animation.frameDelay = 10;
	runState.scale = 0.1;
	if (kb.presses('space')) {
		gameState = "playing"
	}
	runState.visible=false;
}

//绘制游戏主屏幕
function playGame(){
	clear();
	runState.visible=true;
	background(125,120,170);
	//上部背景
	noStroke();
	fill(backR[0],backG[0],backB[0]);
	rect(0,230,width,270);
	strokeWeight(16);
	stroke(backR[1],backG[1],backB[1]);
	line(0,230,width,230);
	//下部背景
	noStroke();
	fill(51,81,126);
	rect(0,375,width,125);
	strokeWeight(16);
	stroke(39,58,86);
	line(0,370,width,370);
	//UI设置
	playerHP();//血条
	playerMP();//蓝条
	bossHP();//boss血条
	//动画设置
	runState.ani='run';
  runState.animation.frameDelay = 10;
	runState.scale = 0.1;
	//玩家控制上下左右
	if(MPIsFull==false){
	if(kb.pressing('left')){
		runState.ani='run';
		runState.vel.x=-6;
		runState.vel.y=0;
		runState.mirror.x=true;
	}else if(kb.pressing('right')){
		runState.ani='run';
		runState.vel.x=6;
		runState.vel.y=0;
		runState.mirror.x=false;
	}else if(kb.presses('up')){
		runState.ani='run';
		runState.y-=135;//上移
		runState.mirror.x=false;
	}else if(kb.presses('down')){
		runState.ani='run';
		runState.y+=135;//下移
		runState.mirror.x=false;
	}else{
		runState.vel.y=0;
		runState.vel.x=0;
	}}
	if(MPIsFull==true){
			if(kb.pressing('left')){
		runState.ani='attack';
		runState.vel.x=-6;
		runState.vel.y=0;
		runState.mirror.x=false;
	}else if(kb.pressing('right')){
		runState.ani='attack';
		runState.vel.x=6;
		runState.vel.y=0;
		runState.mirror.x=false;
	}else if(kb.presses('up')){
		runState.ani='attack';
		runState.y-=135;//上移
		runState.mirror.x=false;
	}else if(kb.presses('down')){
		runState.ani='attack';
		runState.y+=135;//下移
		runState.mirror.x=false;
	}else{
		runState.ani='attack';
		runState.vel.y=0;
		runState.vel.x=0;
	}
	}
	//边界限制
	if(runState.x<40){runState.x=40;}
	if(runState.x>860){runState.x=860;}
	if(runState.y<170){runState.y=165;}
	if(runState.y>440){runState.y=435;}
	//收集物
	collecting();
	//躲避物及boss的显示与移动
	for ( i = 0; i < obstacles.length; i++) {
    obstacles[i].display();
    obstacles[i].move();
  }
  boss.display();
  boss.move();
	//攻击显示及移动
	if(MPIsFull==true){
	for(i=0;i< attacks.length;i++){
		attacks[i].display();
		attacks[i].move();
		}
	}
}

//绘制游戏胜利屏幕
texts[0]='太宰 治： 呀，中也……';
texts[1]='中原 中也： 太宰！';
texts[2]='太宰 治： 相信我所以使用了污浊吗。';
texts[3]='太宰 治： 真是让我感动啊。';
texts[4]='中原 中也： 当然相信你的啊！';
texts[5]='中原 中也： 你那个可恨的生命力和阴谋诡计！';
texts[6]='太宰 治： 让白雪公主苏醒的办法真是有点粗暴（笑）';
texts[7]='中原 中也： 啧，明明看透了我会揍你……'
texts[8]='太宰 治： （打断）辛苦你了，中也。';
texts[9]='中原 中也： ……';
texts[10]='太宰 治： 睡吧。';
texts[11]='中原中也的视线逐渐模糊，在失去意识之前，他听见太宰说——';
texts[12]='太宰 治： 醒来之后，一切就结束了。';
texts[13]='中原中也失去了意识。';
texts[14]='当中原中也醒来时，不出他所料，太宰已经不见踪影。';
texts[15]='他看向正前方，是他的帽子。';
texts[16]='中原 中也： 好歹这家伙还知道把帽子找回来。';
texts[17]='中原中也捡起帽子，向港黑的五栋大楼走去。';
texts[18]='雾散了。';
var textNum=0;
var dazaix=780;
var dazaiy=250;
var chux=100;
var chuy=250;
var chusize=10;
var dasize=100;
var hatsize=10;
var haty=250;
function drawWinScreen(){
	clear();
	runState.visible=false;
	background(100);
	imageMode(CENTER);
	image(dazai,dazaix,dazaiy,dasize,dasize);
	image(chuDown,chux,chuy,chusize,chusize);
	image(hat,450,haty,hatsize,hatsize);
	rectMode(CENTER);
	fill(30);
	noStroke();
	rect(450,400,900,200);
	fill(80);
	rect(450,400,880,180);
	textSize(18);
	fill(255);
  textAlign(LEFT);
	text(texts[textNum],50,350);
	print(dasize);
	if (mouse.presses()){
	textNum+=1;
	}
	if(textNum==0){
		chusize=10;
		chuy=400;
		dasize=400;
		dazaiy=250;
		dazaix=450;
		hatsize=10;
		haty=400;
	}else if(textNum==1){
		chusize=350;
		chuy=250;
		dasize=10;
		dazaiy=400;
		dazaix=780;
		hatsize=10;
		haty=400;
	}else if(1<textNum&&textNum<14){
		chusize=350;
		chuy=250;
		dasize=400;
		dazaiy=250;
		dazaix=780;
		hatsize=10;
		haty=400;
	}else if(textNum>=14&&textNum<18){
		chusize=10;
		chuy=450;
		dasize=10;
		dazaiy=400;
		hatsize=300;
		haty=250;
	}else if(textNum==18){
		chusize=10;
		chuy=450;
		dasize=10;
		dazaiy=400;
		hatsize=300;
		haty=250;
		text('END',800,450);
	}
}

//绘制游戏失败屏幕
function drawLoseScreen(){
	runState.x=width/2;
	runState.y=150;
	background(100);
  textSize(24);
  fill(255);
  textAlign(CENTER);
  text("You Lose the Game",width/2,height/2);
	textSize(18);
	text("You can Press Space to Start Again",width/2,300);
	if (kb.presses('space')) {
		gameState = "start";
	}

}

//玩家血条
function playerHP(){
	//外框
	textSize(16);
	noStroke();
  fill(202,206,222);
  textAlign(CENTER);
  text("HP",25,25);
	noFill();
	strokeWeight(2)
	stroke(202,206,222)
	rect(49,14,102,12);
	//血量
	fill(175,51,41);
	noStroke();
	rect(50,15,HPs,10);
	if(runState.y==435&&HPs<100){
	HPs+=0.05;//当处于最底层时回复HP值
	}
	//print(runState.y);
	for(let i=0;i<obstacles.length; i++){
		let d=dist(obstacles[i].x,boss.y,runState.x,runState.y);
		if(d<45){
			HPs-=15;
		}
		if(HPs<0){
			HPs=0;
		}
	}
	if(HPs<=0){
	gameState = "lose"
	}
}

//玩家蓝条
function playerMP(){ 
	//外框
	textSize(16);
	noStroke();
  fill(202,206,222);
  textAlign(CENTER);
  text("MP",25,50);
	noFill();
	strokeWeight(2)
	stroke(202,206,222)
	rect(49,39,102,12);
	//蓝量
	fill(22,154,198);
	noStroke();
	rect(50,40,MPs,10);
	MPs=mpCollect*10;
  if(MPs>100){
    MPs=100;
  }
	//大招
	if(MPs>=100){
		MPIsFull=true;
	}else if(MPs<=0){
		MPIsFull=false;
	}
	if(MPIsFull==true){
	//MPs-=1;
	//print(MPs);
	mpCollect-=0.02;
	}
}

//boss血量
function bossHP(){
	//外框
	textSize(16);
	noStroke();
  fill(202,206,222);
  textAlign(CENTER);
  text("HP",700,25);
	noFill();
	strokeWeight(2)
	stroke(202,206,222)
	rect(724,14,102,12);
	//血量
	fill(175,51,41);
	noStroke();
	rect(725,15,HPbs,10);
	for(i=0;i<attacks.length;i++){
		let d=dist(attacks[i].x,attacks[i].y,boss.x,boss.y);
		if(d<45){
			HPbs-=10;
		}
	}
	if(HPbs<=0){
	gameState = "win"
	}
}

//收集物
	var mpCollect=0//收集物收集数量统计
	var dCollect//距离判定
function collecting(){
	for(i=0;i<10;i++){
		imageMode(CENTER);
		image(hat,collectablesX[i],collectablesY[i],80,80);
		collectablesX[i]-=3;
		//球超过画布后刷新
		if(collectablesX[i]<-10){
			collectablesX[i]=random(900,1400);
			collectY[i]=random(0,1);
		}
  	if(collectY[i]>0.5){collectablesY[i]=190;}
  	else{collectablesY[i]=320;}
		dCollect=dist(collectablesX[i],collectablesY[i],runState.x,runState.y);
		//吃球后球刷新
		if(dCollect<40&&MPIsFull==false){
			mpCollect+=1;//统计
			collectablesX[i]=random(900,1400);
			collectY[i]=random(0,1);
		}
		if(collectY[i]>0.5){collectablesY[i]=190;}
  	else{collectablesY[i]=320;}
	}
}
	
//boss
//虽然现在boss只是一个球，但它是会改的：）
class Boss {
  constructor() {
    this.x=850;
    this.y = 190;
    this.checkDirection = true;
    this.check = false;
    this.waiting = false;
  }
	//显示：圆，坐标，颜色
  display() {
   // noStroke();
   // fill(211, 150, 123);
   // ellipse(this.x, this.y, 40);
		imageMode(CENTER);
		image(dragon,this.x,this.y,180,180);
  }
	//检测是否移动
  checkIfMove() {
    setInterval(() => {
      this.check = randomBoolean(0.5);
      this.waiting = false;
    }, 3000);
  }
	//移动方式与逻辑
  move() {
    if (this.check && !this.waiting) {
      if (this.checkDirection) {
        this.y += 5;//移速为5
        if (this.y >= 325) {
          this.checkDirection = false;
          this.waiting = true;
        }
      } else {
        this.y -= 5;
        if (this.y <= 190) {
          this.checkDirection = true;
          this.waiting = true;
        }
      }
    } else {
      // 如果不移动，则将 waiting 属性设为 true
      this.waiting = true;
    }
  }
}

//创建玩家攻击集合
class Attack{
	constructor(speed){
		this.x=runState.x;
		this.y=runState.y;
		this.speed=speed;
		this.dist=100;
	}
	display(){
		imageMode(CENTER);
		image(chuattack,this.x,this.y,140,140);
	//	fill(172,188,138);
	//	ellipse(this.x,this.y, 20);
	}
	move(){
		this.x += this.speed;
		this.dist=dist(this.x,this.y,boss.x,boss.y);
		if (this.x >900||this.dist< 40) {
      // 攻击离开画布或触碰boss后从数组中移除
      let index = attacks.indexOf(this);
      attacks.splice(index, 1);
    }
	}
}
//生成多个攻击物
function createAttack() {
  let attack = new Attack(10);
  attacks.push(attack);
}

//生成多个躲避物
function createObstacle() {
  let obstacle = new Obstacle(5);
  obstacles.push(obstacle);
}

//创建躲避物集合
class Obstacle {
  constructor(speed) {
    this.x=850;
    this.speed = speed;
		this.dist=100;
  }
	//躲避物显示：x坐标，boss的y坐标，圆
  display() {
  //  fill(0);
  //  noStroke();
  //  ellipse(this.x, boss.y, 20);
		imageMode(CENTER);
		image(bsattack,this.x, boss.y,120,120);
  }
  move() {
    this.x -= this.speed;
		this.dist=dist(this.x,boss.y,runState.x,runState.y)
    if (this.x < 0||this.dist< 40) {
      // 躲避物离开画布或触碰角色后后从数组中移除
      let index = obstacles.indexOf(this);
      obstacles.splice(index, 1);
    }
  }
}

//相当于random(true,false),threshold:出现两个值的比例
function randomBoolean(threshold) {
  return random(0, 1) < threshold;
}

//重置状态
function refresh(){
	HPs=100;//血量
	MPs=0;//蓝条
	HPbs=100;//boss血量
	MPIsFull=false;//判定蓝条是否已满
	mpCollect=0//收集物收集数量统计
	//玩家初始位置
	runState.x=100;
	runState.y=300;
	
}
