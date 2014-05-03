function Player(game, spriteString, xPos, yPos, startFrame){
    this.game = game;
    this.inventory = new Inventory(3,3,game);
    this.sprite = this.createPlayer(spriteString, xPos, yPos, startFrame);
    this.sprint = 0;
    this.light;
    this.glow;
    this.direction;
    this.xOffset = 0;
    this.yOffset = 0;
};

Player.prototype = {
    
    createPlayer: function(spriteString, xPos, yPos, startFrame){
        
        var temp_player = this.game.add.sprite(xPos, yPos,spriteString);
        this.game.physics.arcade.enableBody(temp_player);
        temp_player.anchor.setTo(0.5,0.5);
        temp_player.frame = startFrame;
        this.game.camera.follow(temp_player);
        
        temp_player.inventory = {};
        temp_player.body.collideWorldBounds = true;


        //set up player animations
        temp_player.animations.add('run_down', [0,1,2], 5, true);
        temp_player.animations.add('run_left', [3,4,5], 5, true);
        temp_player.animations.add('run_right', [6,7,8], 5, true);
        temp_player.animations.add('run_up', [9,10,11], 5, true);
        
        var flashlight_key = this.game.input.keyboard.addKey(Phaser.Keyboard.X);
        flashlight_key.onDown.add(this.toggleFlashlight, this);
        
        return temp_player;

    },
    
    movePlayer: function(){
        // player movement
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.sprite.body.velocity.y = 0;
            this.direction = "left";
            this.light.angle = -3.0
            this.xOffset = -10;
            this.yOffset = 0;
            
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    this.sprite.body.velocity.x = -300;
                }else
                    this.sprite.body.velocity.x = -100;
            }
            else{
                this.sprite.body.velocity.x = -100;
                if(sprint > 0)
                    sprint -= 2;
            }

            this.sprite.animations.play('run_left');

        }
        else if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            this.sprite.body.velocity.y = 0;
            this.direction = "right";
            this.light.angle = 0.0
            this.xOffset = 10;
            this.yOffset = 0;
            
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    this.sprite.body.velocity.x = 300;
                }else
                    this.sprite.body.velocity.x = 100;
            }
            else{
                this.sprite.body.velocity.x = 100;
                if(sprint > 0)
                    sprint -= 2;
            }

            this.sprite.animations.play('run_right');

        }
        else if(this.game.input.keyboard.isDown(Phaser.Keyboard.UP)){
            this.sprite.body.velocity.x = 0;
            this.direction = "up";
            this.light.angle = -1.5;
            this.yOffset = -12;
            this.xOffset = 0;
            
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    this.sprite.body.velocity.y = -300;
                }else
                    this.sprite.body.velocity.y = -100;
            }
            else{
                this.sprite.body.velocity.y = -100;
                if(sprint > 0)
                    sprint -= 2;
            }

            this.sprite.animations.play('run_up');

        }
        else if(this.game.input.keyboard.isDown(Phaser.Keyboard.DOWN)){
            this.sprite.body.velocity.x = 0;
            this.direction = "down";
            this.light.angle = 1.5;
            this.yOffset = 12
            this.xOffset = 0;
            
            if(this.game.input.keyboard.isDown(Phaser.Keyboard.SHIFT)){
                if(sprint < 750){
                    sprint += 5;
                    this.sprite.body.velocity.y = 300;
                }else
                    this.sprite.body.velocity.y = 100;
            }
            else{
                this.sprite.body.velocity.y = 100;
                if(sprint > 0)
                    sprint -= 2;
            }

            this.sprite.animations.play('run_down');

        }
        else {
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.animations.stop();
            if(sprint > 0)
                sprint -= 10;

        }
        
        this.light.x = this.sprite.position.x + this.xOffset;
        this.light.y = this.sprite.position.y + this.yOffset;
        
        this.glow.x = this.sprite.position.x;
        this.glow.y = this.sprite.position.y;
        
        
    },
    
    toggleFlashlight: function(){
        if(this.light.on){
            this.light.color = [50,50,50];
            this.light.on = false;
        }
        else{
            this.light.color = [256,256,256]
            this.light.on = true;
        }
    },
    
    destroy: function(){
        this.sprite.destroy();
    },
    
    
    setPlayerLight: function(light){
        this.light = light;
    },
    
    setPlayerGlow: function(glow){
        this.glow = glow;
    },
    
    addToInventory: function(extra, item){
        
        if(!this.inventory.specialInstruction(item)){
            this.inventory.addToInventory(item)
        }
        
    },
    
    openDoor: function(player,door){
        if(door.visible)
            this.inventory.openDoor(door);
        else
            this.inventory.closeDoor(door);
    }
    
};