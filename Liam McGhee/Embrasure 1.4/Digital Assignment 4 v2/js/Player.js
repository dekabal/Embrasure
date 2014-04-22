function Player(game, spriteString, xPos, yPos, startFrame){
    this.game = game;
    this.inventory = [];
    this.sprite = this.createPlayer(spriteString, xPos, yPos, startFrame);
    this.sprint = 0;
};

Player.prototype = {
    
    createPlayer: function(spriteString, xPos, yPos, startFrame){
        
        var temp_player = this.game.add.sprite(xPos, yPos,spriteString);
        this.game.physics.arcade.enableBody(temp_player);
        temp_player.anchor.setTo(0.5,0.5);
        temp_player.frame = 1;
        this.game.camera.follow(temp_player);
        temp_player.body.collide
        
        temp_player.inventory = {};
        temp_player.body.collideWorldBounds = true;


        //set up player animations
        temp_player.animations.add('run_down', [0,1,2], 5, true);
        temp_player.animations.add('run_left', [3,4,5], 5, true);
        temp_player.animations.add('run_right', [6,7,8], 5, true);
        temp_player.animations.add('run_up', [9,10,11], 5, true);
        
        return temp_player;

    },
    
    movePlayer: function(){
        // player movement
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            this.sprite.body.velocity.y = 0;
            
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
    },
    
    destroy: function(){
        this.sprite.destroy();
    },
};