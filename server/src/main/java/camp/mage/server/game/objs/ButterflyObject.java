package camp.mage.server.game.objs;

import camp.mage.server.game.World;
import camp.mage.server.game.map.MapPos;

/**
 * Created by jacob on 1/1/18.
 */

public class ButterflyObject extends BaseObject {

    private MapPos velocity;

    public ButterflyObject(World world) {
        super(world);

        collides = true;
        velocity = new MapPos();
    }

    @Override
    public String getType() {
        return "butterfly";
    }

    @Override
    public void update() {
        super.update();

        if (Math.random() < 0.025) {
            velocity.x = (float) (.1f * (Math.random() - .5f));
            velocity.y = (float) (.1f * (Math.random() - .5f));
        }

        getMap().moveBy(this, velocity);
    }
}
