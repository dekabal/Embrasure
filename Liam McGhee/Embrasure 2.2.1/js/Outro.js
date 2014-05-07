BasicGame.Outro = function (game) {

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

BasicGame.Outro.prototype = {
	
    create: function () {

		//this.mapGroup = this.game.add.group();
		
        // set-up world map
        map = this.game.add.tilemap('level_intro2');
        map.addTilesetImage('elevator1_tileset');
        map.addTilesetImage('othersidebysteve32');
        

        // layers for doing sprite overlay
        layer1 = map.createLayer('Floor');
        layer1.resizeWorld();

        layer2 = map.createLayer('Walls');
        layer2.resizeWorld();
        
        layer3 = map.createLayer('Objects');
        layer3.resizeWorld();
        
        
        

        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        // set collisions
 map.setCollision([31,73,74,75,103,104,105,133,134,135,40,41,42,70,72,100,101,102,142,143,144,172,173,174,202,203,204,232,233,234,262,263], true, 'Walls');
        map.setCollision([31], true, 'Objects');
        
        
        
        player = new Player(this, 'james', 1536, 64, 1); 
        
        player.inventory.createWorldSetPieces([
            {x: 1440,y: 32,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'down_stairs'}
        ]);
        
        
        player.inventory.createWorldDoors([
            {x: 832,y: 160,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: false},
            {x: 384,y: 416,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: false},
            {x: 416,y: 416,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: false},
            {x: 800,y: 992,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: false},
            {x: 832,y: 992,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'metal_door32',barred: false}
        ]);
       
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


        this.faded_in = false;
        this.text = null;
        

    },

    update: function () {

    // player collision with environment
        this.physics.arcade.collide(player.sprite,layer1);
        this.game.physics.arcade.overlap(player.sprite, layer2);
        this.physics.arcade.overlap(player.sprite,layer2);
        this.physics.arcade.collide(player.sprite,layer3);
        this.physics.arcade.collide(player.sprite, player.inventory.getSetPieceList());
        this.physics.arcade.collide(player.sprite, player.inventory.getDoorSetPieceList());
        
        player.inventory.render();
        
        this.SimpleLighting.updateShadowTexture();
        
        player.movePlayer();
        
        if(!this.faded_in){
            if(this.SimpleLighting.fadeInAllLights())
                this.faded_in = true;
        }
            
        if(player.sprite.position.x >= 864 && player.sprite.position.x <= 992 && player.sprite.position.y >= 0 && player.sprite.position.y <= 416){
            player.inventory.removeWorldSetPiece('down_stairs');
            player.inventory.createWorldSetPieces([
                {x: 1440,y: 32,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'covered_crate'},
                {x: 1508,y: 32,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'covered_crate'},
                {x: 1508,y: 96,scaleX: 1,scaleY: 1,offsetX: 0,offsetY: 0,spritename: 'covered_crate'}
            ]);
        }
        
        if(player.sprite.position.x >= 800 && player.sprite.position.x <= 832 && player.sprite.position.y >= 1056 && player.sprite.position.y <= 1088){
            this.win(player.sprite);
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
        music.stop();
        room_music.stop();
        
        sprint = 0;
        timer = 0;

        this.camera.follow(null);
        this.camera.setPosition(0,0);


        // Then let's go back to the main menu.
        this.game.state.start('Intro2');

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
    
    
    win: function(extra){
        extra.body.velocity.x = 0;
        extra.body.velocity.y = 0;
        
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
        
        
        if(this.SimpleLighting.fadeOutAllLights()){
            if(this.text == null){
                this.text = this.add.text(this.camera.x + 200, this.camera.y + 250, 'Was It Really\n Even There?', { font: "65px Arial", fill: "#ff0044", align: "center" });
                this.text.alpha = 0;

        }
        
            // fade in text
            if(this.text.alpha <= 1)
                this.text.alpha += 0.002;
            else
                this.game.state.start('MainMenu');
        }
        
        
        
    },
    


};