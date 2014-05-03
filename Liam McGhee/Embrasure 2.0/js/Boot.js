BasicGame = {};

BasicGame.Boot = function (game) {

};

BasicGame.Boot.prototype = {

    preload: function () {

        // Here we load the assets required for our preloader (in this case a background and a loading bar)
        this.load.image('preloaderBackground', 'assets/imgs/dark_test.png');
        this.load.image('preloaderBar', 'assets/imgs/preloader_bar.png');
        
        
        // player sprite
    	this.load.spritesheet('james','assets/imgs/james.png',32,32);
    	this.load.spritesheet('james2','assets/imgs/james2.png',16,16);
    
   		// lighting system assets
   		this.load.image('darkness', 'assets/imgs/dark.png');
    	this.load.spritesheet('light', 'assets/imgs/lightBoth_test2.png', 800, 600);
    	this.load.spritesheet('title_light', 'assets/imgs/light2_scaled.png', 800, 600);
        
        
        //Intro Level Item Assets
        this.load.image('bucket_empty', 'assets/imgs/floor_one/items/bucket_empty.png');
        this.load.image('bucket_full', 'assets/imgs/floor_one/items/bucket_full.png');
        this.load.image('crate', 'assets/imgs/floor_one/items/crate1.png');
        this.load.image('crowbar', 'assets/imgs/floor_one/items/crowbar.png');
        this.load.image('electric_panel', 'assets/imgs/floor_one/items/electric_panel.png');
        this.load.image('hammer', 'assets/imgs/floor_one/items/hammer1.png');
        this.load.image('nail', 'assets/imgs/floor_one/items/nail.png');
        this.load.image('pipe_broken', 'assets/imgs/floor_one/items/pipe_h_l_broken.png');
        this.load.image('pipe_one', 'assets/imgs/floor_one/items/pipe_h_l.png');
        this.load.image('pipe_intersection', 'assets/imgs/floor_one/items/pipe_h_l_v.png');
        this.load.image('pipe_small', 'assets/imgs/floor_one/items/pipe_l_v.png');
        this.load.image('stairs_up', 'assets/imgs/floor_one/items/stairs_up_right.png');
        this.load.image('generator', 'assets/imgs/floor_intro/items/generator.png');
        
        
        // inventory box
        this.load.image('inventory','assets/imgs/inventory2.png');
        
    	// key assets
    	this.load.image('key1', 'assets/imgs/keys/key1.png');
    	this.load.image('key2', 'assets/imgs/keys/key2.png');
    	this.load.image('key3', 'assets/imgs/keys/key3.png');
        
        // fuse box
        this.load.image('fuse_box', 'assets/imgs/floor_one/items/electric_panel.png');
        
    	// door assets
    	this.load.image('door_gated', 'assets/imgs/doors/door_gated.png');
    
    	this.load.image('metal_door','assets/imgs/doors/metal_door.png');
    	this.load.image('door_normal','assets/imgs/doors/door_normal.png');
 		this.load.image('door_normal_barbed','assets/imgs/doors/door_normal_barbed.png');  
    	this.load.image('metal_door_four','assets/imgs/doors/metal_door_four.png');
    	
        
        // 32 Bit Doors
        this.load.image('metal_door32','assets/imgs/doors/door_metal32.png');
        this.load.image('door_normal32','assets/imgs/doors/door_normal32.png');
 this.load.image('door_normal_barbed32','assets/imgs/doors/door_normal_barbed32.png');
    
    	// map assets
		this.load.image('otherworld','assets/imgs/othersidebysteve_edit1.png',16,16);
    	this.load.image('othersidebysteve32','assets/imgs/othersidebysteve32.png',32,32);
        
    	this.load.image('chains','assets/imgs/chainlinkpagerusty.png',16,16);
        
    
        
    	// monster assets
    	this.load.spritesheet('monster','assets/imgs/armless1_2.png',32,32);
    	this.load.spritesheet('blue_mask_man','assets/imgs/blue_mask_man.png',32,32);
    	this.load.spritesheet('eyeless_girl','assets/imgs/eyeless_girl.png',32,32);
    
    
    },

    create: function () {
        
        // Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
        this.game.input.maxPointers = 1;

        // Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
        this.game.stage.disableVisibilityChange = true;

        if (this.game.device.desktop)
        {
            // If you have any desktop specific settings, they can go in here
            this.game.stage.scale.pageAlignHorizontally = true;
        }
        else
        {
            // Same goes for mobile settings.
            // In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
            this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
            this.game.stage.scale.minWidth = 480;
            this.game.stage.scale.minHeight = 260;
            this.game.stage.scale.maxWidth = 1024;
            this.game.stage.scale.maxHeight = 768;
            this.game.stage.scale.forceLandscape = true;
            this.game.stage.scale.pageAlignHorizontally = true;
            this.game.stage.scale.setScreenSize(true);
        }

        // By this point the preloader assets have loaded to the cache, we've set the game settings
        // So now let's start the real preloader going
        this.game.state.start('Preloader');

    }

};