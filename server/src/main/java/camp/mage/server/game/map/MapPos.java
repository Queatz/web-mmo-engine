package camp.mage.server.game.map;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jacob on 12/31/17.
 */

public class MapPos {

    public float x;
    public float y;

    public MapPos() {}

    public MapPos(List<Float> pos) {
        this.x = pos.get(0);
        this.y = pos.get(1);
    }

    @Override
    public int hashCode() {
        return Float.hashCode(x) +
                Float.hashCode(y);
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof MapPos &&
                ((MapPos) o).x == x &&
                ((MapPos) o).y == y;
    }

    public List<Float> asList() {
        List<Float> result = new ArrayList<>();

        result.add(x);
        result.add(y);

        return result;
    }

    public void set(MapPos pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
}
