package camp.mage.server.game.events.defs;

import java.util.List;

/**
 * Created by jacob on 12/31/17.
 */

public class InvDef {

    public String type;
    public Float qty;
    public List<Float> pos;

    public InvDef() {}

    public InvDef(String type, Float qty, List<Float> pos) {
        this.type = type;
        this.qty = qty;
        this.pos = pos;
    }

    public InvDef(String type, Float qty) {
        this.type = type;
        this.qty = qty;
    }
}
