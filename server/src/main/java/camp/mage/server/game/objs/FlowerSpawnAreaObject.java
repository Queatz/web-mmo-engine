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

    @Override
    public void update() {
        super.update();

        if (map == null) {
            return;
        }

        if (map.getObjs().near(pos, FlowerObject.class, .25f)) {
            return;
        }

        if (Math.random() < 0.01) {
            FlowerObject flowerObject = world.create(FlowerObject.class);
            world.join(flowerObject);
            flowerObject.getPos().set(pos);
            flowerObject.setMap(map);
        }
    }
}
