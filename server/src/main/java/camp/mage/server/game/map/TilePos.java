package camp.mage.server.game.map;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by jacob on 1/1/18.
 */

public class TilePos {
    public int x;
    public int y;

    public TilePos() {}

    public TilePos(List<Integer> pos) {
        this.x = pos.get(0);
        this.y = pos.get(1);
    }

    public TilePos(int x, int y) {
        this.x = x;
        this.y = y;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(x) +
                Integer.hashCode(y);
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof TilePos &&
                ((TilePos) o).x == x &&
                ((TilePos) o).y == y;
    }

    public List<Integer> asList() {
        List<Integer> result = new ArrayList<>();

        result.add(x);
        result.add(y);

        return result;
    }

    public void set(TilePos pos) {
        this.x = pos.x;
        this.y = pos.y;
    }
}
