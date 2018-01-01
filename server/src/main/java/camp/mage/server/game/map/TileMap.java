package camp.mage.server.game.map;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Created by jacob on 12/31/17.
 */

public class TileMap {

    private static final MapTile defaultTile = new MapTile(0, 20);

    private Map<TilePos, MapTile> tiles;

    public TileMap() {
        tiles = new HashMap<>();
    }

    public MapTile getTileAt(TilePos pos) {
        return tiles.getOrDefault(pos, defaultTile);
    }

    public MapTile setTileAt(TilePos pos, MapTile tile) {
        return tiles.put(pos, tile);
    }

    public List<List<Integer>> allAsList() {
        return tiles.keySet().stream()
                .map(this::tileAsList)
                .collect(Collectors.toList());
    }

    public List<Integer> tileAsList(TilePos k) {
        List<Integer> result = new ArrayList<>();

        result.add(k.x);
        result.add(k.y);
        result.add(tiles.getOrDefault(k, defaultTile).set);
        result.add(tiles.getOrDefault(k, defaultTile).index);

        return result;
    }
}
