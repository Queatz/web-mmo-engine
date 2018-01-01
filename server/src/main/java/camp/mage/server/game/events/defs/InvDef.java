package camp.mage.server.game.events.defs;

import java.util.List;

/**
 * Created by jacob on 12/31/17.
 */

public class InvDef {

    public String type;
    public Integer qty;
    public List<Float> pos;

    public InvDef() {}

    public InvDef(String type, Integer qty, List<Float> pos) {
        this.type = type;
        this.qty = qty;
        this.pos = pos;
    }
}
