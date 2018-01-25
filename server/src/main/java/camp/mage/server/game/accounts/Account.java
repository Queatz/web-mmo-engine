package camp.mage.server.game.accounts;

import camp.mage.server.game.events.server.InventoryServerEvent;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 1/24/18.
 */

public class Account {
    private final Inventory inventory;
    private Player player;

    public Account() {
        inventory = new Inventory();
    }

    public void addInventory(String itemType, float amount) {
        inventory.add(itemType, amount);

        if (player != null) {
            player.getWorld().send(player, new InventoryServerEvent().set(itemType, inventory.amount(itemType)));
        }
    }

    public Player getPlayer() {
        return player;
    }

    public Account setPlayer(Player player) {
        this.player = player;
        return this;
    }

    public Inventory getInventory() {
        return inventory;
    }
}
