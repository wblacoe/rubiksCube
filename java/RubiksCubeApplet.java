package rubikscube;

import java.awt.BorderLayout;
import java.awt.Dimension;
import javafx.application.Platform;
import javafx.embed.swing.JFXPanel;
import javax.swing.JApplet;

public final class RubiksCubeApplet extends JApplet {
    
    public RubiksCubeApplet(int sceneWidth, int sceneHeight, RubiksCubeGame game){
        
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
        
        //this JApplet
        add(fxPanel);
        setLayout(new BorderLayout());
        setVisible(true);
        
        System.out.println("KEYS:\n\n"
            + "UP/DOWN/LEFT/RIGHT = rotate cube\n"
            + "HOME = restore original orientation\n"
            + "R = rotate random disc\n"
            + "S = shuffle colors\n"
            + "B = restore original colors\n"
            + "ESCAPE = exit game");
    }
    
    public RubiksCubeApplet(int sceneWidth, int sceneHeight){
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
        
        RubiksCubeApplet applet = new RubiksCubeApplet(sceneWidth, sceneHeight);
    }

}