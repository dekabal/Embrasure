function Sokoban(offX,offY,moveableObjects,game){
	this.OffsetX = offX;
	this.OffsetY = offY;
	this.objectSize = 64;
	this.game = game;
	this.spriteLocations = moveableObjects
	this.spriteList = [];

	this.initalizeImages();

};

Sokoban.prototype = {
	initalizeImages : function(){
		this.spriteLocations.forEach(function(xy){
			var tempObj = this.game.add.sprite(this.OffsetX + (xy.x * 32),this.OffsetY + (xy.y * 32),'boulder');
			tempObj.visible = false;
			this.game.physics.enable(tempObj, Phaser.Physics.ARCADE);
			console.log(tempObj);
			tempObj.body.moves = false;
			tempObj.body.blocked.up = true;
			tempObj.body.blocked.down = true;
			tempObj.body.blocked.left = true;
			tempObj.body.blocked.right - true;

			tempObj.inputEnabled = true;
			tempObj.input.enableSnap(this.objectSize,this.objectSize);
			this.spriteList.push(tempObj);
		},this);
	},
	render : function(){
		if(this.game.Level.currentLayer.layer.name === 'Tile Layer 2'){
			for(var i = 0; i < this.spriteList.length;i++){
				this.spriteList[i].visible = true;
				this.spriteList[i].bringToTop();
				this.game.physics.arcade.collide(this.game.player,this.spriteList[i],this.bump,null,this);
				this.game.physics.arcade.collide(this.spriteList[i],this.game.Level.currentLayer);

			}
		}
		else{
			this.spriteList.forEach(function(sprite){
				sprite.visible = false;
			},this);
		}

	},

	bump : function(obj1, obj2){
		var tween;
		if(obj2.body.touching.up === true){
			console.log("move down");
			this.game.player.body.velocity.x = 0;
			this.game.player.body.velocity.y = 0;
			//this.game.input.disabled = true
			tween = this.game.add.tween(obj2).to({y:obj2.y + this.objectSize}, 1000, Phaser.Easing.Linear.None,true,0,0,false);

			tween.onComplete.add(function(){
				obj2.y = Math.round(obj2.y/this.objectSize)*this.objectSize;
			}, this);
		}
		else if(obj2.body.touching.down === true){
			console.log("move up");
			this.game.player.body.velocity.x = 0;
			this.game.player.body.velocity.y = 0;
			//this.game.input.disabled = true
			tween = this.game.add.tween(obj2).to({y:obj2.y - this.objectSize}, 1000, Phaser.Easing.Linear.None,true,0,0,false);

			tween.onComplete.add(function(){
				obj2.y = Math.round(obj2.y/this.objectSize)*this.objectSize;
			}, this);
		}
		if(obj2.body.touching.left === true){
			console.log("move right");
			this.game.player.body.velocity.x = 0;
			this.game.player.body.velocity.y = 0;
			//this.game.input.disabled = true
			tween = this.game.add.tween(obj2).to({x:obj2.x + this.objectSize}, 1000, Phaser.Easing.Linear.None,true,0,0,false);

			tween.onComplete.add(function(){
				obj2.x = Math.round(obj2.x/this.objectSize)*this.objectSize;
			}, this);
		}	
		else if(obj2.body.touching.right === true){
			console.log("move left");
			this.game.player.body.velocity.x = 0;
			this.game.player.body.velocity.y = 0;
			//this.game.input.disabled = true
			tween = this.game.add.tween(obj2).to({x:obj2.x - this.objectSize}, 1000, Phaser.Easing.Linear.None,true,0,0,false);

			tween.onComplete.add(function(){
				obj2.x = Math.round(obj2.x/this.objectSize)*this.objectSize;
			}, this);
		}
	}
};