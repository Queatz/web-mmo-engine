package camp.mage.server.game.map;

import java.util.ArrayList;
import java.util.List;

import camp.mage.server.game.objs.MapObject;

/**
 * Created by jacob on 12/31/17.
 */

public class MapPos {

    public float x;
    public float y;

    public MapPos() {}

    public MapPos(float x, float y) {
        this.x = x;
        this.y = y;
    }

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

    public MapPos add(MapPos other) {
        return new MapPos(x + other.x, y + other.y);
    }

    public TilePos toTilePos() {
        return new TilePos(
                (int) Math.floor(x / MapObject.TILE_SIZE),
                (int) Math.floor(y / MapObject.TILE_SIZE)
        );
    }

    public float squareDistance(MapPos pos) {
        return Math.abs(pos.x - x) + Math.abs(pos.y - y);
    }
}
