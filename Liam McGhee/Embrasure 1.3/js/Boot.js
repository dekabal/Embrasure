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
        
    // key assets
    this.load.image('key1', 'assets/imgs/keys/key1.png');
    this.load.image('key2', 'assets/imgs/keys/key2.png');
    this.load.image('key3', 'assets/imgs/keys/key3.png');
        
    // door assets
    this.load.image('door_gated', 'assets/imgs/doors/door_gated.png');
    this.load.audio('gated_door_open', 'assets/music/gated_door_open_2.wav');
    this.load.image('metal_door','assets/imgs/doors/metal_door.png');
    this.load.image('door_normal','assets/imgs/doors/door_normal.png');
 this.load.image('door_normal_barbed','assets/imgs/doors/door_normal_barbed.png');  
    this.load.image('metal_door_four','assets/imgs/doors/metal_door_four.png');
    this.load.image('metal_door32','assets/imgs/doors/door_metal32.png');
    
    // map assets
    this.load.tilemap('map','assets/tiled/otherworld2.json', null, Phaser.Tilemap.TILED_JSON);
this.load.image('otherworld','assets/imgs/othersidebysteve_edit1.png',16,16);
        this.load.image('othersidebysteve32','assets/imgs/othersidebysteve32.png',32,32);
        this.load.image('othersidebysteve_edit1','assets/imgs/othersidebysteve32.png',32,32);
        
    this.load.image('chains','assets/imgs/chainlinkpagerusty.png',16,16);
        this.load.tilemap('level-one','assets/tiled/level1_tilmap.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('level_intro','assets/tiled/IntroLevel.json', null, Phaser.Tilemap.TILED_JSON);
        this.load.tilemap('floor_one','assets/tiled/FirstFloor.json', null, Phaser.Tilemap.TILED_JSON);
        
    
        
    // monster assets
    this.load.spritesheet('monster','assets/imgs/armless1_2.png',32,32);
    this.load.spritesheet('blue_mask_man','assets/imgs/blue_mask_man.png',32,32);
        this.load.spritesheet('eyeless_girl','assets/imgs/eyeless_girl.png',32,32);
    
    // music assets
    this.load.audio('overworld', 'assets/music/ambient_overworld.mp3');
    this.load.audio('room', 'assets/music/ambient_slender.mp3');
    this.load.audio('chase', 'assets/music/heartbeat-speeding-up-01.wav');
    this.load.audio('key_pickup', 'assets/music/Keys jangling sound effect.wav');
    this.load.audio('wooden_door', 'assets/music/key-door-insert-1.mp3');
    this.load.audio('Scary-Titus_Calen-1449371204', 'assets/music/Scary-Titus_Calen-1449371204.mp3');
    this.load.audio('creepy_song', 'assets/music/Very_creepy_song.mp3');

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