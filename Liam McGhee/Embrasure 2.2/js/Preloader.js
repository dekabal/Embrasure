BasicGame.Preloader = function (game) {

this.background = null;
this.preloadBar = null;

this.ready = false;

};

BasicGame.Preloader.prototype = {

preload: function () {

	// These are the assets we loaded in Boot.js
	// A nice sparkly background and a loading progress bar
	this.background = this.add.sprite(0, 0, 'preloaderBackground');
	this.preloadBar = this.add.sprite(300, 400, 'preloaderBar');

	// This sets the preloadBar sprite as a loader sprite.
	// What that does is automatically crop the sprite from 0 to full-width
	// as the files below are loaded in.
	this.load.setPreloadSprite(this.preloadBar);

	// Here we load the rest of the assets our game needs.
	// As this is just a Project Template I've not provided these assets, swap them for your own.
	this.load.image('titlepage', 'assets/imgs/title.png');
	//play button
	this.load.image('playButton','assets/imgs/play_simple.png');

	// Tilemaps
	this.load.tilemap('map','assets/tiled/otherworld2.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.tilemap('level-one','assets/tiled/level1_tilmap.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.tilemap('level_intro','assets/tiled/Intro.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.tilemap('floor_one','assets/tiled/First.json', null, Phaser.Tilemap.TILED_JSON);
	this.load.tilemap('floor_two','assets/tiled/floor_two.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level_intro2','assets/tiled/Intro2.json', null, Phaser.Tilemap.TILED_JSON);
    
    
	// music assets
	this.load.audio('overworld', 'assets/music/ambient_overworld.mp3');
	this.load.audio('room', 'assets/music/ambient_slender.mp3');
	this.load.audio('chase', 'assets/music/heartbeat-speeding-up-01.wav');
	this.load.audio('key_pickup', 'assets/music/Keys jangling sound effect.wav');
	this.load.audio('Scary-Titus_Calen-1449371204', 'assets/music/Scary-Titus_Calen-1449371204.mp3');
	this.load.audio('creepy_song', 'assets/music/Very_creepy_song.mp3');
    
    
    
    this.load.audio('wooden_door_open', 'assets/music/door-5-open.mp3');
    this.load.audio('wooden_door_close', 'assets/music/door-5-close.mp3');
    this.load.audio('wooden_door_slam', 'assets/music/door_slam.wav');
    this.load.audio('metal_door_open', 'assets/music/gated_door_open_2.mp3');
    this.load.audio('metal_door_close', 'assets/music/metal_door_close.wav');
    this.load.audio('metal_door_bar', 'assets/music/metal_door_bar.wav');
    this.load.audio('monster_get_up', 'assets/music/monster_get_up.wav');
    this.load.audio('metal_door_slam_open', 'assets/music/metal_door_slam_open.wav');
    this.load.audio('metal_door_stuck', 'assets/music/metal_door_stuck.wav');
    this.load.audio('crowbar_pick_up', 'assets/music/crowbar_pick_up.wav');
    this.load.audio('hammer_pick_up', 'assets/music/hammer_pick_up.wav');
    this.load.audio('bucket_pick_up', 'assets/music/bucket_pick_up.wav');
    this.load.audio('crate_break', 'assets/music/crate_break.wav');
    this.load.audio('pipe_hit_hammer', 'assets/music/pipe_hit_hammer.wav');
    this.load.audio('pipe_hit_nail', 'assets/music/pipe_hit_nail.wav');
    this.load.audio('bucket_fill', 'assets/music/bucket_fill.wav');
    this.load.audio('fuse_explode', 'assets/music/fuse_explode.wav');
    this.load.audio('dump_water', 'assets/music/dump_water.wav');
    this.load.audio('chase_music', 'assets/music/floor_one_chase_music.wav');
    this.load.audio('static', 'assets/music/static.wav');
    this.load.audio('generator_stall', 'assets/music/generator_stall.wav');
    this.load.audio('generator_running', 'assets/music/generator.mp3');
    this.load.audio('pour_gas', 'assets/music/pour_gas.wav');
    this.load.audio('gas_can_pickup', 'assets/music/gas_can_pickup.wav');
    this.load.audio('elevator_down', 'assets/music/elevator_down.wav');
    

    

},

create: function () {

// Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
this.preloadBar.cropEnabled = false;

},

update: function () {

// You don't actually need to do this, but I find it gives a much smoother game experience.
// Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
// You can jump right into the menu if you want and still play the music, but you'll have a few
// seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
// it's best to wait for it to decode here first, then carry on.

// If you don't have any music in your game then put the game.state.start line into the create function and delete
// the update function completely.

/*
if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
{
this.ready = true;
this.game.state.start('MainMenu');
}
*/
this.game.state.start('MainMenu');
}

};