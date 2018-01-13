package camp.mage.server.game.objs;

import camp.mage.server.game.World;
import camp.mage.server.game.objs.behaviors.Behavior;
import camp.mage.server.game.objs.behaviors.RunAroundBehavior;

/**
 * Created by jacob on 1/1/18.
 */

public class ButterflyObject extends BaseObject {

    private Behavior run;

    public ButterflyObject(World world) {
        super(world);

        collides = true;
        run = new RunAroundBehavior(this);
    }

    @Override
    public String getType() {
        return "butterfly";
    }

    @Override
    public void update() {
        super.update();
        run.update();
    }
}
