package camp.mage.server.game.objs;

import camp.mage.server.game.World;

/**
 * Created by jacob on 12/31/17.
 */

public class ItemObject extends BaseObject {

    private Integer qty;

    public ItemObject(World world) {
        super(world);
    }

    public Integer getQty() {
        return qty;
    }

    public ItemObject setQty(Integer qty) {
        this.qty = qty;
        return this;
    }
}
