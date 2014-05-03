function Shadow(shadowTexture, lights, game){
    this.shadowTexture = shadowTexture;
    this.lights = lights;
    this.game = game;
}

function updateShadowTexture(shadowText, game, lights){
    	// This function updates the shadow texture (this.shadowTexture).
    	// First, it fills the entire texture with a dark shadow color.
    	// Then it draws a white circle centered on the pointer position.
    	// Because the texture is drawn to the screen using the MULTIPLY
    	// blend mode, the dark areas of the texture make all of the colors
    	// underneath it darker, while the white area is unaffected.
		
		//mrcoles.com/blog/canvas-composite-operations-demo-animation
		this.shadowTexture.context.globalCompositeOperation = 'source-over';
    	
    	// Draw shadow
    	this.shadowTexture.context.fillStyle = 'rgb(100, 100, 100)';
    	this.shadowTexture.context.fillRect(0, 0, this.game.width, this.game.height);
    	
		//this.shadowTexture.context.globalCompositeOperation = 'lighter';
    	
    	// Iterate through each of the lights and draw the glow
    	for (var i=0; i<this.lights.length; i++) {
        	var light = this.lights[i];
        	
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
    };