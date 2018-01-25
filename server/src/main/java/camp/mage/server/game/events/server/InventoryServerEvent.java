package camp.mage.server.game.events.server;

import java.util.ArrayList;
import java.util.List;

import camp.mage.server.game.accounts.Inventory;
import camp.mage.server.game.events.defs.InvDef;

/**
 * Created by jacob on 12/31/17.
 */

public class InventoryServerEvent {

    public List<InvDef> set;

    public InventoryServerEvent set(String itemType, float amount) {
        if (set == null) {
            set = new ArrayList<>();
        }

        set.add(new InvDef(itemType, amount));

        return this;
    }

    public List<InvDef> getSet() {
        return set;
    }

    public InventoryServerEvent inventory(Inventory inventory) {
        inventory.all().forEach(this::set);
        return this;
    }
}
