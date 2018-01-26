package camp.mage.server.game.accounts;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by jacob on 1/24/18.
 */

public class Inventory {

    private Map<String, Float> items;

    public Inventory() {
        this.items = new HashMap<>();
    }

    public Map<String, Float> all() {
        return items;
    }

    public void add(String itemType, float amount) {
        if (!items.containsKey(itemType)) {
            items.put(itemType, 0f);
        }

        items.put(itemType, items.get(itemType) + amount);
    }

    public float amount(String itemType) {
        return items.containsKey(itemType) ? items.get(itemType) : 0;
    }

    public boolean available(String type, float qty) {
        return items.containsKey(type) && items.get(type) >= qty;
    }
}
