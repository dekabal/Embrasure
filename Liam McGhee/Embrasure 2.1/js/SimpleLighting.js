function SimpleLighting(game){
    this.shadowTexture = game.add.bitmapData(game.width, game.height);
    
    this.lightSprite = game.add.image(0, 0, this.shadowTexture);
    this.lightSprite.fixedToCamera = true;

    // Set the blend mode to MULTIPLY. This will darken the colors of
    // everything below this sprite.
    this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;
    
    this.lights = [];
    this.game = game;
    this.color = [100,100,100];
    
    this.t = false;
};

SimpleLighting.prototype = {
    
    updateShadowTexture: function (){
            // This function updates the shadow texture (this.shadowTexture).
            // First, it fills the entire texture with a dark shadow color.
            // Then it draws a white circle centered on the pointer position.
            // Because the texture is drawn to the screen using the MULTIPLY
            // blend mode, the dark areas of the texture make all of the colors
            // underneath it darker, while the white area is unaffected.

            //mrcoles.com/blog/canvas-composite-operations-demo-animation
            this.shadowTexture.context.globalCompositeOperation = 'source-over';

            // Draw shadow
            this.shadowTexture.context.fillStyle = 'rgb('+this.color[0]+', '+this.color[1]+', '+this.color[2]+')';
            this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);

            //this.shadowTexture.context.globalCompositeOperation = 'lighter';

            // Iterate through each of the lights and draw the glow
            for (key in this.lights) {
                var light = this.lights[key];

                // Randomly change the radius each frame
                var radius = Math.round(light.radius + Math.random() * light.flicker);
                var x = light.x - this.game.camera.x;
                var y = light.y - this.game.camera.y;
                var start = -light.fov + light.angle;
                var end = light.fov + light.angle;
                var r = light.color[0], g = light.color[1], b = light.color[2];

                // Draw circle of light with a soft edge
                var gradient =
                    this.shadowTexture.context.createRadialGradient(
                        x, y, radius * 0.75,
                        x, y, radius);
                gradient.addColorStop(0, 'rgba('+r+', '+g+', '+b+', 1.0)');
                gradient.addColorStop(1, 'rgba('+r+', '+g+', '+b+', 0.0)');

                this.shadowTexture.context.beginPath();
                this.shadowTexture.context.fillStyle = gradient;
                this.shadowTexture.context.drawPieSlice(x, y, radius, start, end);
                this.shadowTexture.context.fill();
            }

            // This just tells the engine it should update the texture cache
            this.shadowTexture.dirty = true;
        },
    
    createLight: function(x, y, radius, fov, angle, color, flicker, key){
        this.newLight = new Torch(
    		x,	// x
    		y,	// y
    		radius, fov, angle,				// Radius, FOV, Angle
    		color, flicker, key);			// Color, flicker
    	this.lights[key] = this.newLight;
        return this.newLight;
    },
    
    setShadowColor: function(r, g, b){
        this.color[0] = r;
        this.color[1] = b;
        this.color[2] = g;
    },
    
    setLightPosition: function(x, y, key){
        this.lights[key].x = x;
        this.lights[key].y = y;
    },
    
    setLightColor: function(color, key){
        this.lights[key].color = color;
    },
    
    setLightFlicker: function(flicker, key){
        this.lights[key].flicker = flicker;
    },
    
    setLightRadius: function(radius, key){
        this.lights[key].radius = radius;
    },
    
    setLightFOV: function(fov, key){
        this.lights[key].fov = fov;
    },
    
    setLightAngle: function(angle, key){
        this.lights[key].angle = angle;
    },
    
    killAllLights: function(){
        for (key in this.lights) {
            var light = this.lights[key];
            light.color = [0,0,0];
        }
        
        this.setShadowColor(0,0,0);
    },
    
    fadeOutAllLights: function(){
        
        var temp_check = false;
        
        for (key in this.lights) {
            var light = this.lights[key];
            
            if(light.color[0] != 0 && light.color[1] != 0 && light.color[2] != 0){
                light.color = [light.color[0]-1,light.color[0]-1,light.color[0]-1];
                t = false;
            }else
                t = true;
            
            if(light.color[0] == this.color[0] && light.color[1] == this.color[0] && light.color[2] == this.color[0])
                temp_check = true;
        }
        
        if(temp_check)
            this.setShadowColor(this.color[0]-1,this.color[1]-1,this.color[2]-1);
        
        
        if(t)
            return true;
        else
            return false;
    },
    
    fadeInAllLights: function(){
        
        
        if(this.color[0] != 11 && this.color[1] != 11 && this.color[2] != 11)
            this.setShadowColor(this.color[0]+1,this.color[1]+1,this.color[2]+1);
        
        
        if(this.color[0] >= 10 && this.color[1] >= 10 && this.color[2] >= 10){
            for (key in this.lights) {
                var light = this.lights[key];

                if(light.color[0] != 256 && light.color[1] != 256 && light.color[2] != 256){
                    light.color = [light.color[0]+1,light.color[0]+1,light.color[0]+1];
                    this.t = false;
                }else
                    this.t = true;
            }
        
        }
        
        if(this.t)
            return true;
        else
            return false;
    }

};

function Torch(x, y, radius, fov, angle, color, flicker, tag) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.fov = fov * Math.PI;
	this.angle = angle;
	this.color = color;
	this.flicker = flicker;
    this.tag = tag;
    this.on = true;
};
