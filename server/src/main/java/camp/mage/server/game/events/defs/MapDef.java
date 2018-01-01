package camp.mage.server.game.events.defs;

import java.util.List;

/**
 * Created by jacob on 12/31/17.
 */

public class MapDef {

    public String name;
    public List<List<Integer>> tiles;
    public List<ObjDef> objs;

    public MapDef() {}

    public MapDef(String name, List<List<Integer>> tiles, List<ObjDef> objs) {
        this.name = name;
        this.tiles = tiles;
        this.objs = objs;
    }
}
