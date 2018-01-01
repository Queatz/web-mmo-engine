package camp.mage.server.game.events.server;

import java.util.List;

/**
 * Created by jacob on 12/31/17.
 */

public class ObjServerEvent {

    private String id;
    private List<Float> pos;
    private Object custom;

    public ObjServerEvent() {}

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

    public List<Float> getPos() {
        return pos;
    }

    public Object getCustom() {
        return custom;
    }
}
