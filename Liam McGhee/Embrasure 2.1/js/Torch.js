function Torch(game, x, y) {
    var temp_sprite = game.add.sprite(x, y,'light');

    // Set the pivot point for this sprite to the center
    temp_sprite.anchor.setTo(0.5, 0.5);
    
    return temp_sprite;
};

Torch.prototype = Object.create(Phaser.Sprite.prototype);
Torch.prototype.constructor = Torch;