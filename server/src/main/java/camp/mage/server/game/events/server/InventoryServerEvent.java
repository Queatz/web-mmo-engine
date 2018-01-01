package camp.mage.server.game.events.server;

import java.util.ArrayList;
import java.util.List;

import camp.mage.server.game.events.defs.InvDef;
import camp.mage.server.game.objs.ItemObject;

/**
 * Created by jacob on 12/31/17.
 */

public class InventoryServerEvent {

    public List<InvDef> add;
    public List<InvDef> remove;

    public InventoryServerEvent add(ItemObject inventoryItem) {
        if (add == null) {
            add = new ArrayList<>();
        }

        add.add(new InvDef(inventoryItem.getType(), inventoryItem.getQty(), inventoryItem.getPos().asList()));

        return this;
    }

    public InventoryServerEvent remove(ItemObject inventoryItem) {
        if (remove == null) {
            remove = new ArrayList<>();
        }

        remove.add(new InvDef(inventoryItem.getType(), inventoryItem.getQty(), inventoryItem.getPos().asList()));

        return this;
    }

    public List<InvDef> getAdd() {
        return add;
    }

    public List<InvDef> getRemove() {
        return remove;
    }
}
