angular.module('starter')
.service('canvas', function() {
	 
	 var scope = this;
	 var canvas = null;
	 var canvasWidth=900;
     var canvasHeight=600;
   	 var blocksize=30;
     var ctx;
     var delay=100;
 
     var widthInBlocks=canvasWidth/blocksize;
     var heightInBlocks=canvasHeight/blocksize;
     
	 
	scope.init = function () {
	 
	/*Canvas permet de desiner*/
    var canvas = document.createElement("canvas");
    canvas.width=canvasWidth;
    canvas.height=canvasHeight;
        
    /*Desin du convas*/
   // canvas.style.border="5px solid #1d1f22";
    canvas.style.display="block";
    canvas.style.backgroundColor="#37474f";

       
    
    
    document.getElementById("canvas").appendChild(canvas);
    
    /*pour desidner on va utilier le contexte*/
    ctx=canvas.getContext('2d');
    snakee= new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4],[0,4]],"right");
    applee= new Apple([10,4]);   
    score=0;
    scope.refreshCanvas();
            
		 
	 }
	 scope.refreshCanvas = function () {
	 	 snakee.advance();
        if(snakee.checkCollision()){
            //GameOver
            scope.gameOver();
        }
        else{
            if(snakee.isEatingApple(applee)){
                score++;
                snakee.ateApple=true;
                
                do{
                    applee.setNewPosition();
                }while(applee.isOnSnake(snakee));
                
            }            
             ctx.clearRect(0,0,canvasWidth,canvasHeight); 
             snakee.draw();
             applee.draw();
             
            /*supprimer le snake chaque fois*/
            setTimeout(scope.refreshCanvas,delay);
             /*Executer une action chaque fois qu'un delais est depasé*/
        }
    
    		scope.drawScore();
    }

    scope.gameOver=function(){
        
        var fontFamily = ' "Merriweather Sans", sans-serif';
    	ctx.save();
        ctx.font="30px"+fontFamily;
        ctx.fillStyle = '#fff';
        //ctx.fillText("Game Over",canvasWidth*0.3, canvasHeight*0.3);
        ctx.fillText("Appuyer sur la touche espace pour rejouer",canvasWidth*0.2, canvasHeight*0.5);
        ctx.restore();
    
    }

    scope.restart=function(){
    	snakee=new Snake([[6,4],[5,4],[4,4],[3,4],[2,4],[1,4],[0,4]],"right");
        applee= new Apple([10,10]); 
        score=0;
        scope.refreshCanvas();
    }

    scope.drawScore=function(){
        var scoreFont = ' Verdana, Geneva, sans-serif';
    	ctx.save();
        ctx.font="30px"+scoreFont;
        ctx.fillStyle = '#fff';
        ctx.fillText(score.toString(),5,canvasHeight-5);
        ctx.restore();
    }
    
    scope.drawBlock=function(ctx,position){
    	var x= position[0] * blocksize;
        var y= position[1] * blocksize;
        ctx.fillRect(x,y,blocksize,blocksize);
    }
    function Snake(body,direction){
    	 this.body=body;
        this.direction=direction;
        this.ateApple=false;
        
        /*s'il mange la pomme l'ateapple sera vraie*/
        /*this.ateApple=false;*/
        
        /*Desin Snake*/
         this.draw= function(){
            ctx.save();
            ctx.fillStyle="#ed9e3e";
            for(var i=0;i<this.body.length;i++){
                /*Designr un block*/
                scope.drawBlock(ctx,this.body[i]);
            }
            /*permet de garder le contexte ccomment avant  desiner*/
            ctx.restore();
        };
        
        /*funtion pour avancer le serpent*/
        this.advance= function(){
            /* on travaille juste avec l'eje x */
            /* slice()=nous permet de copier l'element */
            var nextPosition=this.body[0].slice();
            switch(this.direction){
                case "right": nextPosition[0] +=1;
                    break;
                case "left": nextPosition[0] -=1;
                    break;
                case "up": nextPosition[1] -=1;
                    break;
                case "down": nextPosition[1] +=1;
                    break;
                
                   }
            
            /*Unshift=Ajouter un nouvelle element*/
            this.body.unshift(nextPosition);
            /*Ajouter du corps chaque fois qu'il a mangé une pomme*/
            if(!this.ateApple){
                this.body.pop();
               }
            else{
                this.ateApple=false;
                
            }
            /*.pop()=enleve le derniere position du snake*/
            
        };
        
        this.setDirection=function(newDirection){
            var allowedDirections;
            switch(this.direction){
                case "right": 
                case "left": allowedDirections=["up","down"];
                    break;
                case "up": 
                case "down": allowedDirections=["left","right"]; break;
                default:;
            }
             if (allowedDirections.indexOf(newDirection) > -1){
                this.direction = newDirection;
            }
        };
        
        /*Verfier l'escenaariosi choca con la pared o asi mismo*/
        this.checkCollision=function(){
            var wallCollision=false;
            var snakeCollision=false;
            var head= this.body[0];
            /*le corp su snake: la function slice:copie tout le corp et pas la tete*/
            var rest= this.body.slice(1);
            var snakeX=head[0];
            var snakeY=head[1];
            var minX=0;
            var minY=0;
            var maxX=widthInBlocks-1;
            var maxY=heightInBlocks-1;
            var isNotBetweenHorizontalWalls=snakeX<minX|| snakeX>maxX;
            var isNotBetweenVerticalWalls=snakeY<minY|| snakeY>maxY;
           if(isNotBetweenVerticalWalls||isNotBetweenHorizontalWalls){
                wallCollision=true;
            }
            for(var i=0; i<rest.length;i++){
                if(snakeX===rest[i][0] && snakeY===rest[i][1]){
                    snakeCollision=true;
                }
                
            }
            return wallCollision || snakeCollision;
            
        };
        this.isEatingApple=function(appleToEat){
            var head=this.body[0];
            if(head[0]===appleToEat.position[0]&&head[1]===appleToEat.position[1]){
                return true;
            }else{
                return false;
            }
        }
    }

    function Apple(position){
    	this.position=position;
        this.draw=function(){
            ctx.save();
            ctx.fillStyle="#ffff";
            ctx.beginPath();
            var radius=blocksize/2;
            var x=this.position[0]*blocksize+radius;
            var y=this.position[1]*blocksize+radius;
            ctx.arc(x,y,radius,0,Math.PI*2,true); 
            ctx.fill();
            ctx.restore();
        }
        this.setNewPosition=function(){
            var newX=Math.round(Math.random()*(widthInBlocks-1));
            var newY=Math.round(Math.random()*(heightInBlocks-1));
            this.position=[newX,newY];                      
        };
        
        this.isOnSnake=function(SnakeToCheck){
            var isOnSnake=false;
            for(var i=0;i<SnakeToCheck.body.length;i++){
                if(this.position[0]===SnakeToCheck.body[i][0] && this.position[1]===SnakeToCheck.body[i][1]){
                    isOnSnake=true;
                }
            }
            return isOnSnake;
        };
    }

  angular.element(document).bind('keyup', 
    function (e) {
    var key=e.keyCode;
    var newDirection;
        switch(key){
            case 37:newDirection="left";break;  
            case 38:newDirection="up";break;  
            case 39:newDirection="right";break;  
            case 40:newDirection="down";break; 
            case 32:scope.restart();return;
            default:return; 
        }
        snakee.setDirection(newDirection);
  });
  

});
