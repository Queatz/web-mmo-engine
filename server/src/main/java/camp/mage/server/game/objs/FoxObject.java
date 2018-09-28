package camp.mage.server.game.objs;

import camp.mage.server.game.World;
import camp.mage.server.game.objs.behaviors.Behavior;
import camp.mage.server.game.objs.behaviors.RunAroundBehavior;

/**
 * Created by jacob on 9/26/18.
 */

public class FoxObject extends CharacterObject {

    private Behavior run;

    public FoxObject(World world) {
        super(world);

        collides = true;
        run = new RunAroundBehavior(this)
                .setDropChance(.5f)
                .setDrop(() -> world.create(DropObject.class).setItemType("bunny-fur"));
    }

    @Override
    public String getType() {
        return "fox";
    }

    @Override
    public void update() {
        super.update();
        run.update();
    }
}
