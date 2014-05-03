BasicGame.Intro = function (game) {

// When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;	// a reference to the currently running game
    this.add;	// used to add sprites, text, groups, etc
    this.camera;	// a reference to the game camera
    this.cache;	// the game cache
    this.input;	// the global input manager (you can access this.input.keyboard, this.input.mouse, as well from it)
    this.load;	// for preloading assets
    this.math;	// lots of useful common math operations
    this.sound;	// the sound manager - add a sound, play one, set-up markers, etc
    this.stage;	// the game stage
    this.time;	// the clock
    this.tweens;	// the tween manager
    this.world;	// the game world
    this.particles;	// the particle manager
    this.physics;	// the physics manager
    this.rnd;	// the repeatable random number generator
    

    // You can use any of these from any function within this State.
    // But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.

};

var player; // player variable
var map;
var layer1;
var layer2;
var text = null;               // text for game over, win screen
var items;
var doors;
var sprint = 0;
var timer = 0;

BasicGame.Intro.prototype = {
	
    create: function () {

		//this.mapGroup = this.game.add.group();
		
        // set-up world map
        map = this.game.add.tilemap('level_intro');
        map.addTilesetImage('othersidebysteve32');

        // layers for doing sprite overlay
        layer1 = map.createLayer('Floor');
        layer1.resizeWorld();

        layer2 = map.createLayer('Walls');
        layer2.resizeWorld();
        
        layer3 = map.createLayer('Objects');
        layer3.resizeWorld();
        
        //this.music = this.add.audio('overworld');
        //this.music.play();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // set collisions
 map.setCollision([73,74,75,103,104,105,133,134,135,40,41,42,70,72,100,101,102,142,143,144,172,173,174,202,203,204,232,233,234,262,263], true, 'Walls');
        
        
        
        //player = new Player(this, 'james',this.world.centerX,1664,1);
        player = new Player(this, 'james', this.world.centerX, 1056, 1); 

        player.inventory.createWorldItems([{x: 960,y: 480,scaleX: 1.2,scaleY: 1.2,offsetX: .2,offsetY: .2,spritename: 'generator'}]);
        
        player.inventory.createWorldSetPieces([
            {x: 960,y: 480,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'generator'}
        ]);
       
        // holder shadow properties and functions (shadow bitmapData, light group, game var)
        this.SimpleLighting = new SimpleLighting(this.game);
        this.SimpleLighting.setShadowColor(50,50,50);
        
       
        player.setPlayerLight(this.SimpleLighting.createLight(player.sprite.position.x,
    		player.sprite.position.y,	// y
    		200, 0.2, -1.5,				// Radius, FOV, Angle
    		[256, 256, 256], 30, 'player_light'));
        
        player.setPlayerGlow(this.SimpleLighting.createLight(player.sprite.position.x,
    		player.sprite.position.y,	// y
    		20, 2, 1,				// Radius, FOV, Angle
    		[256, 256, 256], 0, 'player_glow'));
        
        
        //set player attack key
        var interact_key = this.input.keyboard.addKey(Phaser.Keyboard.Z);
        interact_key.onDown.add(this.interact, this);
        
        
        // quick restart
        var restart_key = this.input.keyboard.addKey(Phaser.Keyboard.R);
        restart_key.onDown.add(this.quitGame, this);

        // prevent keys from scrolling window
        this.input.keyboard.addKeyCapture([ 
           Phaser.Keyboard.LEFT, 
           Phaser.Keyboard.RIGHT, 
           Phaser.Keyboard.UP, 
           Phaser.Keyboard.DOWN
        ]);



    },

    update: function () {

    // player collision with environment
        this.physics.arcade.collide(player.sprite,layer1);
        this.game.physics.arcade.overlap(player.sprite, layer2);
        this.physics.arcade.overlap(player.sprite,layer2);
        this.physics.arcade.collide(player.sprite,layer3);
        this.physics.arcade.collide(player.sprite, player.inventory.getSetPieceList());
        
        player.inventory.render();
        
        this.SimpleLighting.updateShadowTexture();
        
        player.movePlayer();
            
        
        if(player.sprite.position.x >= 736 && player.sprite.position.x <= 928 && player.sprite.position.y >= 480 && player.sprite.position.y <= 672){
            this.win(player.sprite);
        }

    },
    
    
    viewInventory: function(){
        for(i = 0; i < items.length; i++){
            if(player.inventory[items.getAt(i).key] != null){
                console.log('inside')
                items.getAt(i).revive();
                items.getAt(i).scale.x = 300;
                items.getAt(i).scale.y = 300;
                
            }
        }
    },
    
    
    
    
    interact: function(){
         this.physics.arcade.overlap(player.sprite, player.inventory.getItemList(), player.addToInventory, null, player);
    },
    

    quitGame: function (pointer) {
        player = null; // player variable
        monster= null; // monster varable
        map= null;
        layer1= null;
        layer2= null;
        layer3= null; // map variables
        text = null;               // text for game over, win screen
        won = false;
        lost = false;  // win/lose variables
        monster_move_toggle = false;  // toggles when monster moves
        music.stop();
        music= null;
        room_music.stop();
        room_music= null;
        chase_music.stop();
        chase_music= null;
        items = null;
        
        sprint = 0;
        timer = 0;
        eyeless_following = false;
        key_pickup_sfx = null;
        wooden_door_sfx = null;
        scary_sfx = null;
        blue_man = null;
        eyeless_girl = null;
        creepy_song.stop();
        creepy_song = null;

        this.camera.follow(null);
        this.camera.setPosition(0,0);


        // Then let's go back to the main menu.
        this.game.state.start('Intro');

    },
    
    

    //transition from music1 to music 2
    transitionMusic: function(music1, music2){
         // transition music from background to secret room music
        
        if(music1 == null && music2 != null){
            if(!music2.isPlaying){
                        music2.play('',0,1,true);
                        music2.volume = 0;
                    }

                    if(music2.volume <= 0.5)
                        music2.volume += 0.01;
        }else if(music2 == null && music1 != null){
            if(music1.volume > 0)
                    music1.volume -= 0.01;
                else
                    music1.stop();
        }else{
            if(music1.volume > 0)
                    music1.volume -= 0.005;
                else
                    music1.stop();


                    if(!music2.isPlaying){
                        music2.play('',0,1,true);
                        music2.volume = 0;
                    }

                    if(music2.volume <= 0.5)
                        music2.volume += 0.005;
        }
    },
    
    monsterMovement: function(player, monster, music){
        //make monster music louder as he gets closer to player
                if(!music.isPlaying){
                        music.play('',0,1,true);
                        music.volume = 0;
                }

                if(music.volume <= 5){
                    music.volume += 0.01;
                }


                //monster movement
                if(monster.position.x < player.sprite.position.x - 10){
                    monster.body.velocity.x = 150;
                    monster.body.velocity.y = 0;

                    monster.animations.play('run_right');
                }
                else if(monster.position.x > player.sprite.position.x + 10){
                    monster.body.velocity.x = -150;
                    monster.body.velocity.y = 0;

                    monster.animations.play('run_left');
                } 
                else if(monster.position.y > player.sprite.position.y + 10){
                    monster.body.velocity.y = -150;
                    monster.body.velocity.x = 0;

                    monster.animations.play('run_up');
                }
                else if(monster.position.y < player.sprite.position.y - 10){
                    monster.body.velocity.y = 150;
                    monster.body.velocity.x = 0;

                    monster.animations.play('run_down');
                }
    },

    createMonster: function(){
        var temp_monster = null;
        var start_x_position = 1040;
        var start_y_position = 2160;
        
         // set up monster
        temp_monster = this.add.sprite(start_x_position, start_y_position, 'monster');
        this.game.physics.arcade.enableBody(temp_monster);
        temp_monster.anchor.setTo(0.5, 0.5);
        temp_monster.frame = 1;
        temp_monster.kill();

        //set up monster animations
        temp_monster.animations.add('run_down', [0,1,2], 5, true);
        temp_monster.animations.add('run_left', [3,4,5], 5, true);
        temp_monster.animations.add('run_right', [6,7,8], 5, true);
        temp_monster.animations.add('run_up', [9,10,11], 5, true);
        
        return temp_monster;
    },
    
    resetMonster: function(monster, music){
        //reset monster position
        if(monster.monster_move_toggle){
            monster.x = this.rnd.integerInRange(420, 1980);
            monster.y = this.rnd.integerInRange(420, 1980);

            monster.monster_move_toggle = false;
        }

        monster.body.velocity.y = 0;
        monster.body.velocity.x = 0;

        if(chase_music.volume > 0)
            music.volume -= 0.02;
        else
            music.stop();
    },
    
    
    win: function(player){
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        
        //player = null; // player variable
        map= null;
        layer1= null;
        layer2= null;
        layer3= null; // map variables
        text = null;               // text for game over, win screen
        won = false;
        lost = false;  // win/lose variables
        items = null;

        sprint = 0;
        timer = 0;
            
        this.game.state.start('Floor_One');
        
        
    },
    
    lose: function(player,monster){
        player.sprite.body.velocity.x = 0;
        player.sprite.body.velocity.y = 0;

        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        
        if(text == null){
            text = this.add.text(this.camera.x + 200, this.camera.y + 250, 'Game Over', { font: "65px Arial", fill: "#ff0044", align: "center" });
            text.alpha = 0;

        }
        
         // fade in text
        if(text.alpha <= 1)
            text.alpha += 0.002;
        else
            this.quitGame(this);
    }
    


};