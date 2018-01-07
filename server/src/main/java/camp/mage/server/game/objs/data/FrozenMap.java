package camp.mage.server.game.objs.data;

import java.util.List;

/**
 * Created by jacob on 1/6/18.
 */

public class FrozenMap {
    public boolean isStartingMap;
    public List<List<Integer>> tiles;

    public FrozenMap() {
    }

    public FrozenMap(boolean isStartingMap, List<List<Integer>> tiles) {
        this.isStartingMap = isStartingMap;
        this.tiles = tiles;
    }
}
