package camp.mage.server.game.events.server;

import java.util.List;

/**
 * Created by jacob on 12/31/17.
 */

public class ObjServerEvent {

    private String id;
    private List<Float> pos;
    private Float health;
    private Float magic;
    private Float hunger;
    private Object custom;

    public ObjServerEvent() {}

    public ObjServerEvent(String id) {
        this.id = id;
    }

    public ObjServerEvent(String id, List<Float> pos) {
        this.id = id;
        this.pos = pos;
    }

    public ObjServerEvent(String id, List<Float> pos, Object custom) {
        this.id = id;
        this.pos = pos;
        this.custom = custom;
    }

    public String getId() {
        return id;
    }

    public ObjServerEvent setId(String id) {
        this.id = id;
        return this;
    }

    public List<Float> getPos() {
        return pos;
    }

    public ObjServerEvent setPos(List<Float> pos) {
        this.pos = pos;
        return this;
    }

    public Float getHealth() {
        return health;
    }

    public ObjServerEvent setHealth(Float health) {
        this.health = health;
        return this;
    }

    public Float getMagic() {
        return magic;
    }

    public ObjServerEvent setMagic(Float magic) {
        this.magic = magic;
        return this;
    }

    public Float getHunger() {
        return hunger;
    }

    public ObjServerEvent setHunger(Float hunger) {
        this.hunger = hunger;
        return this;
    }

    public Object getCustom() {
        return custom;
    }

    public ObjServerEvent setCustom(Object custom) {
        this.custom = custom;
        return this;
    }
}
