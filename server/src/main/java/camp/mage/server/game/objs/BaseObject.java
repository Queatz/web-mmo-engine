package camp.mage.server.game.objs;

import java.util.Date;

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
    protected MapPos prevPos;
    protected boolean collides;

    protected MapPos lastSendPos;
    protected Date lastSendPosTime;

    public BaseObject(World world) {
        this.world = world;
        pos = new MapPos();
        prevPos = new MapPos();
        lastSendPos = new MapPos();
        lastSendPosTime = new Date();
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

    public void update() {
        prevPos.set(pos);
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

        if (this.map != null) {
            this.map.add(this);
        }

        return this;
    }

    public MapPos getPos() {
        return pos;
    }
}
