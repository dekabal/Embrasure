BasicGame.Game = function (game) {

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
var monster; // monster varable
var light;
var darkness; // variables for light and darkness images
var map;
var layer1;
var layer2;
var layer3; // map variables
var text = null;               // text for game over, win screen
var music;
var room_music;
var chase_music;
var keys;
var doors;
var sprint = 0;
var key_pickup_sfx;

BasicGame.Game.prototype = {

    create: function () {

        // set-up world map
        map = this.add.tilemap('map');
        map.addTilesetImage('otherworld');
        map.addTilesetImage('chains');

        // layers for doing sprite overlay - Phaser does not current support
        // multilayer collision so some assets do not have collision
        layer1 = map.createLayer('Tile Layer 1');
        layer1.resizeWorld();

        layer2 = map.createLayer('Tile Layer 2');
        layer2.resizeWorld();

        layer3 = map.createLayer('Tile Layer 3');
        layer3.resizeWorld();


        // set collisions
        map.setCollision([10,11,74,103,105,134,265,390,420,443], true, 'Tile Layer 1');
        map.setCollision([40,41,42,70,71,72,100,101,447,446,445,444,292,322,409,410,439,440,469,470], true, 'Tile Layer 2');
        
        map.setCollision([0], true, 'Tile Layer 3');

       player = this.createPlayer();

       monster = this.createMonster();
        
        // keys
        keys = this.add.group();
        keys.create(605, 576, 'key1')
        
        // doors
        var temp_door = this.add.sprite(1184, 2000,'door_gated');
        temp_door.body.immovable = true;
        
        doors = this.add.group();
        doors.add(temp_door);
        

        // light system
        light = this.add.sprite(0, 0, 'light');
        light.fixedToCamera = true;	

        darkness = this.game.add.sprite(0, 0, 'darkness');
        darkness.fixedToCamera = true;
        darkness.alpha = 1;
        
        
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


        // background music
        music = this.add.audio('overworld',1,true);
        music.volume = 0.5;
        music.play('',0,1,true);

        //secret room music
        room_music = this.add.audio('room',1,false);
        room_music.volume = 0;

        //monster music
        chase_music = this.add.audio('chase',1,false);
        chase_music.volume = 0;
        
        // gated door sound effects
        gated_door_soundeffect = this.add.audio('gated_door_open', 1, false);
        
        key_pickup_sfx = this.add.audio('key_pickup', 1, false);


    },

    update: function () {

    // player collision with environment
        this.physics.collide(player,layer1);
        this.physics.overlap(player,layer2);
        this.physics.collide(player,layer3);
        
        this.physics.collide(player,doors, this.openDoor, null, this);

        // monster collision with environment
        this.physics.collide(monster,layer1);
        this.physics.collide(monster,layer2);
        this.physics.collide(monster,layer3);
        

        
        //check if mosnter has touched player
        if(this.physics.overlap(player,monster, this.lose, null, this)){    
        }else if(player.position.y > 2320){
            this.win(player, monster);
        }else{

            if(darkness.alpha >= .1)
                darkness.alpha -= 0.005;

            this.movePlayer(player);

            // if monster is within a 300 radius block of the player, have monter
            // move towards the player. If the mosnter gets out of that radius
            // teleport him to a new location
            if(Phaser.Math.distance(player.position.x, player.position.y, monster.position.x, monster.position.y) <= 300){
                this.monsterMovement(player, monster, chase_music)

            }else{
                this.resetMonster(monster, chase_music);
            }



            // check if player has entered the secret room
            if(player.position.x < 868 && player.position.x > 420 && player.position.y < 800 && player.position.y > 420){

                this.transitionMusic(music, room_music);

            }else{

                this.transitionMusic(room_music, music);
            }
        }

    },
    
    openDoor: function(player, door){
        if(door.key == 'door_gated'){
            if(player.keys.indexOf('key1') != -1){
                door.destroy();
                gated_door_soundeffect.play();

            }

        }
        
    },
    
    interact: function(){
        this.physics.overlap(player, keys, this.acquireKey, null, this);
    },
    
    acquireKey: function(player, key){
        if(player.keys.indexOf(key.key) == -1)
            player.keys.push(key.key);
        key.destroy();
        key_pickup_sfx.play();
    },

    quitGame: function (pointer) {
        player = null; // player variable
        monster= null; // monster varable
        light= null;
        darkness= null; // variables for light and darkness images
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
        keys = null;

        this.camera.follow(null);
        this.camera.setPosition(0,0);


        // Then let's go back to the main menu.
        this.game.state.start('MainMenu');

    },
    
    

    //transition from music1 to music 2
    transitionMusic: function(music1, music2){
         // transition music from background to secret room music
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

                monster.monster_move_toggle = true;


                //monster movement
                if(monster.position.x < player.position.x - 10){
                    monster.body.velocity.x = 200;
                    monster.body.velocity.y = 0;

                    monster.animations.play('run_right');
                }
                else if(monster.position.x > player.position.x + 10){
                    monster.body.velocity.x = -200;
                    monster.body.velocity.y = 0;

                    monster.animations.play('run_left');
                } 
                else if(monster.position.y > player.position.y + 10){
                    monster.body.velocity.y = -200;
                    monster.body.velocity.x = 0;

                    monster.animations.play('run_up');
                }
                else if(monster.position.y < player.position.y - 10){
                    monster.body.velocity.y = 200;
                    monster.body.velocity.x = 0;

                    monster.animations.play('run_down');
                }
    },
    
    createPlayer: function(){
        
        var temp_player = this.add.sprite(1180, 288,'james');
        temp_player.anchor.setTo(0.5,0.5);
        this.camera.follow(temp_player);
        
        temp_player.keys = new Array();
        temp_player.number = 25;


        //set up player animations
        temp_player.animations.add('run_down', [0,1,2], 5, true);
        temp_player.animations.add('run_left', [3,4,5], 5, true);
        temp_player.animations.add('run_right', [6,7,8], 5, true);
        temp_player.animations.add('run_up', [9,10,11], 5, true);
        temp_player.frame = 1;
        
        return temp_player;

    },
    
    createMonster: function(){
        var temp_monster = null;
        var start_x_position = this.rnd.integerInRange(420, 1980);
        var start_y_position = this.rnd.integerInRange(420, 1980);
        
         // set up monster
        temp_monster = this.add.sprite(start_x_position, start_y_position, 'monster');
        temp_monster.anchor.setTo(0.5, 0.5);
        temp_monster.frame = 1;
        
        temp_monster.monster_move_toggle = false;

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
    
    movePlayer: function(player){
        // player movement
        if(this.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            player.body.velocity.y = 0;
            
            if(this.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    player.body.velocity.x = -300;
                }else
                    player.body.velocity.x = -100;
            }
            else{
                player.body.velocity.x = -100;
                if(sprint > 0)
                    sprint -= 2;
            }

            player.animations.play('run_left');

        }
        else if(this.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            player.body.velocity.y = 0;
            
            if(this.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    player.body.velocity.x = 300;
                }else
                    player.body.velocity.x = 100;
            }
            else{
                player.body.velocity.x = 100;
                if(sprint > 0)
                    sprint -= 2;
            }

            player.animations.play('run_right');

        }
        else if(this.input.keyboard.isDown(Phaser.Keyboard.UP)){
            player.body.velocity.x = 0;
            
            if(this.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    player.body.velocity.y = -300;
                }else
                    player.body.velocity.y = -100;
            }
            else{
                player.body.velocity.y = -100;
                if(sprint > 0)
                    sprint -= 2;
            }

            player.animations.play('run_up');

        }
        else if(this.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            player.body.velocity.x = 0;
            
            if(this.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    player.body.velocity.y = 300;
                }else
                    player.body.velocity.y = 100;
            }
            else{
                player.body.velocity.y = 100;
                if(sprint > 0)
                    sprint -= 2;
            }

            player.animations.play('run_down');

        }
        else {
            player.body.velocity.x = 0;
            player.body.velocity.y = 0;
            player.animations.stop();
            if(sprint > 0)
                sprint -= 10;

        }
    },
    
    win: function(player, monster){
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        
        if(text == null){
            text = this.add.text(this.camera.x + 200, this.camera.y + 250, 'You Escaped!', { font: "65px Arial", fill: "#ff0044", align: "center" });
            text.alpha = 0;
            darkness.alpha = 1;
        }
        
         // fade in text
        if(text.alpha <= 1)
            text.alpha += 0.002;
        else
            this.quitGame(this);
        
    },
    
    lose: function(player,monster){
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;

        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        
        if(text == null){
            text = this.add.text(this.camera.x + 200, this.camera.y + 250, 'Game Over', { font: "65px Arial", fill: "#ff0044", align: "center" });
            text.alpha = 0;
             darkness.alpha = 1;
        }
        
         // fade in text
        if(text.alpha <= 1)
            text.alpha += 0.002;
        else
            this.quitGame(this);
    }
    


};