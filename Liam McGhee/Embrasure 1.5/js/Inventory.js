function Inventory(x,y,game){
	this.inventoryX = x;
	this.inventoryY = y;

	this.game = game;

	this.inventoryGridOffsetX = 800 - 171;
	this.inventoryGridOffsetY = 600 - 171;

	this.inventorySpaceOffsetX = 59;
	this.inventorySpaceOffsetY = 59;

	this.itemsList = [];
	this.inventoryList = [];

	this.inventoryButton = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
	this.inventoryButton.onDown.add(this.toggleInventory,this);

	this.inventory = this.game.add.sprite(this.inventoryGridOffsetX, this.inventoryGridOffsetY,'inventory');
	this.inventory.scale.setTo(1.5,1.5);
	this.inventory.visible = false;

	this.initialize();
}

Inventory.prototype = {
	initialize : function(){
        /*
		this.itemsList.push((new Item(this.game, 300,100,6)));
		this.itemsList.push((new Item(this.game, 400,500,3)));
		this.itemsList.push((new Item(this.game, 50,400,7)));
		this.itemsList.push((new Item(this.game, 100,300,2)));
		this.itemsList.push((new Item(this.game, 268,325,1)));
		this.itemsList.push((new Item(this.game, 100,87,8)));		
		//this.game.physics.enable(this.tempItem);
		this.itemsList.forEach(function(item){
			this.game.physics.enable(item, Phaser.Physics.ARCADE);
		},this);
        */

	},
	addToInventory : function(i){
		this.inventoryList.push(i);
	},
	pickUpItem : function(obj1, obj2){
		console.log("SDF");
	},
	toggleInventory : function(){
		//console.log("THIS IS WORKING?");
		this.inventory.visible = !this.inventory.visible;
		//this.inventory.bringToTop();
		//console.log(this.inventory);
		this.inventoryList.forEach(function(item){
			item.visible = !item.visible;
			item.bringToTop();
		},this);
        

	},
	render : function(){

		this.inventory.x = this.inventoryGridOffsetX + this.game.camera.x;
		this.inventory.y = this.inventoryGridOffsetY + this.game.camera.y;
		var x = 0;
		var y = -1;
		for(var i = 0; i < this.inventoryList.length; i++){
			if(i % 3 === 0){x = 0; y++;}
			this.inventoryList[i].x = this.inventoryGridOffsetX + 7 + this.game.camera.x + this.inventorySpaceOffsetX * x;
			this.inventoryList[i].y = this.inventoryGridOffsetY + 10 + this.game.camera.y + this.inventorySpaceOffsetY * y;
			x++;
			
		}
	}
};


function Item(game,x,y,index){
	//Phaser.Sprite.call(this,game, x, y, 'items2', index);
	this.item = game.add.sprite(x,y,'items2',index);
	//this.item.anchor.setTo(.5,.5);
}
//Item.prototype = Object.create(Phaser.Sprite.prototype);
Item.prototype = {};