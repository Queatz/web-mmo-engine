package camp.mage.server.game.events.defs;

import java.util.List;

/**
 * Created by jacob on 12/31/17.
 */

public class ObjDef {

    public String id;
    public String type;
    public List<Float> pos;

    public ObjDef() {}

    public ObjDef(String id, String type, List<Float> pos) {
        this.id = id;
        this.type = type;
        this.pos = pos;
    }
}
