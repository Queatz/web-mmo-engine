package camp.mage.server.game.map;

/**
 * Created by jacob on 12/31/17.
 */

public class MapTile {

    public int set;
    public int index;

    public MapTile() {}

    public MapTile(int set, int index) {
        this.set = set;
        this.index = index;
    }

    @Override
    public int hashCode() {
        return Integer.hashCode(set) +
                Integer.hashCode(index);
    }

    @Override
    public boolean equals(Object o) {
        return o instanceof MapTile &&
                ((MapTile) o).set == set &&
                ((MapTile) o).index == index;
    }
}
