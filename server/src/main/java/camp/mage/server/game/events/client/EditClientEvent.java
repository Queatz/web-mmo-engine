package camp.mage.server.game.events.client;

import java.util.List;

import camp.mage.server.game.events.defs.ObjDef;

/**
 * Created by jacob on 12/31/17.
 */

public class EditClientEvent {
    public List<Integer> tile;
    public ObjDef addObj;
    public String removeObj;
    public ObjDef moveObj;
}
