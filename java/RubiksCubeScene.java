package rubikscube;

import javafx.animation.KeyFrame;
import javafx.animation.KeyValue;
import javafx.animation.Timeline;
import javafx.event.EventHandler;
import javafx.scene.DepthTest;
import javafx.scene.Group;
import javafx.scene.PerspectiveCamera;
import javafx.scene.Scene;
import javafx.scene.input.KeyEvent;
import javafx.scene.input.MouseEvent;
import javafx.scene.transform.Rotate;
import javafx.scene.transform.Translate;
import javafx.util.Duration;

public class RubiksCubeScene extends Scene{
    
    private double sceneDragX, sceneDragY;
    private boolean isDragEnabled;
    
    private double cubeAngleX, cubeAngleY;
    public Rotate cubeRotateX, cubeRotateY;
    private LargeCube largeCube;
    
    private Circle circle;
    

    public RubiksCubeScene(double sceneWidth, double sceneHeight, RubiksCubeGame game){
        super(new Group(), sceneWidth, sceneHeight, true);
        
        Group root = (Group) getRoot();
        root.setDepthTest(DepthTest.ENABLE);
        root.getTransforms().addAll(
            new Translate(sceneWidth / 2, sceneHeight / 2)
        );
        
        cubeAngleX = 20;
        cubeAngleY = -20;
        cubeRotateX = new Rotate(cubeAngleX, Rotate.X_AXIS);
        cubeRotateY = new Rotate(cubeAngleY, Rotate.Y_AXIS);
        largeCube = new LargeCube(30, this, game);
        root.getChildren().add(largeCube);        
        
        circle = new Circle(120, 20, this, largeCube);
        root.getChildren().add(circle);
        
        setCamera(new PerspectiveCamera());

        isDragEnabled = false;
        
        setOnMousePressed(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                if(!largeCube.isMouseOver && !circle.isMouseOver){
                    sceneDragX = event.getSceneX();
                    sceneDragY = event.getSceneY();
                    isDragEnabled = true;
                }
            }
        });
        
        setOnMouseDragged(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                if(isDragEnabled){
                    double a = cubeAngleX + 180 * ((event.getSceneY() - sceneDragY) / sceneHeight);
                    a = Math.max(-80, Math.min(80, a));
                    cubeRotateX.setAngle(a);
                    cubeRotateY.setAngle(cubeAngleY - 180 * ((event.getSceneX() - sceneDragX) / sceneWidth));
                }
                largeCube.makeFrontSideDraggable();
            }
        });
        
        setOnMouseReleased(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                cubeAngleY = cubeRotateY.getAngle();
                cubeAngleX = cubeRotateX.getAngle();
                isDragEnabled = false;
            }
        });
        
        setOnKeyPressed(new EventHandler<KeyEvent>() {
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
        });
    }
    
}
