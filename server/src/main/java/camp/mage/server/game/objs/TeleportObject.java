package camp.mage.server.game.objs;

import camp.mage.server.game.World;

/**
 * Created by jacob on 1/27/18.
 */

public class TeleportObject extends BaseObject {
    public TeleportObject(World world) {
        super(world);
    }

    @Override
    public String getType() {
        return "teleport";
    }
}
