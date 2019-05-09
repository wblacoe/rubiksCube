package rubikscube;

import javafx.scene.Group;
import javafx.scene.paint.Color;
import javafx.scene.shape.Line;
import javafx.scene.shape.Rectangle;
import javafx.scene.transform.Rotate;
import javafx.scene.transform.Translate;

public class SmallCube extends Group{
    
    public static final int FRONT = 0;
    public static final int TOP = 1;
    public static final int BOTTOM = 2;
    public static final int LEFT = 3;
    public static final int RIGHT = 4;
    public static final int BACK = 5;
    
    private int[] positionIndices;
    public boolean isDraggable;
    
    public Color[] colors;
    private Rectangle[] surfaces;

    public SmallCube(int s){
        positionIndices = new int[3];
        isDraggable = false;
        colors = new Color[6];
        
        surfaces = new Rectangle[6];
        for(int i=0; i<6; i++){
            Rectangle r = new Rectangle(0, 0, s, s);
            surfaces[i] = r;
        }
        
        //0: front
        
        
        //1: top
        surfaces[1].getTransforms().addAll(
            new Rotate(90, Rotate.X_AXIS));
        
        //2: bottom
        surfaces[2].getTransforms().addAll(
            new Rotate(90, Rotate.X_AXIS),
            new Translate(0, 0, -s));
        
        //3: left
        surfaces[3].getTransforms().addAll(
            new Rotate(270, Rotate.Y_AXIS));
        
        //4: right
        surfaces[4].getTransforms().addAll(
            new Rotate(270, Rotate.Y_AXIS),
            new Translate(0, 0, -s));
        
        //5: back
        surfaces[5].getTransforms().addAll(
            new Translate(0, 0, s));
        
        
        Line[] lines = new Line[12];
        
        lines[0] = new Line(0, 0, s, 0);
        lines[1] = new Line(0, 0, 0, s);
        lines[2] = new Line(0, s, s, s);

        lines[3] = new Line(0, 0, s, 0);
        lines[4] = new Line(0, 0, 0, s);
        lines[5] = new Line(0, s, s, s);
        for(int i=3; i<6; i++)
            lines[i].getTransforms().addAll(
                new Rotate(90, Rotate.Y_AXIS),
                new Translate(-s, 0, 0));
        
        lines[6] = new Line(0, 0, s, 0);
        lines[7] = new Line(0, 0, 0, s);
        lines[8] = new Line(0, s, s, s);
        for(int i=6; i<9; i++)
            lines[i].getTransforms().addAll(
                new Rotate(180, Rotate.Y_AXIS),
                new Translate(-s, 0, -s));
        
        lines[9] = new Line(0, 0, s, 0);
        lines[10] = new Line(0, 0, 0, s);
        lines[11] = new Line(0, s, s, s);
        for(int i=9; i<12; i++)
            lines[i].getTransforms().addAll(
                new Rotate(270, Rotate.Y_AXIS),
                new Translate(0, 0, -s));
        
        for(int i=0; i<12; i++) lines[i].setFill(Color.BLACK);
        
        getChildren().addAll(surfaces);
        getChildren().addAll(lines);
    }
    
    public int[] getPositionIndices(){
        return positionIndices;
    }
    
    public void setPositionIndices(int[] indices){
        positionIndices = indices;
    }
    
    public Color getColor(int surface){
        return (Color) surfaces[surface].getFill();
    }
    
    public void setColor(int surface, Color c, boolean saveColor){
        surfaces[surface].setFill(c);
        if(saveColor) colors[surface] = c;
    }
    
    public void setColor(Color c, boolean saveColor){
        for(int i=0; i<6; i++) setColor(i, c, saveColor);
    }
    
    public void refreshColors(){
        for(int i=0; i<6; i++){
            if(colors[i] != null) surfaces[i].setFill(colors[i]);
        }
    }
    
    @Override
    public String toString(){
        return "(" + positionIndices[0] + ", " + positionIndices[1] + ", " + positionIndices[2] + ")";
    }
    
}
