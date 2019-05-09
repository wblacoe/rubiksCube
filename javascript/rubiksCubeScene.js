class RubiksCubeScene{

    constructor(sceneWidth, sceneHeight){
		this.sceneWidth = sceneWidth;
		this.sceneHeight = sceneHeight;
		
		this.scene = new THREE.Scene();

		this.lookatSphere = new Sphere();
		//this.lookatSphere.addToScene(this.scene);
		
		//var axes = new Axes();
		//axes.addToScene(this.scene);

		this.camera = new THREE.PerspectiveCamera(70, sceneWidth / sceneHeight, 1, 1000);
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 500;
		this.camera.lookAt(this.lookatSphere.getPosition());

		this.cubeAngleX = 0;
        this.cubeAngleY = 0;
        this.cubeRotateX = new Rotate(this.cubeAngleX, axis.x);
        this.cubeRotateY = new Rotate(this.cubeAngleY, axis.y);
		
		this.largeCube = new LargeCube(30, this, [this.cubeRotateX, this.cubeRotateY]);
		this.largeCube.setInitialSurfaceColors();
		this.largeCube.addToScene(this.scene);

        this.circle = new Circle(150, 30, this, this.largeCube);
		this.circle.addToScene(this.scene);
        
        this.isDragEnabled = false;
    }
	
	update(){
		this.largeCube.update();
	}
	
	onMouseMove(mouseX, mouseY, smallCube){
		if(this.isDragEnabled){
			var a = this.cubeAngleX + 20 * ((mouseY - this.sceneDragY) / this.sceneHeight);
			a = Math.max(-1.3, Math.min(1.3, a));
			if(!isNaN(a)){
				this.cubeRotateX.angle = a;
				this.cubeRotateY.angle = this.cubeAngleY + 20 * ((mouseX - this.sceneDragX) / this.sceneWidth);
			}
		}
		this.largeCube.makeFrontSideDraggable();
	};
	
	onMouseDown(mouseX, mouseY, smallCube){
		this.sceneDragX = mouseX;
		this.sceneDragY = mouseY;
		this.isDragEnabled = true;
	}
	
	onMouseUp(mouseX, mouseY, smallCube){
		this.cubeAngleY = this.cubeRotateY.angle;
		this.cubeAngleX = this.cubeRotateX.angle;
		this.isDragEnabled = false;
	};
	
	
	
	/*setOnKeyPressed(new EventHandler<KeyEvent>() {
		@Override
		public void handle(KeyEvent event) {
			switch(event.getCode()){
				case UP:
					cubeAngleX = Math.max(-80, Math.min(80, cubeAngleX - 5));
					cubeRotateX.setAngle(cubeAngleX);
					break;
					
				case DOWN:
					cubeAngleX = Math.max(-80, Math.min(80, cubeAngleX + 5));
					cubeRotateX.setAngle(cubeAngleX);
					break;
					
				case LEFT:
					cubeAngleY += 5;
					cubeRotateY.setAngle(cubeAngleY);
					break;
					
				case RIGHT:
					cubeAngleY -= 5;
					cubeRotateY.setAngle(cubeAngleY);
					break;
			}
		}
	});
	
	setOnKeyReleased(new EventHandler<KeyEvent>() {
		@Override
		public void handle(KeyEvent event) {
			switch(event.getCode()){
				case HOME:
					if(game != null){
						cubeAngleX = 20;
						cubeAngleY = -20;
						game.animation = new Timeline();
						game.animation.getKeyFrames().addAll(
							new KeyFrame(Duration.ZERO,
								new KeyValue(cubeRotateX.angleProperty(), cubeRotateX.getAngle()),
								new KeyValue(cubeRotateY.angleProperty(), cubeRotateY.getAngle())
							),
							new KeyFrame(Duration.seconds(0.2),
								new KeyValue(cubeRotateX.angleProperty(), cubeAngleX),
								new KeyValue(cubeRotateY.angleProperty(), cubeAngleY)
							)); game.animation.setCycleCount(1);
							game.animation.play();
						break;
					}
					
				case S:
					largeCube.shuffle();
					break;
					
				case B:
					largeCube.setInitialSurfaceColors();
					break;
					
				case R:
					largeCube.randomlyRotateDiscAsAnimation();
					break;
					
				case ESCAPE:
					System.exit(1);
					
				default:
					break;
			}
		}
	});*/
    
}
