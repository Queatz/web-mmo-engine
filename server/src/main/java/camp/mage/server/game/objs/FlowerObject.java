package camp.mage.server.game.objs;

import camp.mage.server.game.World;

/**
 * Created by jacob on 1/4/18.
 */

public class FlowerObject extends BaseObject {
    public FlowerObject(World world) {
        super(world);
    }

    @Override
    public String getType() {
        return "flower";
    }

    @Override
    public void update() {
        super.update();

        for (Player player : map.getObjs().all(pos, Player.class, 0.5f)) {
            player.addHealth(0.2f);
            world.leave(this);
            break;
        }
    }
}
