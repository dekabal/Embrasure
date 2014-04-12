BasicGame.Level_One = function (game) {

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
var monster;
var blue_man; // monster varable
var eyeless_girl;
var light;
var darkness; // variables for light and darkness images
var map;
var layer1;
var layer2;
var text = null;               // text for game over, win screen
var music;
var room_music;
var chase_music;
var keys;
var doors;
var sprint = 0;
var timer = 0;
var eyeless_following = false;
var key_pickup_sfx;
var wooden_door_sfx
var scary_sfx;
var creepy_song;

BasicGame.Level_One.prototype = {

    create: function () {

        // set-up world map
        map = this.add.tilemap('level-one');
        map.addTilesetImage('otherworld');
        map.addTilesetImage('chains');

        // layers for doing sprite overlay - Phaser does not current support
        // multilayer collision so some assets do not have collision
        layer1 = map.createLayer('Tile Layer 1');
        layer1.resizeWorld();

        layer2 = map.createLayer('Tile Layer 2');
        layer2.resizeWorld();

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // set collisions
        map.setCollision([0,74,103,105,134,265,378,390,420,443], true, 'Tile Layer 1');

            map.setCollision([1,40,41,42,70,71,72,100,101,447,446,445,444,292,322,325,355,378,409,410,439,440,469,470], true, 'Tile Layer 2');
        

       
        
        // keys
        keys = this.createKeys();
        
        
        // doors
        doors = this.createDoors();
        
        
        
        player = this.createPlayer();

        monster = this.createMonster();
        
        blue_man = this.add.sprite(920, 1194, 'blue_mask_man');
        blue_man.anchor.setTo(0.5, 0.5);
        
        
        //set up blue_man animations
        blue_man.animations.add('run_right', [6,7,8], 10, true);
        blue_man.frame = 7;
        blue_man.kill();
        
        eyeless_girl = this.add.sprite(450,2016,'eyeless_girl');
        eyeless_girl.anchor.setTo(0.5,0.5);
        
        eyeless_girl.frame = 7

        // light system
        light = this.add.sprite(0, 0, 'light');
        light.fixedToCamera = true;	

        darkness = this.game.add.sprite(0, 0, 'darkness');
        darkness.fixedToCamera = true;
        darkness.alpha = 0.1;
        
        
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
        
        wooden_door_sfx = this.add.audio('wooden_door', 1, false);
        
        scary_sfx = this.add.audio('Scary-Titus_Calen-1449371204',1,false);
        
        creepy_song = this.add.audio('creepy_song',1,false);
        creepy_song.volume = 0;
        
        this.game.physics.arcade.enableBody(player);
        this.game.physics.arcade.enableBody(monster);
        this.game.physics.arcade.enableBody(blue_man);
        this.game.physics.arcade.enableBody(eyeless_girl);
        this.game.physics.arcade.enableBody(doors);

    },

    update: function () {

    // player collision with environment
        this.physics.arcade.collide(player,layer1);
        this.game.physics.arcade.overlap(player, layer2);
        this.physics.arcade.overlap(player,layer2);
        this.physics.arcade.collide(player,layer3);
        
        this.physics.arcade.collide(player,doors, this.openDoor, null, this);

        // monster collision with environment
        this.physics.arcade.collide(monster,layer1);
        this.physics.arcade.collide(monster,layer2);
        this.physics.arcade.collide(monster,layer3);
        

        //check if mosnter has touched player
        //this.physics.overlap(player,monster, this.lose, null, this);

        if(player.position.y >= 2384 && player.position.x > 784 && player.position.x < 832){
            this.win(player, monster);
        }else{
            
            
            if(Phaser.Math.distance(player.position.x, player.position.y, monster.position.x, monster.position.y) <= 300 && monster.alive){
                this.monsterMovement(player, monster, chase_music)

            }

            this.movePlayer(player);
            
            

            if(!(Phaser.Math.distance(player.position.x, player.position.y, eyeless_girl.position.x, eyeless_girl.position.y) <= 200) && eyeless_following){
                
                var temp_x = this.rnd.integerInRange(player.position.x - 150, player.position.x+150);
                var temp_y = this.rnd.integerInRange(player.position.y - 150, player.position.y+150);
                
                while(temp_x > player.x - 50 && temp_x < player.position.x + 50)
                    temp_x = this.rnd.integerInRange(player.x - 150, player.position.x+150);
                
                while(temp_y > player.y - 50 && temp_y < player.y + 50)
                    temp_y = this.rnd.integerInRange(player.position.y - 150, player.position.y+150);
                
                eyeless_girl.x =  this.rnd.integerInRange(player.position.x - 150, player.position.x+150);
            
                eyeless_girl.y =  this.rnd.integerInRange(player.position.y - 150, player.position.y+150);
                
                if(eyeless_girl.y < player.y - 50 && eyeless_girl.y > player.y - 150)
                    eyeless_girl.frame = 2;
                else if(eyeless_girl.y > player.y + 50 && eyeless_girl.y < player.y + 150)
                    eyeless_girl.frame = 11;
                else if(eyeless_girl.x < player.x)
                    eyeless_girl.frame = 8;
                else if(eyeless_girl.x > player.x)
                    eyeless_girl.frame = 5;
                
            }else if(player.position.x < 576 && player.position.x > 480 && player.position.y < 2128 && player.position.y > 1968 && !eyeless_following){
                eyeless_following = true;
            }
            
            if(eyeless_following && eyeless_girl.alive)
                this.transitionMusic(music,creepy_song);
            else
                this.transitionMusic(creepy_song,music);

        
            // check if player has entered the secret room
            if(player.position.x < 1184 && player.position.x > 912 && player.position.y < 1328 && player.position.y > 1056){

                this.transitionMusic(music, null);

            }else if(!creepy_song.isPlaying){

                this.transitionMusic(null, music);
            }
            
            
            if(blue_man.alive){
                this.game.physics.arcade.overlap(player,blue_man, this.lose, null, this);
                timer += 1;
                
                if(this.game.physics.arcade.overlap(player,blue_man, this.lose, null, this)){
                }else if(timer > 200){
                    blue_man.body.velocity.x = 300;
                    blue_man.animations.play('run_right');
                    scary_sfx.play();
                }
                
                if(this.physics.arcade.collide(blue_man,layer1))
                    blue_man.destroy();
            }
                
            
            
        }
        
        
        this.game.physics.arcade.overlap(player, eyeless_girl, this.lose, null, this);

        
        this.game.physics.arcade.overlap(player, monster, this.lose, null, this);
        
    },
    
    createKeys: function(){
        var temp_keys = this.add.group();
        temp_keys.create(816, 1648, 'key1');
        temp_keys.create(1120, 1184, 'key2');
        temp_keys.create(1024, 1536, 'key3');
        
        for(var i = 0; i < 3; i++){
           this.game.physics.arcade.enableBody(temp_keys.getAt(i));
        }
            
        return temp_keys;
    },
    
    createDoors: function(){
        var temp_doors = this.add.group();
        
        var temp_door = this.add.sprite(704, 1344,'metal_door');
        this.game.physics.arcade.enableBody(temp_door);
        temp_door.body.immovable = true;
        temp_doors.add(temp_door);
        
        temp_door = this.add.sprite(704, 1840,'metal_door');
        this.game.physics.arcade.enableBody(temp_door);
        temp_door.body.immovable = true;
        temp_doors.add(temp_door);
        
        
        temp_door = this.add.sprite(704, 2016,'door_normal_barbed');
        this.game.physics.arcade.enableBody(temp_door);
        temp_door.body.immovable = true;
        temp_doors.add(temp_door);
        
        temp_door = this.add.sprite(896, 2160,'door_normal_barbed');
        this.game.physics.arcade.enableBody(temp_door);
        temp_door.body.immovable = true;
        temp_doors.add(temp_door);
        
        temp_door = this.add.sprite(784, 2288,'metal_door_four');
        this.game.physics.arcade.enableBody(temp_door);
        temp_door.body.immovable = true;
        temp_doors.add(temp_door);
        
        
        return temp_doors;
    },
    
    openDoor: function(player, door){
        if(doors.getAt(0) == door || doors.getAt(1) == door){
            if(player.keys.indexOf('key2') != -1){
                door.kill();
                gated_door_soundeffect.play();
            }

        }else if(doors.getAt(2) == door || doors.getAt(3) == door){
            if(player.keys.indexOf('key1') != -1){
                door.kill();
                wooden_door_sfx.play();
            }

        }else if(doors.getAt(4) == door){
            if(player.keys.indexOf('key3') != -1){
                door.kill();
                gated_door_soundeffect.play();
            }

        }
        
    },
    
    interact: function(){
        this.game.physics.arcade.overlap(player, keys, this.acquireKey, null, this);
    },
    
    acquireKey: function(player, key){
        console.log('inside');
        if(player.keys.indexOf(key.key) == -1)
            player.keys.push(key.key);
        key.destroy();
        
        if(key.key == 'key2')
            blue_man.revive();
        else if(key.key == 'key3'){
            eyeless_girl.kill();
            monster.revive();
        }
        
        key_pickup_sfx.play();
    },

    quitGame: function (pointer) {
        player = null; // player variable
        monster= null; // monster varable
        light= null;
       // darkness= null; // variables for light and darkness images
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
        this.game.state.start('MainMenu');

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
                if(monster.position.x < player.position.x - 10){
                    monster.body.velocity.x = 150;
                    monster.body.velocity.y = 0;

                    monster.animations.play('run_right');
                }
                else if(monster.position.x > player.position.x + 10){
                    monster.body.velocity.x = -150;
                    monster.body.velocity.y = 0;

                    monster.animations.play('run_left');
                } 
                else if(monster.position.y > player.position.y + 10){
                    monster.body.velocity.y = -150;
                    monster.body.velocity.x = 0;

                    monster.animations.play('run_up');
                }
                else if(monster.position.y < player.position.y - 10){
                    monster.body.velocity.y = 150;
                    monster.body.velocity.x = 0;

                    monster.animations.play('run_down');
                }
    },
    
    createPlayer: function(){
        
        var temp_player = this.add.sprite(this.world.centerX+15, 850,'james');
        this.game.physics.arcade.enableBody(temp_player);
        temp_player.anchor.setTo(0.5,0.5);
        temp_player.frame = 1;
        this.camera.follow(temp_player);
        temp_player.body.collide
        
        temp_player.keys = new Array();
        temp_player.body.collideWorldBounds = true;


        //set up player animations
        temp_player.animations.add('run_down', [0,1,2], 5, true);
        temp_player.animations.add('run_left', [3,4,5], 5, true);
        temp_player.animations.add('run_right', [6,7,8], 5, true);
        temp_player.animations.add('run_up', [9,10,11], 5, true);
        
        return temp_player;

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
        
        
        
         // fade in text
        if(darkness.alpha <= 1)
            darkness.alpha += 0.005;
        else{
            player = null; // player variable
            monster= null; // monster varable
            light= null;
           // darkness= null; // variables for light and darkness images
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
            
            this.game.state.start('Game');
        }
        
        
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