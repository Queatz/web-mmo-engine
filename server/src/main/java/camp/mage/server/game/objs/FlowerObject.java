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

        if (map != null) for (Player player : map.getObjs().all(pos, Player.class, 0.5f)) {
            if (player.getState().contains(Player.PlayerState.INTERACTING)) {
                player.getAccount().addInventory("flower", 1);
                world.leave(this);
                break;
            }
        }
    }
}
