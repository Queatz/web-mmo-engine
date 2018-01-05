package camp.mage.server.game.objs;

import camp.mage.server.game.World;

/**
 * Created by jacob on 1/4/18.
 */

public class FlowerSpawnAreaObject extends BaseObject {
    public FlowerSpawnAreaObject(World world) {
        super(world);
    }

    @Override
    public String getType() {
        return "flower-spawn-area";
    }
}
