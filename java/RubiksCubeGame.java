package rubikscube;

import javafx.animation.Timeline;
import javafx.application.Application;
import javafx.scene.Scene;
import javafx.stage.Stage;

public class RubiksCubeGame extends Application {
    
    public Timeline animation;
    
    private void init(Stage primaryStage) {
        int sceneWidth = 600;
        int sceneHeight = 400;
        
        Scene scene = new RubiksCubeScene(sceneWidth, sceneHeight, this);
        
        primaryStage.setResizable(true);
        primaryStage.setScene(scene);
        
        System.out.println("KEYS:\n\nUP/DOWN/LEFT/RIGHT = rotate cube\nHOME = restore original orientation\nR = rotate random disc\nS = shuffle colors\nB = restore original colors\nESCAPE = exit game");
    }
    
    public void play() {
        animation.play();
    }

    @Override
    public void stop() {
        if(animation != null) animation.pause();
    }

    @Override
    public void start(Stage primaryStage) throws Exception {
        init(primaryStage);
        primaryStage.show();
    }
    

    public static void main(String[] args) {
        launch(args);
    }    
}
