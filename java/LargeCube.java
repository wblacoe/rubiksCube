package rubikscube;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.Timeline;
import javafx.event.ActionEvent;
import javafx.event.EventHandler;
import javafx.geometry.Point3D;
import javafx.scene.Group;
import javafx.scene.Node;
import javafx.scene.input.MouseEvent;
import javafx.scene.paint.Color;
import javafx.scene.transform.Rotate;
import javafx.scene.transform.Translate;
import javafx.util.Duration;

public class LargeCube extends Group{

    private RubiksCubeScene scene;
    private double[] sceneDimensions;
    
    private SmallCube[][][] smallCubes;
    private int sideLength, gap;
    public boolean isMouseOver;
    
    public Rotate[][] discRotate; //dimension 0: axis around which to rotate, dimension 1: index of rotating disc
    private boolean isDragEnabled;
    private double dragX, dragY;
    
    private int mouseDragDirection, discIndex;
    private Double angle;
    private double clampedAngle;
    private double stickyInterval;
    private boolean isDiscSticky;
    
    private int unfinishedDiscRotateAxisIndex, unfinishedDiscIndex;

    private Axis frontVectorDirection; //which direction is the vector facing that initially points to the front (Z-)?
    private Axis topVectorDirection; //which direction is the vector facing that initially points to the top (Y-)?
    private Axis discRotateDirection; //around which axis is disc being rotated?
    
    private final int[] surfaceColorMapX, surfaceColorMapY, surfaceColorMapZ;
    
    private final RubiksCubeGame game;
    
    public LargeCube(int sideLength, RubiksCubeScene scene, RubiksCubeGame game){
        this.scene = scene;
        sceneDimensions = new double[]{ scene.getWidth(), scene.getHeight() };
        
        smallCubes = new SmallCube[3][3][3];
        this.sideLength = sideLength;
        gap = sideLength / 15;
        isMouseOver = false;
        
        discRotate = new Rotate[3][3];
        for(int i=0; i<3; i++){
            discRotate[0][i] = new Rotate(0, Rotate.X_AXIS);
            discRotate[1][i] = new Rotate(0, Rotate.Y_AXIS);
            discRotate[2][i] = new Rotate(0, Rotate.Z_AXIS);
        }
        isDragEnabled = false;
        dragX = -1;
        dragY = -1;
        
        mouseDragDirection = -1;
        discIndex = -1;
        angle = null;
        clampedAngle = -1;
        stickyInterval = 10;
        isDiscSticky = false;
        
        unfinishedDiscRotateAxisIndex = -1;
        unfinishedDiscIndex = -1;
        
        //how to rotate small cubes' surface colors around X-axis
        surfaceColorMapX = new int[6];
        surfaceColorMapX[SmallCube.FRONT] = SmallCube.BOTTOM;
        surfaceColorMapX[SmallCube.TOP] = SmallCube.FRONT;
        surfaceColorMapX[SmallCube.BOTTOM] = SmallCube.BACK;
        surfaceColorMapX[SmallCube.LEFT] = SmallCube.LEFT;
        surfaceColorMapX[SmallCube.RIGHT] = SmallCube.RIGHT;
        surfaceColorMapX[SmallCube.BACK] = SmallCube.TOP;
        
        //how to rotate small cubes' surface colors around Y-axis
        surfaceColorMapY = new int[6];
        surfaceColorMapY[SmallCube.FRONT] = SmallCube.LEFT;
        surfaceColorMapY[SmallCube.TOP] = SmallCube.TOP;
        surfaceColorMapY[SmallCube.BOTTOM] = SmallCube.BOTTOM;
        surfaceColorMapY[SmallCube.LEFT] = SmallCube.BACK;
        surfaceColorMapY[SmallCube.RIGHT] = SmallCube.FRONT;
        surfaceColorMapY[SmallCube.BACK] = SmallCube.RIGHT;
        
        //how to rotate small cubes' surface colors around Z-axis
        surfaceColorMapZ = new int[6];
        surfaceColorMapZ[SmallCube.FRONT] = SmallCube.FRONT;
        surfaceColorMapZ[SmallCube.TOP] = SmallCube.RIGHT;
        surfaceColorMapZ[SmallCube.BOTTOM] = SmallCube.LEFT;
        surfaceColorMapZ[SmallCube.LEFT] = SmallCube.TOP;
        surfaceColorMapZ[SmallCube.RIGHT] = SmallCube.BOTTOM;
        surfaceColorMapZ[SmallCube.BACK] = SmallCube.BACK;

        this.game = game;
        
        //small cubes
        for(int x=0; x<3; x++){
            for(int y=0; y<3; y++){
                for(int z=0; z<3; z++){
                    SmallCube sc = new SmallCube(sideLength);
                    smallCubes[x][y][z] = sc;
                    
                    sc.setPositionIndices(new int[]{ x, y, z });
                    
                    sc.getTransforms().clear();
                    sc.getTransforms().addAll(
                        scene.cubeRotateX,
                        scene.cubeRotateY,
                        discRotate[0][x],
                        discRotate[1][y],
                        discRotate[2][z],
                        new Translate(
                            (x - 1.5) * sideLength + (x - 1) * gap,
                            (y - 1.5) * sideLength + (y - 1) * gap,
                            (z - 1.5) * sideLength + (z - 1) * gap));
                    
                    sc.setOnMouseEntered(new EventHandler<MouseEvent>() {
                        @Override
                        public void handle(MouseEvent event) {
                            isMouseOver = true;
                        }
                    });
                    
                    sc.setOnMouseExited(new EventHandler<MouseEvent>() {
                        @Override
                        public void handle(MouseEvent event) {
                            isMouseOver = false;
                        }
                    });
                    
                    sc.setOnMousePressed(new EventHandler<MouseEvent>() {
                        @Override
                        public void handle(MouseEvent event) {
                            isDragEnabled = true;
                            dragX = event.getSceneX();
                            dragY = event.getSceneY();
                        }
                    });
                    
                    sc.setOnMouseDragged(new EventHandler<MouseEvent>() {
                        @Override
                        public void handle(MouseEvent event) {
                            if(isDragEnabled && sc.isDraggable) dragCube(sc, event);
                        }
                    });
                    
                    sc.setOnMouseReleased(new EventHandler<MouseEvent>() {
                        @Override
                        public void handle(MouseEvent event) {
                            
                            //if disc rotation is almost finished, finish it
                            if(isDragEnabled && sc.isDraggable){
                                isDiscSticky = true;
                                dragCube(sc, event);
                            }
                            
                            //if disc rotation is finished, set disc rotation parameters to inactive values
                            if(Math.round(clampedAngle % 90) == 0){
                                unfinishedDiscRotateAxisIndex = -1;
                                unfinishedDiscIndex = -1;
                                
                                if(discRotateDirection != null) rotateColors(discRotateDirection, discIndex, clampedAngle);
                                resetSmallCubes();
                                
                            //if disc rotation is unfinished, save disc rotation parameters for later
                            }else if(unfinishedDiscRotateAxisIndex == -1 && discRotateDirection != null){
                                unfinishedDiscRotateAxisIndex = discRotateDirection.axisIndex;
                                unfinishedDiscIndex = discIndex;
                            }
                            
                            isDragEnabled = false;
                            discRotateDirection = null;
                            mouseDragDirection = -1;
                            discIndex = -1;
                            angle = null;
                            isDiscSticky = false;
                        }
                    });
                    
                    getChildren().add(sc);
                }
            }
        }
        
        setInitialSurfaceColors();
        identifyCubeOrientation();
    }
    
    private void dragCube(SmallCube sc, MouseEvent event){
        double[] delta = { event.getSceneX() - dragX, event.getSceneY() - dragY };
                                
        if(mouseDragDirection == -1){
            switch((int) Math.signum(Math.abs(delta[1]) - Math.abs(delta[0]))){
                case -1:
                    mouseDragDirection = 0;
                    break;
                case 1:
                    mouseDragDirection = 1;
                    break;
            }

            if(mouseDragDirection > -1){
                discRotateDirection = getDiscRotateDirection();
            }

        }else if(discIndex == -1){
            discIndex = sc.getPositionIndices()[discRotateDirection.axisIndex];

        }else if(angle == null){
            angle = discRotate[discRotateDirection.axisIndex][discIndex].getAngle();

        //allow disc rotation only if it continues an unfinished disc rotation or there is no unfinished disc rotation
        }else if(unfinishedDiscRotateAxisIndex == -1 || (discRotateDirection.axisIndex == unfinishedDiscRotateAxisIndex && discIndex == unfinishedDiscIndex)){
            unfinishedDiscRotateAxisIndex = -1;
            unfinishedDiscIndex = -1;

            clampedAngle = clamp(angle + discRotateDirection.positivityFactor * 180 * delta[mouseDragDirection] / sceneDimensions[mouseDragDirection]);
            discRotate[discRotateDirection.axisIndex][discIndex].setAngle(clampedAngle);

            //System.out.println("disc rotation: " + discRotateDirection + ", front side: " + frontVectorDirection + " (" + frontVectorDirection.toInt() + "), mouse drag = " + mouseDragDirection + ", delta = " + delta[mouseDragDirection]); //DEBUG
        }
    }
    
    private Axis getDiscRotateDirection(){
        
        if(topVectorDirection.axisIndex == 1){ //large cube has only been rotated around Y-axis (top is still top)
            
            switch(frontVectorDirection.toInt()){
                case 0: //front vector is towards X+
                    if(mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(2, false);  //mouse is dragged down => disc is rotated along Z-
                    if(mouseDragDirection == 2) return new Axis(0, false);  //mouse drags circle clockwise => disc is rotated along X-
                    
                case 2: //front vector is towards Z+
                    if(mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(0, false);  //mouse is dragged down => disc is rotated along X-
                    if(mouseDragDirection == 2) return new Axis(2, false);  //mouse drags circle clockwise => disc is rotated along Z-
                    
                case 3: //front vector is towards X-
                    if(mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(2, true);   //mouse is dragged down => disc is rotated along Z+
                    if(mouseDragDirection == 2) return new Axis(0, true);  //mouse drags circle clockwise => disc is rotated along X+
                    
                case 5: //front vector is towards Z-
                    if(mouseDragDirection == 0) return new Axis(1, false);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(0, true);   //mouse is dragged down => disc is rotated along X+
                    if(mouseDragDirection == 2) return new Axis(2, true);  //mouse drags circle clockwise => disc is rotated along Z+
            }
            
        }else if(topVectorDirection.axisIndex == 2){ //top or bottom of large cube is now seen in front
            
            if(mouseDragDirection == 2) return new Axis(1, !topVectorDirection.isPositiveAxis);
            
            switch(frontVectorDirection.toInt()){
                case 0: //front vector is towards X+
                    if(mouseDragDirection == 0) return new Axis(0, !topVectorDirection.isPositiveAxis);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(2, false);  //mouse is dragged down => disc is rotated along Z-
                    
                case 1: //front vector is towards Y+
                    if(mouseDragDirection == 0) return new Axis(2, true);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(0, !topVectorDirection.isPositiveAxis);  //mouse is dragged down => disc is rotated along X-
                    
                case 3: //front vector is towards X-
                    if(mouseDragDirection == 0) return new Axis(0, topVectorDirection.isPositiveAxis);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(2, true);   //mouse is dragged down => disc is rotated along Z+
                    
                case 4: //front vector is towards Y-
                    if(mouseDragDirection == 0) return new Axis(2, false);  //mouse is dragged right => disc is rotated along Y-
                    if(mouseDragDirection == 1) return new Axis(0, topVectorDirection.isPositiveAxis);   //mouse is dragged down => disc is rotated along X+
            }
            
        }
        
        return null;
    }
    
    //resets small cubes' inner position indices and transforms
    private void resetSmallCubes(){
        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                discRotate[i][j].setAngle(0);
            }
        }
    }
    
    private void rotateColorsX(int discIndex1){
        Color[][][] temp = new Color[3][3][6];
        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                for(int k=0; k<6; k++){
                    temp[2 - j][i][surfaceColorMapX[k]] = smallCubes[discIndex1][i][j].getColor(k);
                }
            }
        }

        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                for(int k=0; k<6; k++){
                    smallCubes[discIndex1][i][j].setColor(k, temp[i][j][k], true);
                }
            }
        }
    }
    
    private void rotateColorsY(int discIndex1){
        Color[][][] temp = new Color[3][3][6];
        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                for(int k=0; k<6; k++){
                    temp[j][2 - i][surfaceColorMapY[k]] = smallCubes[i][discIndex1][j].getColor(k);
                }
            }
        }

        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                for(int k=0; k<6; k++){
                    smallCubes[i][discIndex1][j].setColor(k, temp[i][j][k], true);
                }
            }
        }
    }
    
    private void rotateColorsZ(int discIndex1){
        Color[][][] temp = new Color[3][3][6];
        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                for(int k=0; k<6; k++){
                    temp[2 - j][i][surfaceColorMapZ[k]] = smallCubes[i][j][discIndex1].getColor(k);
                }
            }
        }

        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                for(int k=0; k<6; k++){
                    smallCubes[i][j][discIndex1].setColor(k, temp[i][j][k], true);
                }
            }
        }
    }
    
    private void rotateColors(Axis discRotateDirection1, int discIndex1, double angle1){
        //int howManyRightAngles = (int) (discRotateDirection1.positivityFactor * ((angle1 / 90) % 4));
        int howManyRightAngles = (int) ((angle1 / 90) % 4);
        if(howManyRightAngles < 0) howManyRightAngles += 4;
        
        if(discRotateDirection1 != null){
            switch(discRotateDirection1.axisIndex){
                case 0:
                    for(int i=0; i<howManyRightAngles; i++) rotateColorsX(discIndex1);
                    break;
                case 1:
                    for(int i=0; i<howManyRightAngles; i++) rotateColorsY(discIndex1);
                    break;
                case 2:
                    for(int i=0; i<howManyRightAngles; i++) rotateColorsZ(discIndex1);
                    break;
            }
            //System.out.println("rotating colors on disc #" + discIndex1 + " " + (discRotateDirection1.isPositiveAxis == (angle1 < 0) ? (4 - howManyRightAngles) % 4 : howManyRightAngles) + " times around " + discRotateDirection1.axisIndex + "-th axis " + angle1 + " degrees in " + (discRotateDirection1.isPositiveAxis == (angle1 >= 0) ? "positive" : "negative") + " direction"); //DEBUG
        }
    }
    
    //causes the disc rotation to "stick" to multiples of 90°
    private double clamp(double angle){
        double angleMod90 = angle % 90;
        if(angleMod90 < 0) angleMod90 += 90;
        
        if(angleMod90 < stickyInterval){
            return isDiscSticky ? angle - angleMod90 : angle;
        }else if(angleMod90 > 90 - stickyInterval){
            return isDiscSticky ? angle + 90 - angleMod90 : angle;
        }else{
            isDiscSticky = true;
            return angle;
        }
    }
    
    //returns the axis along which given vector points after applying scene rotates to it
    private Axis getAxisAfterSceneRotates(Point3D p){
        p = scene.cubeRotateY.transform(p);
        p = scene.cubeRotateX.transform(p);
        
        double longest = Math.abs(p.getX());
        Axis axis = new Axis(0, p.getX() >= 0);
        if(Math.abs(p.getY()) > longest){
            axis = new Axis(1, p.getY() >= 0);
            longest = Math.abs(p.getY());
        }
        if(Math.abs(p.getZ()) > longest){
            axis = new Axis(2, p.getZ() >= 0);
        }
        
        return axis;
    }
    
    private void identifyCubeOrientation(){
        frontVectorDirection = getAxisAfterSceneRotates(new Point3D(0, 0, -1));
        topVectorDirection = getAxisAfterSceneRotates(new Point3D(0, -1, 0));
        
        //System.out.println("front: " + frontVectorDirection + ", top: " + topVectorDirection); //DEBUG
    }
    
    public void makeFrontSideDraggable(){
        identifyCubeOrientation();
        
        for(Node n : getChildren()){
            ((SmallCube) n).isDraggable = false;
            //((SmallCube) n).refreshColors();
        }
        
        if(topVectorDirection.axisIndex == 1){
            
            switch(frontVectorDirection.axisIndex){
                case 0:
                    for(int i=0; i<3; i++){
                        for(int j=0; j<3; j++){
                            smallCubes[frontVectorDirection.isPositiveAxis ? 0 : 2][i][j].isDraggable = true;
                            //smallCubes[frontVectorDirection.isPositiveAxis ? 0 : 2][i][j].setColor(Color.CORAL, false);
                        }
                    }
                    break;

                case 2:
                    for(int i=0; i<3; i++){
                        for(int j=0; j<3; j++){
                            smallCubes[i][j][frontVectorDirection.isPositiveAxis ? 2 : 0].isDraggable = true;
                            //smallCubes[i][j][frontVectorDirection.isPositiveAxis ? 2 : 0].setColor(Color.CORAL, false);
                        }
                    }
                    break;
            }
            
        }else if(topVectorDirection.axisIndex == 2){
            for(int i=0; i<3; i++){
                for(int j=0; j<3; j++){
                    smallCubes[i][topVectorDirection.isPositiveAxis ? 2 : 0][j].isDraggable = true;
                    //smallCubes[i][topVectorDirection.isPositiveAxis ? 2 : 0][j].setColor(Color.CORAL, false);
                }
            }
        }
        
    }
    
    private void circleDragCube(Double deltaAngle){
        boolean b = false;
        if(topVectorDirection.axisIndex == 1){
            b = ((frontVectorDirection.axisIndex == 2) == frontVectorDirection.isPositiveAxis);
        }else if(topVectorDirection.axisIndex == 2){
            b = topVectorDirection.isPositiveAxis;
        }
        
        if(mouseDragDirection == -1){
            mouseDragDirection = 2;
            discRotateDirection = getDiscRotateDirection();

        }else if(discIndex == -1){
            discIndex = b ? 2 : 0;

        }else if(angle == null){
            angle = discRotate[discRotateDirection.axisIndex][discIndex].getAngle();

        }else if(unfinishedDiscRotateAxisIndex == -1 || (discRotateDirection.axisIndex == unfinishedDiscRotateAxisIndex && discIndex == unfinishedDiscIndex)){
            unfinishedDiscRotateAxisIndex = -1;
            unfinishedDiscIndex = -1;

            if(deltaAngle == null){
                clampedAngle = clamp(clampedAngle);
            }else{
                clampedAngle = clamp(angle + (b ? -deltaAngle : deltaAngle));
            }
            
            discRotate[discRotateDirection.axisIndex][discIndex].setAngle(clampedAngle);

            //System.out.println("disc rotation: " + discRotateDirection + ", front side: " + frontVectorDirection + " (" + frontVectorDirection.toInt() + "), mouse drag = " + mouseDragDirection + ", angle = " + angle + ", delta angle = " + deltaAngle); //DEBUG
        }
    }
 
    public void rotateFrontDisc(Double deltaAngle){
        
        //finish front disc rotation
        if(deltaAngle == null){
            
            //if disc rotation is almost finished, finish it
            isDiscSticky = true;
            circleDragCube(null);
            
            //if disc rotation is finished, set disc rotation parameters to inactive values
            if(Math.round(clampedAngle % 90) == 0){
                unfinishedDiscRotateAxisIndex = -1;
                unfinishedDiscIndex = -1;

                if(discRotateDirection != null && discIndex > -1) rotateColors(discRotateDirection, discIndex, clampedAngle);
                resetSmallCubes();

            //if disc rotation is unfinished, save disc rotation parameters for later
            }else if(unfinishedDiscRotateAxisIndex == -1 && discRotateDirection != null){
                unfinishedDiscRotateAxisIndex = discRotateDirection.axisIndex;
                unfinishedDiscIndex = discIndex;
            }
                            
            discRotateDirection = null;
            mouseDragDirection = -1;
            discIndex = -1;
            angle = null;
            isDiscSticky = false;
            
        //run front disc rotation
        }else{
            circleDragCube(deltaAngle);
        }
    }
 
    public void reset(){
        resetSmallCubes();
        unfinishedDiscRotateAxisIndex = -1;
        unfinishedDiscIndex = -1;
    }
    
    public void randomlyRotateDiscAsAnimation(){
        if(game != null){
            game.animation = new Timeline();

            discRotateDirection = new Axis((int) (Math.random() * 3), Math.random() >= 0.5);
            discIndex = (int) (Math.random() * 3);
            double deltaAngle = 90 * ((int) (Math.random() * 2) + 1);
            angle = discRotate[discRotateDirection.axisIndex][discIndex].getAngle();
            clampedAngle = clamp(angle + (discRotateDirection.isPositiveAxis ? deltaAngle : -deltaAngle));

            game.animation.getKeyFrames().addAll(
                new KeyFrame(Duration.ZERO,
                    new KeyValue(discRotate[discRotateDirection.axisIndex][discIndex].angleProperty(), angle)
                ),
                new KeyFrame(Duration.seconds(0.2),
                    new KeyValue(discRotate[discRotateDirection.axisIndex][discIndex].angleProperty(), clampedAngle)
                ));

            game.animation.setCycleCount(1);
            game.animation.setOnFinished(new EventHandler<ActionEvent>() {
                @Override
                public void handle(ActionEvent event) {
                    //if disc rotation is finished, set disc rotation parameters to inactive values
                    unfinishedDiscRotateAxisIndex = -1;
                    unfinishedDiscIndex = -1;

                    rotateColors(discRotateDirection, discIndex, clampedAngle);
                    resetSmallCubes();

                    discRotateDirection = null;
                    mouseDragDirection = -1;
                    discIndex = -1;
                    angle = null;
                    isDiscSticky = false;
                }
            });

            game.play();
        }
    }
    
    public void setInitialSurfaceColors(){
        //initial surface colors
        for(int i=0; i<3; i++){
            for(int j=0; j<3; j++){
                smallCubes[i][j][0].setColor(SmallCube.FRONT, Color.BLUE, true);
                smallCubes[i][j][2].setColor(SmallCube.BACK, Color.GREEN, true);
                smallCubes[0][i][j].setColor(SmallCube.LEFT, Color.RED, true);
                smallCubes[2][i][j].setColor(SmallCube.RIGHT, Color.ORANGE, true);
                smallCubes[i][0][j].setColor(SmallCube.TOP, Color.WHITE, true);
                smallCubes[i][2][j].setColor(SmallCube.BOTTOM, Color.YELLOW, true);
            }
        }
    }
    
    public void shuffle(){
        for(int i=0; i<100; i++){
            Axis discRotateDirection1 = new Axis((int) (Math.random() * 3), Math.random() >= 0.5);
            int discIndex1 = (int) (Math.random() * 3);
            double deltaAngle = 90 * ((int) (Math.random() * 2) + 1);
            double angle1 = discRotate[discRotateDirection1.axisIndex][discIndex1].getAngle();
            double clampedAngle1 = clamp(angle1 + (discRotateDirection1.isPositiveAxis ? deltaAngle : -deltaAngle));

            rotateColors(discRotateDirection1, discIndex1, clampedAngle1);
        }
    }
        
}