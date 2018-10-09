package camp.mage.server.game.objs.behaviors;

import camp.mage.server.game.map.MapPos;
import camp.mage.server.game.objs.BaseObject;
import camp.mage.server.game.objs.DropObject;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 1/13/18.
 */

public class RunAroundBehavior implements Behavior {

    public interface DropMaker {
        BaseObject make();
    }

    private BaseObject obj;
    private MapPos velocity;
    private float running;
    private Class<? extends BaseObject> dropType;
    private float dropChance;
    private DropMaker drop;

    public RunAroundBehavior(BaseObject obj) {
        this.obj = obj;
        velocity = new MapPos();
        dropType = DropObject.class;
    }

    @Override
    public void update() {
        if (obj.getMap() == null) {
            return;
        }

        if (Math.random() < 0.005) {
            velocity.x = (float) (.1f * (Math.random() - .5f));
            velocity.y = (float) (.1f * (Math.random() - .5f));
        }

        if (running <= 0) {
            for (Player player : obj.getMap().getObjs().all(obj.getPos(), Player.class, 3f)) {
                if (player.getState().contains(Player.PlayerState.ATTACKING) && player.getPos().squareDistance(obj.getPos()) < .5f) {
                    if (Math.random() < dropChance) {

                        if (drop != null || dropType != null) {
                            BaseObject drop = this.drop != null ? this.drop.make() : obj.getWorld().create(dropType);
                            obj.getWorld().join(drop);
                            drop.getPos().set(obj.getPos().add(new MapPos((float) Math.random() - .5f, (float) Math.random() - .5f)));
                            drop.setMap(obj.getMap());
                        }
                    }

                    player.addHealth(-0.1f);
                    player.addHunger(0.2f);

                    obj.getWorld().leave(obj);

                    return;
                }

                velocity.x = obj.getPos().x - player.getPos().x;
                velocity.y = obj.getPos().y - player.getPos().y;
                velocity.nor().mul(.1f);
                break;
            }

            for (BaseObject fellow : obj.getMap().getObjs().all(obj.getPos(), obj.getClass(), .5f)) {
                if (fellow == obj) {
                    continue;
                }

                velocity.x = obj.getPos().x - fellow.getPos().x;
                velocity.y = obj.getPos().y - fellow.getPos().y;
                velocity.nor().mul(.1f);
                break;
            }
        } else {
            running -= obj.getWorld().getDelta();
        }

        obj.getMap().moveBy(obj, velocity);

        if (obj.getMap().didCollide(obj)) {
            velocity.x = (float) (.2f * (Math.random() - .5f));
            velocity.y = (float) (.2f * (Math.random() - .5f));
            running = .75f;
        } else {
            running = 0;
        }
    }

    public Class<? extends BaseObject> getDropType() {
        return dropType;
    }

    public RunAroundBehavior setDropType(Class<? extends BaseObject> dropType) {
        this.dropType = dropType;
        return this;
    }

    public float getDropChance() {
        return dropChance;
    }

    public RunAroundBehavior setDropChance(float dropChance) {
        this.dropChance = dropChance;
        return this;
    }

    public RunAroundBehavior setDrop(DropMaker drop) {
        this.drop = drop;
        return this;
    }
}
