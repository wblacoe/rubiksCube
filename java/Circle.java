package rubikscube;

import javafx.event.EventHandler;
import javafx.scene.Group;
import javafx.scene.input.MouseEvent;
import javafx.scene.paint.Color;
import javafx.scene.shape.Polygon;

public class Circle extends Group{
    
    private RubiksCubeScene scene;
    private LargeCube largeCube;
    
    private Polygon[] polygons;
    public boolean isMouseOver;
    private int resolution;
    
    private boolean isDragEnabled;
    private Double angleOnMousePressed, angle;

    //[radius] is the inner radius, [radius + width] is the outer radius
    public Circle(int radius, int width, RubiksCubeScene scene, LargeCube largeCube){
        this.scene = scene;
        this.largeCube = largeCube;
        
        isMouseOver = false;
        resolution = 1000;
        
        isDragEnabled = false;
        angleOnMousePressed = null;
        angle = null;
        
        polygons = new Polygon[resolution];
        for(int i=0; i<resolution; i++){
            Polygon polygon = new Polygon();
            polygons[i] = polygon;
            
            polygon.getPoints().addAll(new Double[]{
                radius * Math.cos(2 * Math.PI * i / resolution),
                radius * Math.sin(2 * Math.PI * i / resolution),
                (radius + width) * Math.cos(2 * Math.PI * i / resolution),
                (radius + width) * Math.sin(2 * Math.PI * i / resolution),
                (radius + width) * Math.cos(2 * Math.PI * (i + 1) / resolution),
                (radius + width) * Math.sin(2 * Math.PI * (i + 1) / resolution),
                radius * Math.cos(2 * Math.PI * (i + 1) / resolution),
                radius * Math.sin(2 * Math.PI * (i + 1) / resolution),
            });
            polygon.setFill(Color.LIGHTCYAN);
            getChildren().add(polygon);
        }
        
        setOnMouseEntered(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                isMouseOver = true;
                markPolygons(event);
            }
        });
        
        setOnMouseMoved(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                if(isMouseOver){
                    markPolygons(event);
                }
            }
        });
        
        setOnMouseExited(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                isMouseOver = false;
                resetPolygons();
            }
        });
        
        setOnMousePressed(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                isDragEnabled = true;
            }
        });
        
        setOnMouseDragged(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                if(isDragEnabled){
                    markPolygons(event);
                    largeCube.rotateFrontDisc(360 * (angle - angleOnMousePressed) / (2 * Math.PI));
                }
            }
        });
        
        setOnMouseReleased(new EventHandler<MouseEvent>() {
            @Override
            public void handle(MouseEvent event) {
                isDragEnabled = false;
                angle = null;
                angleOnMousePressed = null;
                largeCube.rotateFrontDisc(null);
            }
        });
    }
    
    private void resetPolygons(){
        for(Polygon polygon : polygons){
            polygon.setFill(Color.LIGHTCYAN);
        }
    }
    
    private void markPolygons(MouseEvent event){
        resetPolygons();
        
        double mouseX = event.getSceneX() - (scene.getWidth() / 2);
        double mouseY = event.getSceneY() - (scene.getHeight() / 2);
        double mouseRadius = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

        angle = Math.acos(mouseX / mouseRadius);
        if(Double.isNaN(angle)) angle = 0.0;
        if(mouseY < 0) angle = -angle;
        if(isDragEnabled && angleOnMousePressed == null) angleOnMousePressed = angle;
        
        int polygonIndex = (int) Math.round(resolution * angle / (2 * Math.PI));
        for(int i=-resolution/100; i<=resolution/100; i++){
            int pi = (polygonIndex + i) % resolution;
            if(pi < 0) pi += resolution;
            polygons[pi].setFill(Color.DARKBLUE);
            //if(i == 0) System.out.println("mouseX = " + mouseX + ", mouseY = " + mouseY + ", angle = " + angle + ", index = " + pi);
        }
    }
    
}
