BasicGame.Floor_One = function (game) {

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
var subtext = null;
var items;
var doors;
var sprint = 0;
var timer = 0;


BasicGame.Floor_One.prototype = {

    create: function () {

        // set-up world map
        map = this.add.tilemap('floor_one');
        map.addTilesetImage('elevator1_tileset');
        map.addTilesetImage('othersidebysteve32');


        layer1 = map.createLayer('floor');
        layer1.resizeWorld();

        layer2 = map.createLayer('Walls');
        layer2.resizeWorld();
        
        layer3 = map.createLayer('Layer 3');
        layer3.resizeWorld();

        
        this.background_music = this.add.audio('overworld');
        this.background_music.play();
        this.chase_music = this.add.audio('chase_music',1,false);
        this.static = this.add.audio('static');
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // set collisions
        map.setCollision([31,73,74,75,103,104,105,133,134,135,40,41,42,70,72,100,101,102,142,143,144,172,173,174,202,203,204,232,233,234,262,263], true, 'Walls');
        map.setCollision([31], true, 'Layer 3');

       
        this.stairs = this.game.add.sprite(1472,0,'up_stairs'); 
        this.game.physics.arcade.enableBody(this.stairs);
        this.stairs.body.checkCollision.up = false;
        this.stairs.body.checkCollision.left = false;
        this.stairs.body.checkCollision.right = false;
        this.stairs.body.setSize(this.stairs.body.width,this.stairs.body.height,40,0);
            
        this.stairs.body.immovable = true;
        
        
        
        this.faded_in = false;
        
        
        player = new Player(this, 'james', 800, 567, 1);

        player.inventory.createWorldItems([
            {x: 864,y: 640,scaleX:1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'crowbar'},
            {x: 160,y: 816,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'hammer'},
            {x: 1536,y: 480,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'bucket_empty'},
            {x: 1504,y: 288,scaleX: 1,scaleY: 1,offsetX: .3,offsetY: 0,spritename: 'pipe_one'},
            {x: 1248,y: 480,scaleX: 1.2,scaleY: 1.2,offsetX: 0,offsetY: 0,spritename: 'crate'},
            {x: 1344,y: 160,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 1.5,spritename: 'fuse_box'}
        ]);
        
        player.inventory.createWorldSetPieces([
            {x: 1504,y: 224,scaleX: .5,scaleY: 1,offsetX: .5,offsetY: 0,spritename: 'pipe_intersection'},
            {x: 1504,y: 288,scaleX: .5,scaleY: 1,offsetX: .5,offsetY: 0,spritename: 'pipe_one'},
            {x: 1504,y: 354,scaleX: .5,scaleY: 1,offsetX: .5,offsetY: 0,spritename: 'pipe_intersection'},
            {x: 1248,y: 480,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'crate'}
        ]);
        
        
        player.inventory.createWorldDoors([
            {x: 608,y: 64,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'door_normal32',barred: false},
            {x: 160,y: 352,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'door_normal32',barred: false},
            {x: 192,y: 352,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'door_normal32',barred: false},
            {x: 160,y: 928,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'door_normal_barbed32',barred: false},
            {x: 192,y: 928,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'door_normal_barbed32',barred: false},
            {x: 1376,y: 928,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: false},
            {x: 1408,y: 928,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: false},
            {x: 1376,y: 160,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: true},
            {x: 1408,y: 160,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: true},
            {x: 1312,y: 64,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: true},
            {x: 768,y: 928,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: true},
            {x: 800,y: 928,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: true},
            {x: 832,y: 928,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: true}
        ]);
        
        
            
            this.blue_man = this.game.add.sprite(32,1024,'blue_mask_man');
            this.blue_man.animations.add('run_down', [0,1,2], 5, true);
            this.blue_man.animations.add('run_left', [3,4,5], 5, true);
            this.blue_man.animations.add('run_right', [6,7,8], 5, true);
            this.blue_man.animations.add('run_up', [9,10,11], 5, true);
            this.game.physics.arcade.enableBody(this.blue_man);
            this.blue_man.kill();
            this.blue_man.running = false;
            this.rotation = 0;
        
            this.monsters = this.game.add.group();
            this.monsters.create(32,32,'monster');
            this.monsters.create(32,160,'monster');
            this.monsters.create(32,320,'monster');
            this.monsters.create(224,320,'monster');
            this.monsters.create(448,320,'monster');
            this.monsters.create(576,192,'monster');
            this.monsters.create(448,32,'monster');
            this.monsters.create(224,32,'monster');
            for(var i = 0; i < this.monsters.length; i++){
                this.game.physics.arcade.enableBody(this.monsters.getAt(i));
                this.monsters.getAt(i).animations.add('run_down', [0,1,2], 5, true);
                this.monsters.getAt(i).animations.add('run_left', [3,4,5], 5, true);
                this.monsters.getAt(i).animations.add('run_right', [6,7,8], 5, true);
                this.monsters.getAt(i).animations.add('run_up', [9,10,11], 5, true);
                this.monsters.getAt(i).kill();
            }

            
        
        // holder shadow properties and functions (shadow bitmapData, light group, game var)
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

        this.timer = 0;

    },

    update: function () {

        // player collision with environment
        this.physics.arcade.collide(player.sprite,layer2);
        this.physics.arcade.collide(player.sprite,layer3);
        this.physics.arcade.collide(player.sprite, player.inventory.getSetPieceList());
        this.physics.arcade.collide(player.sprite, player.inventory.getDoorSetPieceList());
        
        this.physics.arcade.collide(this.blue_man,layer1);
        this.physics.arcade.collide(this.blue_man,layer2);
        this.physics.arcade.collide(this.blue_man,layer3);
        this.physics.arcade.collide(this.blue_man, player.inventory.getDoorSetPieceList(),player.inventory.breakDoor,null,player.inventory);
        this.physics.arcade.overlap(player.sprite, this.blue_man, this.lose, null, this);
        
        this.physics.arcade.collide(player.sprite,this.stairs);
        this.physics.arcade.overlap(player.sprite,this.stairs,this.win,null,this);
        
        
        

        player.inventory.render();
        
        // Update the shadow texture each frame
    	this.SimpleLighting.updateShadowTexture();
        
        
        if(!this.faded_in){
            if(this.SimpleLighting.fadeInAllLights())
                this.faded_in = true;
        }
            
        
        // Update player position
        player.movePlayer();
            
        
        if(player.sprite.position.x >= 384 && player.sprite.position.x <= 416 && player.sprite.position.y >= 960 && player.sprite.position.y <= 1088){
            player.inventory.closeAndBar(3);
            player.inventory.closeAndBar(4);
            
        }
        
        if(player.sprite.position.x >= 0 && player.sprite.position.x <= 416 && player.sprite.position.y >= 0 && player.sprite.position.y <= 352){
            
            if(this.timer == 0){
                player.toggleFlashlight();
                this.timer++;
            }
            else if (this.timer < 200){
                this.transitionMusic(this.background_music,null);
                this.timer++;
                if(this.timer == 200){
                    
                    this.monsters.forEach(function(item) {
                        item.revive();
                    });
                    
                    player.toggleFlashlight();
                    this.static.play();
                }
                    
            }else if(this.monsters.countDead() != 8){
                for(var i = 0; i < this.monsters.length; i++){
                    if(this.monsters.getAt(i).position.x < player.sprite.position.x - 10){
                    this.monsters.getAt(i).animations.play('run_right');
                    }
                    else if(this.monsters.getAt(i).position.x > player.sprite.position.x + 10){
                        this.monsters.getAt(i).animations.play('run_left');
                    } 
                    else if(this.monsters.getAt(i).position.y > player.sprite.position.y + 10){
                        this.monsters.getAt(i).animations.play('run_up');
                    }
                    else if(this.monsters.getAt(i).position.y < player.sprite.position.y - 10){
                        this.monsters.getAt(i).animations.play('run_down');
                    }

                    this.game.physics.arcade.moveToObject(this.monsters.getAt(i),player.sprite, 200);
                    if(this.physics.arcade.overlap(player.sprite, this.monsters.getAt(i)))
                        this.monsters.getAt(i).kill();
                }
                console.log(this.monsters.countDead);
            }

        }
        
        if(player.sprite.position.x >= 0 && player.sprite.position.x <= 384 && player.sprite.position.y >= 544 && player.sprite.position.y <= 928)
            this.transitionMusic(null,this.background_music);
        
        
        if(player.sprite.position.x >= 32 && player.sprite.position.x <= 576 && player.sprite.position.y >= 992 && player.sprite.position.y <= 1056){
            this.transitionMusic(this.background_music,null);
        }
        
        if(player.sprite.position.x >= 1248 && player.sprite.position.x <= 1536 && player.sprite.position.y >= 224 && player.sprite.position.y <= 896){
            if(!this.chase_music.isPlaying)
                this.transitionMusic(this.chase_music,this.background_music);
        }
        
        
        if(player.sprite.position.x >= 608 && player.sprite.position.x <= 1536 && player.sprite.position.y >= 992 && player.sprite.position.y <= 1056){
            if(!this.blue_man.running)
                this.blue_man.running = true;
            if(!this.blue_man.isAlive)
                this.blue_man.revive();
            this.transitionMusic(null,this.chase_music)
            console.log('blue');
        }
        
        if(this.blue_man.running){
            this.game.physics.arcade.moveToObject(this.blue_man,player.sprite, 250);
            this.blue_man.animations.play('run_right');
        }
        
        
        
        
    },
    
    
    interact: function(){
        
        this.physics.arcade.overlap(player.sprite, player.inventory.getItemList(), player.addToInventory, null, player);
        this.physics.arcade.overlap(player.sprite, player.inventory.getDoorList(), player.openDoor, null, player);
        
    },
    

    quitGame: function (pointer) {
        map= null;
        layer1= null;
        layer2= null;
        layer3= null; // map variables
        text = null;               // text for game over, win screen
        won = false;
        lost = false;  // win/lose variables
        monster_move_toggle = false;  // toggles when monster moves
        this.background_music.stop();
        this.chase_music.stop();
        items = null;
        
        sprint = 0;
        timer = 0;
        blue_man = null;

        this.camera.follow(null);
        this.camera.setPosition(0,0);


        // Then let's go back to the main menu.
        this.game.state.start('Floor_One');

    },
    
    

    //transition from music1 to music 2
    transitionMusic: function(music1, music2){
         // transition music from background to secret room music
        
        if(music1 == null && music2 != null){
            if(!music2.isPlaying){
                        music2.play();
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
                        music2.play();
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
    
    
    win: function(extra){
        player.ableToMove = false;
        
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
        
        
        if(this.SimpleLighting.fadeOutAllLights()){
            
            console.log('change')
            this.game.state.start('Level_One');
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
            
            if(extra.position.x >= 1280 && extra.position.x <= 1536 && extra.position.y >= 992 && extra.position.y <= 1056){
                subtext = this.add.text(this.camera.x + 150, this.camera.y + 350, '"I wish I had something to pry open the door"', { font: "25px Arial", fill: "#ff0044", align: "center" });
                subtext.alpha = 0;
            }
            else if(extra.position.x >= 1248 && extra.position.x <= 1536 && extra.position.y >= 224 && extra.position.y <= 896){
                subtext = this.add.text(this.camera.x + 250, this.camera.y + 350, '"I wish I had barred the door"', { font: "25px Arial", fill: "#ff0044", align: "center" });
                subtext.alpha = 0;
            }
                
            
        }
        
         // fade in text
        if(text.alpha <= 1){
            text.alpha += 0.002;
            if(subtext != null)
                subtext.alpha += 0.002;
        }
        else
            this.quitGame(this);
    }
    


};