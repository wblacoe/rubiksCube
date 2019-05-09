package rubikscube;

import java.awt.Dimension;
import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javax.swing.JFrame;

public final class RubiksCubeFrame extends JFrame{
    
    
    public RubiksCubeFrame(int sceneWidth, int sceneHeight, RubiksCubeGame game){
        
        //JavaFX panel
        final JFXPanel fxPanel = new JFXPanel();
        fxPanel.setPreferredSize(new Dimension(sceneWidth, sceneHeight));
        fxPanel.setVisible(true);
        
        //Scene
        Platform.runLater(new Runnable(){
            @Override
            public void run() {
                fxPanel.setScene(new RubiksCubeScene(sceneWidth, sceneHeight, game));
            }
        });
        
        //this JFrame
        add(fxPanel);
        pack();
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        setVisible(true);
        
        System.out.println("KEYS:\n\n"
            + "UP/DOWN/LEFT/RIGHT = rotate cube\n"
            + "HOME = restore original orientation\n"
            + "R = rotate random disc\n"
            + "S = shuffle colors\n"
            + "B = restore original colors\n"
            + "ESCAPE = exit game");
    }
    
    public RubiksCubeFrame(int sceneWidth, int sceneHeight){
        this(sceneWidth, sceneHeight, null);
    }
    
    
    public static void main(String[] args){
        int sceneWidth = 600;
        int sceneHeight = 400;
        
        for(String arg : args){
            String[] entries = arg.split("=");
            if(entries.length == 2){
                switch(entries[0].toLowerCase()){
                    case "width":
                        sceneWidth = Integer.parseInt(entries[1]);
                        break;
                    case "height":
                        sceneHeight = Integer.parseInt(entries[1]);
                        break;
                    default:
                        System.out.println("I don't know what to do with argument \"" + arg + "\"");
                }
            }
        }
        
        RubiksCubeFrame frame = new RubiksCubeFrame(sceneWidth, sceneHeight);
    }

}
