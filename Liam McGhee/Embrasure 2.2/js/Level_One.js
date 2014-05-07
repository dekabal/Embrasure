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
var map;
var layer1;
var layer2;
var text = null;               // text for game over, win screen
var music;
var room_music;
var chase_music;
var items;
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

         //set collisions
        map.setCollision([0,74,103,105,134,265,378,390,420,443], true, 'Tile Layer 1');

            map.setCollision([1,40,41,42,70,71,72,100,101,447,446,445,444,292,322,325,355,378,409,410,439,440,469,470], true, 'Tile Layer 2');
        

        
        
        player = new Player(this, 'james',416,48,0);
        
        player.inventory.createWorldItems([
            {x: 720,y: 384,scaleX:1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'key1'},
            {x: 416,y: 836,scaleX:1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'key2'},
            {x: 624,y: 736,scaleX:1,scaleY: 1,offsetX: 0,offsetY: 1.1,spritename: 'key3'}
        ]);
        
        player.inventory.createWorldDoors([
            {x: 304,y: 544,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door',barred: true},
            {x: 304,y: 1040,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door',barred: true},
            {x: 304,y: 1216,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'door_normal_barbed',barred: true},
            {x: 496,y: 1360,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'door_normal32',barred: true},
            {x: 384,y: 1488,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door_four',barred: true}
        ]);
        

        
        
        monster = this.createMonster();
        
        blue_man = this.add.sprite(512, 384, 'blue_mask_man');
        blue_man.anchor.setTo(0.5, 0.5);
        
        
        //set up blue_man animations
        blue_man.animations.add('run_right', [6,7,8], 10, true);
        blue_man.frame = 7;
        blue_man.kill();
        
        eyeless_girl = this.add.sprite(48,1200,'eyeless_girl');
        eyeless_girl.anchor.setTo(0.5,0.5);
        
        eyeless_girl.frame = 7
        
        this.SimpleLighting = new SimpleLighting(this.game);
        this.SimpleLighting.setShadowColor(0,0,0);
        player.setPlayerLight(this.SimpleLighting.createLight(player.sprite.position.x,
    		player.sprite.position.y,	// y
    		200, 0.2, -1.5,				// Radius, FOV, Angle
    		[0, 0, 0], 30, 'player_light'));
        
        player.setPlayerGlow(this.SimpleLighting.createLight(player.sprite.position.x,
    		player.sprite.position.y,	// y
    		20, 2, 1,				// Radius, FOV, Angle
    		[0, 0, 0], 0, 'player_glow'));
        
        
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
        
        
        scary_sfx = this.add.audio('Scary-Titus_Calen-1449371204',1,false);
        
        creepy_song = this.add.audio('creepy_song',1,false);
        creepy_song.volume = 0;
        
        this.faded_in = false;
        timer = 0;
        
        this.game.physics.arcade.enableBody(monster);
        this.game.physics.arcade.enableBody(blue_man);
        this.game.physics.arcade.enableBody(eyeless_girl);

    },

    update: function () {

    // player collision with environment
        this.physics.arcade.collide(player.sprite,layer1);
        this.game.physics.arcade.overlap(player.sprite, layer2);
        this.physics.arcade.overlap(player.sprite,layer2);
        this.physics.arcade.collide(player.sprite,layer3);
        this.physics.arcade.collide(player.sprite, player.inventory.getDoorSetPieceList());
        this.physics.arcade.collide(monster, player.inventory.getDoorSetPieceList(),this.monsterDie,null,this);
    

        // monster collision with environment
        this.physics.arcade.collide(monster,layer1);
        this.physics.arcade.collide(monster,layer2);
        this.physics.arcade.collide(monster,layer3);
        
        
        player.inventory.render();

        this.SimpleLighting.updateShadowTexture();
        
        if(!this.faded_in){
            if(this.SimpleLighting.fadeInAllLights())
                this.faded_in = true;
        }

        if(player.sprite.position.x >= 368 && player.sprite.position.x <= 448 && player.sprite.position.y >= 1552 && player.sprite.position.y <= 1584){
            this.win(player.sprite, monster);
        }else{
            
            
            if(Phaser.Math.distance(player.sprite.position.x, player.sprite.position.y, monster.position.x, monster.position.y) <= 300 && monster.alive){
                this.monsterMovement(player.sprite, monster, chase_music)

            }

            player.movePlayer();
            
            

            if(!(Phaser.Math.distance(player.sprite.position.x, player.sprite.position.y, eyeless_girl.position.x, eyeless_girl.position.y) <= 200) && eyeless_following){
                
                var temp_x = this.rnd.integerInRange(player.sprite.position.x - 150, player.sprite.position.x+150);
                var temp_y = this.rnd.integerInRange(player.sprite.position.y - 150, player.sprite.position.y+150);
                
                while(temp_x > player.sprite.x - 50 && temp_x < player.sprite.position.x + 50)
                    temp_x = this.rnd.integerInRange(player.sprite.x - 150, player.sprite.position.x+150);
                
                while(temp_y > player.sprite.y - 50 && temp_y < player.sprite.y + 50)
                    temp_y = this.rnd.integerInRange(player.sprite.position.y - 150, player.sprite.position.y+150);
                
                eyeless_girl.x =  this.rnd.integerInRange(player.sprite.position.x - 150, player.sprite.position.x+150);
            
                eyeless_girl.y =  this.rnd.integerInRange(player.sprite.position.y - 150, player.sprite.position.y+150);
                
                if(eyeless_girl.y < player.y - 50 && eyeless_girl.y > player.sprite.y - 150)
                    eyeless_girl.frame = 2;
                else if(eyeless_girl.y > player.sprite.y + 50 && eyeless_girl.y < player.sprite.y + 150)
                    eyeless_girl.frame = 11;
                else if(eyeless_girl.x < player.sprite.x)
                    eyeless_girl.frame = 8;
                else if(eyeless_girl.x > player.sprite.x)
                    eyeless_girl.frame = 5;
                
            }else if(player.sprite.position.x < 208 && player.sprite.position.x > 96 && player.sprite.position.y < 1344 && player.sprite.position.y > 1168 && !eyeless_following){
                eyeless_following = true;
            }
            
            if(eyeless_following && eyeless_girl.alive)
                this.transitionMusic(music,creepy_song);
            else
                this.transitionMusic(creepy_song,music);
            
            // check if player has entered the secret room
            if(player.sprite.position.x > 528 && player.sprite.position.x < 752 && player.sprite.position.y > 288 && player.sprite.position.y < 496){
            console.log('transition');
                this.transitionMusic(music, null);

            }else if(!creepy_song.isPlaying){

                this.transitionMusic(null, music);
            }

            console.log(player.inventory.contains('key1'));
            console.log(timer);
            if(player.inventory.contains('key1') && timer < 1){
                console.log('bman');
                blue_man.revive();
            }
            
            if(player.inventory.contains('key3') && eyeless_girl.alive){
                eyeless_girl.destroy();
                monster.revive();
            }
            
            
            
            if(blue_man.alive){
                this.game.physics.arcade.overlap(player.sprite,blue_man, this.lose, null, this);
                timer += 1;
                
                if(this.game.physics.arcade.overlap(player.sprite,blue_man, this.lose, null, this)){
                }else if(timer > 200){
                    blue_man.body.velocity.x = 300;
                    blue_man.animations.play('run_right');
                    if(!scary_sfx.isPlaying)
                        scary_sfx.play();
                }
                
                if(this.physics.arcade.collide(blue_man,layer1))
                    blue_man.destroy();
            }
                
            
            
        }
        
        
        this.game.physics.arcade.overlap(player.sprite, eyeless_girl, this.lose, null, this);

        
        this.game.physics.arcade.overlap(player.sprite, monster, this.lose, null, this);
        
    },
    
    monsterDie: function(extra,something){
        extra.destroy();
    },
    
   
    interact: function(){
        this.physics.arcade.overlap(player.sprite, player.inventory.getItemList(), player.addToInventory, null, player);
        this.physics.arcade.overlap(player.sprite, player.inventory.getDoorList(), player.openDoor, null, player);
    },
    
    quitGame: function (pointer) {
        monster= null; // monster varable
        map = null;
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
        blue_man = null;
        eyeless_following = false;
        eyeless_girl = null;
        creepy_song.stop();
        creepy_song = null;

        this.camera.follow(null);
        this.camera.setPosition(0,0);


        // Then let's go back to the main menu.
        this.game.state.start('Level_One');

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
        if(monster.position.x < player.position.x - 10){
            monster.animations.play('run_right');
        }
        else if(monster.position.x > player.position.x + 10){
            monster.animations.play('run_left');
        } 
        else if(monster.position.y > player.position.y + 10){
            monster.animations.play('run_up');
        }
        else if(monster.position.y < player.position.y - 10){
             monster.animations.play('run_down');
         }

        this.game.physics.arcade.moveToObject(monster,player, 150);
        
        
        //make monster music louder as he gets closer to player
                if(!music.isPlaying){
                        music.play('',0,1,true);
                        music.volume = 0;
                }

                if(music.volume <= 5){
                    music.volume += 0.01;
                }

    },
    
    
    createMonster: function(){
        var temp_monster = null;
        var start_x_position = 576;
        var start_y_position = 1296;
        
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
    
    
    
    win: function(extra){
        player.ableToMove = false;
        
        map = null;
        layer1= null;
        layer2= null;
        layer3= null; // map variables
        text = null;               // text for game over, win screen
        won = false;
        lost = false;  // win/lose variables
        monster_move_toggle = false;  // toggles when monster moves
        room_music.stop();
        chase_music.stop();
        
        
        sprint = 0;
        timer = 0;
        eyeless_following = false;
        creepy_song.stop();
        
        
        if(this.SimpleLighting.fadeOutAllLights()){
            
            console.log('change')
            this.game.state.start('Outro');
        }
        
        
    },
    
     lose: function(extra,monster){
        player.ableToMove = false;

        monster.body.velocity.x = 0;
        monster.body.velocity.y = 0;
        
        this.SimpleLighting.killAllLights();
        
        if(text == null){
            text = this.add.text(this.camera.x + 200, this.camera.y + 250, 'Game Over', { font: "65px Arial", fill: "#ff0044", align: "center" });
            text.alpha = 0;
            
                
            
        }
        
         // fade in text
        if(text.alpha <= 1){
            text.alpha += 0.002;
        }
        else
            this.quitGame(this);
    }
    


};