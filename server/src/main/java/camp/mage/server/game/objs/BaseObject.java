package camp.mage.server.game.objs;

import camp.mage.server.game.World;
import camp.mage.server.game.map.MapPos;

/**
 * Created by jacob on 12/31/17.
 */

public class BaseObject {

    private String id;
    protected World world;
    protected MapObject map;
    protected MapPos pos;

    public BaseObject(World world) {
        this.world = world;
        pos = new MapPos();
    }

    public String getId() {
        return id;
    }

    public BaseObject setId(String id) {
        this.id = id;
        return this;
    }

    public String getType() {
        return getClass().getSimpleName();
    }

    public World getWorld() {
        return world;
    }

    public MapObject getMap() {
        return map;
    }

    public BaseObject setMap(MapObject map) {
        if (this.map != null) {
            this.map.remove(id);
        }

        this.map = map;

        this.map.add(this);

        return this;
    }

    public MapPos getPos() {
        return pos;
    }
}
