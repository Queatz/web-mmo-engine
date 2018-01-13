package camp.mage.server.game.objs;

import camp.mage.server.game.World;
import camp.mage.server.game.objs.behaviors.Behavior;
import camp.mage.server.game.objs.behaviors.RunAroundBehavior;

/**
 * Created by jacob on 1/13/18.
 */

public class BunnyObject extends CharacterObject {

    private Behavior run;

    public BunnyObject(World world) {
        super(world);

        collides = true;
        run = new RunAroundBehavior(this)
                .setDropChance(.2f)
                .setDropType(DropObject.class);
    }

    @Override
    public String getType() {
        return "bunny";
    }

    @Override
    public void update() {
        super.update();
        run.update();
    }
}
