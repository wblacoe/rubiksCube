package rubikscube;

import javafx.scene.Group;
import javafx.scene.paint.Color;
import javafx.scene.shape.Rectangle;
import javafx.scene.transform.Rotate;

public class Axes extends Group{
    
    public Axes(int length){
        Rectangle a1 = new Rectangle(length, 5, Color.RED);
        Rectangle a2 = new Rectangle(5, length, Color.GREEN);
        Rectangle a3 = new Rectangle(length, 5, Color.BLUE);
        a3.getTransforms().add(new Rotate(270, Rotate.Y_AXIS));
        
        getChildren().addAll(a1, a2, a3);
    }
}
