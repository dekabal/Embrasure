function ItemManager(player, game){
    this.game = game;
    this.items = game.add.group();
    this.setPieces = game.add.group();
    this.player = player;
};

ItemManager.prototype = {

    createItem: function(x, y, scaleX, scaleY, offsetX, offsetY, spriteName){
        var temp_item = this.game.add.sprite(x,y,spriteName); 
        this.game.physics.arcade.enableBody(temp_item);
        temp_item.body.setSize(temp_item.body.width*scaleX, temp_item.body.height*scaleY,temp_item.body.width*offsetX,temp_item.body.height*offsetY);
        
        this.items.add(temp_item);
    },
    
    createSetPiece: function(x, y, scaleX, scaleY, offsetX, offsetY, spriteName){
        var temp_item = this.game.add.sprite(x,y,spriteName); 
        this.game.physics.arcade.enableBody(temp_item);
        temp_item.body.setSize(temp_item.body.width*scaleX, temp_item.body.height*scaleY,temp_item.body.width*offsetX,temp_item.body.height*offsetY);
        temp_item.body.immovable = true;
        
        this.setPieces.add(temp_item);
    },
    
    modifyItem: function(item){
        if(item.key == 'pipe_one'){
            item.kill();
            this.createItem(item.position.x,item.position.y, 1, 1, .3, 0,'pipe_broken');
            
        }
        
    },
    
    
    getItemGroup: function(){
        return this.items;
    },
    
    getSetPieceGroup: function(){
        return this.setPieces;
    },
    

};