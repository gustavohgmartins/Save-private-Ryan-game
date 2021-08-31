function start() {
    $("#menu").hide();
    $("#gameScreen").append("<div id='player' class='animation1'></div>");
    $("#gameScreen").append("<div id='enemy1' class='animation2'></div>");
    $("#gameScreen").append("<div id='enemy2'></div>");
    $("#gameScreen").append("<div id='partner' class='animation3'></div>");
    $("#gameScreen").append("<div id='scoreboard'></div>");
    $("#gameScreen").append("<div id='energybar'></div>");
   



    //Variables

    var shot_sound=document.getElementById("shot_sound");
    var explosion_sound=document.getElementById("explosion_sound");
    var music=document.getElementById("music");
    var gameover_sound=document.getElementById("gameover_sound");
    var death_sound=document.getElementById("death_sound");
    var rescued_sound=document.getElementById("rescued_sound");

    var energy = 3;
    var score = 0;
    var rescued = 0;
    var dead = 0;
    var gameover = false;
    var reloaded = true;
    var enemy_speed = 5;
    var enemy1y = parseInt(Math.random() * 334);
    var game = {}
    var keys= {
        W: 87,
        S: 83,
        D: 68
    }

    music.addEventListener("ended", function(){ music.currentTime = 0; music.play(); }, false);
    music.play();

    //Key pressed

    game.pressed = [];

    $(document).keydown(function(e){
        game.pressed[e.which] = true;
    })

    $(document).keyup(function(e){
        game.pressed[e.which] = false;
    })
        
    //Game Loop

    game.timer = setInterval(loop,30);

    function loop() {

    move_bg();
    move_player();
    move_enemy1();
    move_enemy2();
    move_partner();
    collision();
    scoreboard();
    energybar();

    } 
	
    function move_bg() {
	
	left = parseInt($("#gameScreen").css("background-position"));
	$("#gameScreen").css("background-position",left-1);
	
	} 

    
	function move_player() {
	
        if (game.pressed[keys.W]) {
            var top = parseInt($("#player").css("top"));
            if (top > 10 ){
                
                $("#player").css("top",top - 10);
            }
        }
        if (game.pressed[keys.S]) {
            var top = parseInt($("#player").css("top"));
            if (top <= 434){
            $("#player").css("top",top + 10);
            }
        }
        if (game.pressed[keys.D]) {
            
            shoot();
        
        }
    }  
    
    function move_enemy1() {

        var enemy1x = parseInt($("#enemy1").css("left"));
        
        
        $("#enemy1").css("top", enemy1y);
        $("#enemy1").css("left",enemy1x - enemy_speed);
        

     
        if (enemy1x <= -250) {
            score = score - 100;
            enemy1y= parseInt(Math.random() * 334); 
            $("#enemy1").css("left",950);
            $("#enemy1").css("top", enemy1y);
           
        }
        
    }

    function move_enemy2() {

        var enemy2x = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left",enemy2x - (enemy_speed/2));
        
        

        if (enemy2x <= -165) { 
            $("#enemy2").css("left",940);


        }
        
    }

    function move_partner() {
        var partnerx = parseInt($("#partner").css("left"));

        $("#partner").css("left", partnerx + 1);

        if (partnerx >= 900) {
            $("#partner").css("left", 0);
        }

    }

    function shoot() {
	
        if (reloaded==true) {
        
        shot_sound.play();
        reloaded=false;
        
        shoty = parseInt($("#player").css("top")) + 50;
        shotx= parseInt($("#player").css("left")) + 180;
        $("#gameScreen").append("<div id='shot'></div");
        $("#shot").css("top",shoty);
        $("#shot").css("left",shotx);

        var reload_time = window.setInterval(move_shot, 30);
        }
    

        function move_shot() {
            shotx = parseInt($("#shot").css("left"));
            $("#shot").css("left",shotx+15); 

            if (shotx>=893) {
                            
            window.clearInterval(reload_time);
            reload_time = null;
            $("#shot").remove();
            reloaded=true;
            }
        }   
    }

    function collision(){

        var collision1 = ($("#player").collision($("#enemy1")));
        var collision2 = ($("#player").collision($("#enemy2")));
        var collision3 = ($("#player").collision($("#partner")));
        var collision4 = ($("#shot").collision($("#enemy1")));
        var collision5 = ($("#shot").collision($("#enemy2")));
        var collision6 = ($("#partner").collision($("#enemy2")));
        
        if (collision1.length>0) {

            var explosionx= parseInt($("#enemy1").css("left"));
            var explosiony = parseInt($("#enemy1").css("top"));
            score = score - 100;
            energy--;
            explosion(explosionx,explosiony);
            
            enemy1y= parseInt(Math.random() * 334);
        
            $("#enemy1").css("left",950);
            $("#enemy1").css("top", enemy1y);                
        }
        if (collision2.length>0) {

            var explosionx= parseInt($("#enemy2").css("left"));
            var explosiony = parseInt($("#enemy2").css("top"));
            score = score - 50;
            energy--;

            $("#enemy2").remove();
            explosion(explosionx,explosiony);
            if (gameover == false){
                setTimeout(function() {
                $("#gameScreen").append("<div id='enemy2'></div>");
                $("enemy2").css("left",940);},3000);
            }
        }
        if (collision4.length>0) {
            
            var explosionx= parseInt($("#enemy1").css("left"));
            var explosiony = parseInt($("#enemy1").css("top"));
            score = score + 100;
            $("#shot").css("left",950);  
            explosion(explosionx,explosiony);
            enemy1y= parseInt(Math.random() * 334);
            $("#enemy1").css("left",950);
            $("#enemy1").css("top", enemy1y); 
            enemy_speed = enemy_speed + 0.3;

        }
        if (collision5.length>0) {
            
            var explosionx= parseInt($("#enemy2").css("left"));
            var explosiony = parseInt($("#enemy2").css("top"));
            score = score +50;

            $("#shot").css("left",950);  
            $("#enemy2").remove();
            explosion(explosionx,explosiony);
            if (gameover == false){
                setTimeout(function() {
                $("#gameScreen").append("<div id='enemy2'></div>");
                $("enemy2").css("left",940);},3000);
            }
        }
        if (collision3.length>0){
            partnerx = parseInt($("#partner").css("left"));
            if (partnerx>20){
            $("#partner").remove();
            rescued++;
            rescued_sound.play();
            
            
            setTimeout(function() {
                if (gameover == false){
                $("#gameScreen").append("<div id='partner'class='animation3'></div>");
            }},3000);
            }
            
        }
        if (collision6.length>0){
            partnerx = parseInt($("#partner").css("left"));
            if (partnerx > 100){
            var deathx = parseInt($("#partner").css("left"));
            dead++;
            
            partner_death(deathx);
            $("#partner").remove();
            death_sound.play();

            setTimeout(function() {
                if (gameover == false){
                $("#gameScreen").append("<div id='partner'class='animation3'></div>");
            }},3000);
            
            }
        }
        
    }

    function explosion(coordx, coordy){
        explosion_sound.play();
        $("#gameScreen").append("<div id='explosion'></div>");
        $("#explosion").css("background-image", "url('../resources/img/explosion.png')");
        $("#explosion").css("top", coordy);
        $("#explosion").css("left", coordx - 40);
        $("#explosion").animate({width: 200, opacity: 0.2},"slow");
        setTimeout(function(){$("#explosion").remove();},550);
        
    }
    function partner_death(coord){
        $("#gameScreen").append("<div id='partner_death' class='animation4'></div>");
        $("#partner_death").css("left", coord);
        setTimeout (function(){
        $("#partner_death").remove();},1000);
        
    }

    function scoreboard(){ 
        $("#scoreboard").html("<h2> Score: " + score +" &nbsp&nbsp&nbsp&nbspRescued: " + rescued + " &nbsp&nbsp&nbsp&nbspDead: " + dead + "</h2>");
    }

    function energybar(){ 
        if (energy == 2){
            $("#energybar").css("background-image", "url(../resources/img/energy2.png");
        }
        else if (energy == 1){
            $("#energybar").css("background-image", "url(../resources/img/energy1.png");
        }
        else if (energy == 0){ 
            $("#energybar").css("background-image", "url(../resources/img/energy0.png");
            gameover = true;
            gameover_screen();
        }
    }
    function gameover_screen(){ 
        if (gameover == true){ 
            music.pause();
            gameover_sound.play();
            window.clearInterval(game.timer);
            game.timer=null;

            $('#player').remove();
            $('#enemy1').remove();
            $('#enemy2').remove();
            $('#partner').remove();
            $("#gameScreen").append("<div id='gameover'><h3>GAME OVER</h3><p>Your Score: "+ score + "</p><a href='#' onclick='play_again()'>Play Again &#9654;</a></div>");
        }
    }

}
function play_again(){
    gameover_sound.pause();
    $("#gameover").remove();
    $("#energybar").remove();
    start();
}             