function ItemManager(game){
    this.game = game;
    this.items = [];
};

ItemManager.prototype = {

    createItem: function(x,y,spriteName){
        this.item[spriteName] = this.game.add.sprite(x,y,spriteName);
        this.game.physics.arcade.enableBody(this.item[spriteName]);
        this.item[spriteName].body.setSize(this.item[spriteName].body.width + 10, this.item[spriteName].body.height + 10,0,0);
    },
    
    aquireItem: function(player, item){
        this.items[item].kill();
        player.addToInventory(item,item.key);
    }

};