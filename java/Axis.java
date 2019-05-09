package rubikscube;

public class Axis {

    public int axisIndex, positivityFactor;
    public boolean isPositiveAxis;
    
    public Axis(int axisIndex, boolean isPositiveAxis){
        this.axisIndex = axisIndex;
        positivityFactor = isPositiveAxis ? 1 : -1;
        this.isPositiveAxis = isPositiveAxis;
    }
    
    public Axis(int axisIndex){
        this(axisIndex, true);
    }
    
    public int toInt(){
        return axisIndex + (isPositiveAxis ? 0 : 3);
    }
    
    public Axis mirror(){
        return new Axis(axisIndex, !isPositiveAxis);
    }
    
    @Override
    public String toString(){
        return (new String[]{ "X", "Y", "Z" }[axisIndex]) + (isPositiveAxis ? "+" : "-");
    }
    
}
