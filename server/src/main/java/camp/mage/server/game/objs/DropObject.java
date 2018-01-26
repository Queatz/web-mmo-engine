package camp.mage.server.game.objs;

import com.google.gson.Gson;

import camp.mage.server.game.World;

/**
 * Created by jacob on 1/13/18.
 */

public class DropObject extends BaseObject {

    private String itemType;
    private float quantity = 1;

    public DropObject(World world) {
        super(world);
    }

    @Override
    public String getType() {
        return "drop";
    }

    @Override
    public void update() {
        super.update();

        if (map == null) {
            return;
        }

        for (Player player : map.getObjs().all(pos, Player.class, 0.5f)) {
            if (player.getState().contains(Player.PlayerState.INTERACTING)) {
                player.getAccount().addInventory(itemType, 1);
                world.leave(this);
                break;
            }
        }
    }

    @Override
    public Object getData() {
        return new ObjData(itemType, quantity);
    }

    @Override
    public String freeze() {
        return new Gson().toJson(new ObjData(itemType, quantity));
    }

    @Override
    public void thaw(String data) {
        ObjData d = new Gson().fromJson(data, ObjData.class);
        this.itemType = d.type;
        this.quantity = d.quantity;
    }

    public String getItemType() {
        return itemType;
    }

    public DropObject setItemType(String itemType) {
        this.itemType = itemType;
        return this;
    }

    public float getQuantity() {
        return quantity;
    }

    public DropObject setQuantity(float quantity) {
        this.quantity = quantity;
        return this;
    }

    private static class ObjData {
        public final String type;
        public final float quantity;

        private ObjData(String type, float quantity) {
            this.type = type;
            this.quantity = quantity;
        }
    }
}
