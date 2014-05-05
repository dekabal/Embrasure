function Inventory(x,y,game){
	this.inventoryX = x;
	this.inventoryY = y;

	this.game = game;

	this.inventoryGridOffsetX = 800 - 171;
	this.inventoryGridOffsetY = 600 - 171;

	this.inventorySpaceOffsetX = 55;
	this.inventorySpaceOffsetY = 55;

	this.itemsList = game.add.group();
    this.setPieceList = game.add.group();
    this.doorList = game.add.group();
    this.doorSetPieces = game.add.group();
	this.inventoryList = [];

	this.inventoryButton = this.game.input.keyboard.addKey(Phaser.Keyboard.I);
	this.inventoryButton.onDown.add(this.toggleInventory,this);

	this.inventory = this.game.add.sprite(this.inventoryGridOffsetX, this.inventoryGridOffsetY,'inventory');
	this.inventory.scale.setTo(1.5,1.5);
	this.inventory.visible = false;
    
    
    this.wooden_door_open = game.add.audio('wooden_door_open',1,false);
    this.wooden_door_close = game.add.audio('wooden_door_close',1,false);
    this.wooden_door_slam = game.add.audio('wooden_door_slam',1,false);
    this.wooden_door_slam.played = false;
    this.metal_door_open = game.add.audio('metal_door_open',1,false);
    this.metal_door_close = game.add.audio('metal_door_close',1,false);
    this.metal_door_bar = game.add.audio('metal_door_bar',1,false);
    this.monster_get_up = game.add.audio('monster_get_up',1,false);
    this.metal_door_slam_open = game.add.audio('metal_door_slam_open',1,false);
    this.metal_door_stuck = game.add.audio('metal_door_stuck',1,false);
    this.crowbar_pick_up = game.add.audio('crowbar_pick_up',1,false);
    this.hammer_pick_up = game.add.audio('hammer_pick_up',1,false);
    this.bucket_pick_up = game.add.audio('bucket_pick_up',1,false);
    this.crate_break = game.add.audio('crate_break',1,false);
    this.pipe_hit_hammer = game.add.audio('pipe_hit_hammer',1,false);
    this.pipe_hit_nail = game.add.audio('pipe_hit_nail',1,false);
    this.bucket_fill = game.add.audio('bucket_fill',1,false);
    this.fuse_explode = game.add.audio('fuse_explode',1,false);
    this.dump_water = game.add.audio('dump_water',1,false);

}

Inventory.prototype = {
    
	createWorldItems: function(items){
        for(var i = 0; i < items.length; i++){
            var temp_item = this.game.add.sprite(items[i].x,items[i].y,items[i].spritename); 
            this.game.physics.arcade.enableBody(temp_item);
            temp_item.body.setSize(temp_item.body.width*items[i].scaleX, temp_item.body.height*items[i].scaleY,temp_item.body.width*items[i].offsetX,temp_item.body.height*items[i].offsetY); 
            this.itemsList.add(temp_item);
        }
        

	},
    
    createWorldSetPieces: function(items){
        for(var i = 0; i < items.length; i++){
            var temp_item = this.game.add.sprite(items[i].x,items[i].y,items[i].spritename); 
            this.game.physics.arcade.enableBody(temp_item);
            temp_item.body.setSize(temp_item.body.width*items[i].scaleX, temp_item.body.height*items[i].scaleY,temp_item.body.width*items[i].offsetX,temp_item.body.height*items[i].offsetY); 
            
            temp_item.body.immovable = true;
            
            this.setPieceList.add(temp_item);
        }
        

	},
    
    createWorldDoors: function(doors){
        for(var i = 0; i < doors.length; i++){
            var temp_door1 = this.game.add.sprite(doors[i].x,doors[i].y,doors[i].spritename); 
            this.game.physics.arcade.enableBody(temp_door1);
            temp_door1.body.setSize(temp_door1.body.width*doors[i].scaleX, temp_door1.body.height*doors[i].scaleY,temp_door1.body.width*doors[i].offsetX,temp_door1.body.height*doors[i].offsetY); 
            
            temp_door1.body.immovable = true;
            
            this.doorSetPieces.add(temp_door1);
            
            var temp_door2 = this.game.add.sprite(doors[i].x,doors[i].y,doors[i].spritename); 
            this.game.physics.arcade.enableBody(temp_door2);
            temp_door2.body.setSize(temp_door2.body.width*1.4, temp_door2.body.height*1.4,-(temp_door2.body.width*.2),-(temp_door2.body.height*.2)); 
            
            temp_door2.bar = false;
            temp_door2.barred = doors[i].barred;
            
            this.doorList.add(temp_door2);
        }
    },
    
    openDoor: function(door){
        console.log('inside');
        
        if((this.doorList.getIndex(door) == 5 || this.doorList.getIndex(door) == 6) && this.game.state.current == 'Floor_One'){
           if(this.contains('crowbar')){
               if(door.bar){
                    this.metal_door_bar.play();    
                    this.removeFromInventory('crowbar');
                    this.doorList.getAt(5).barred = true;
                    this.doorList.getAt(6).barred = true;
               }else{
                   this.metal_door_open.play();
                   door.bar = false;
                    door.visible = false;
                this.doorSetPieces.getAt(this.doorList.getIndex(door)).kill();
               }
           }else if(!this.metal_door_bar.isPlaying)
               this.metal_door_stuck.play();
            
        }
        else if(!door.barred){
                this.wooden_door_open.play();
                door.bar = false;
                door.visible = false;
                this.doorSetPieces.getAt(this.doorList.getIndex(door)).kill();
            
        }else{
            this.metal_door_stuck.play();
        }
    },
    
    closeDoor: function(door){
        if((this.doorList.getIndex(door) == 5 || this.doorList.getIndex(door) == 6) && this.game.state.current == 'Floor_One'){
                this.metal_door_close.play();
                door.bar = true;
                door.visible = true;
            this.doorSetPieces.getAt(this.doorList.getIndex(door)).revive();
            
        }else if (!door.barred){
            this.wooden_door_close.play();
            door.visible = true;
            this.doorSetPieces.getAt(this.doorList.getIndex(door)).revive();

        }
    },
    
    closeAndBar: function(doorNumber){
        if(!this.wooden_door_slam.played){
            this.wooden_door_slam.played = true;
            this.wooden_door_slam.play();
        }
        this.doorList.getAt(doorNumber).visible = true;
        this.doorSetPieces.getAt(doorNumber).revive();
        
        this.doorList.getAt(doorNumber).barred = true;
        this.doorSetPieces.getAt(doorNumber).barred = true;
        
    },
    
    breakDoor: function(player,door){
        if (this.doorList.getAt(5).barred && this.doorList.getAt(6)){
            player.kill();
            this.monster_get_up.play();
                    
        }else{
            this.doorList.getAt(5).kill();
            this.doorList.getAt(6).kill();
            
            this.doorSetPieces.getAt(5).kill();
            this.doorSetPieces.getAt(6).kill();
            
            this.metal_door_slam_open.play();
        }
    },
    
    getItemList: function(){
        return this.itemsList;
    },
    
    getSetPieceList: function(){
        return this.setPieceList;
    },
    
    getDoorList: function(){
        return this.doorList;
    },
    
    getDoorSetPieceList: function(){
        return this.doorSetPieces;
    },
    
    specialInstruction: function(item){
        if(item.key == 'generator'){
            
            
        }
        else if(item.key == 'pipe_one'){
            if(this.contains('hammer') && this.contains('nail')){
                item.kill();
                this.createWorldItems([{x: item.position.x,y: item.position.y, scaleX: 1, scaleY: 1, offsetX: .3, offsetY: 0,spritename: 'pipe_broken'}]);
                this.pipe_hit_nail.play()
            }else
                this.pipe_hit_hammer.play();
            return true;
        }
        else if(item.key == 'pipe_broken'){
            if(this.contains('bucket_empty') && !this.contains('bucket_full')){
                console.log('inside SI');
                this.removeFromInventory('bucket_empty');
                this.addToInventory(this.game.add.sprite(0,0,'bucket_full'));
                this.bucket_fill.play();
            }
            
            return true;
        }
        else if(item.key == 'crate'){
            if(this.contains('hammer')){
                item.kill();
                this.setPieceList.getAt(3).destroy();
                this.addToInventory(this.game.add.sprite(0,0,'nail'));
            }
            
            return true;
        }
        else if(item.key == 'fuse_box'){
            if(this.contains('bucket_full')){
                this.removeFromInventory('bucket_full');
                this.addToInventory(this.game.add.sprite(0,0,'bucket_empty'));
                this.doorList.getAt(7).barred = false;
                this.doorList.getAt(8).barred = false;
                this.dump_water.play();
                this.fuse_explode.play();
            }
            
            return true;
        }
        
        return false;
        
    },
    
    contains: function(key){
        for(var i = 0; i < this.inventoryList.length; i++){
            if(this.inventoryList[i].key == key){
                return true;
            }
        }
      
        return false;
    },
    
	addToInventory: function(item){
        console.log(item.key);
        var temp_item = this.game.add.sprite(item.x,item.y,item.key);
        item.destroy();
        temp_item.visible = this.inventory.visible;
        temp_item.scale.setTo(1.50,1.50);
        temp_item.bringToTop();
        this.inventoryList.push(temp_item);
        
        if(item.key == 'crowbar')
            this.crowbar_pick_up.play();
        else if(item.key == 'hammer')
            this.hammer_pick_up.play();
        else if(item.key == 'bucket_empty')
            this.bucket_pick_up.play();
        else if(item.key == 'nail')
            this.crate_break.play();
	},
    
    removeFromInventory: function(key){
        console.log('inside remove');
        this.inventoryList.forEach(function(item){
			if(item.key == key){
                item.destroy();
                 this.inventoryList.splice( this.inventoryList.indexOf(item),1)
            }
		},this);

    },
    
        
	pickUpItem: function(obj1, obj2){
		console.log("SDF");
	},
	toggleInventory : function(){
		//console.log("THIS IS WORKING?");
		this.inventory.visible = !this.inventory.visible;
		this.inventory.bringToTop();
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