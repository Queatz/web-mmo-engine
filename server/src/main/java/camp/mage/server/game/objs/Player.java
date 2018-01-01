package camp.mage.server.game.objs;

import camp.mage.server.Client;
import camp.mage.server.game.World;

/**
 * Created by jacob on 12/6/17.
 */

public class Player extends BaseObject {

    private String name;
    private Client client;

    public Player(World world) {
        super(world);
    }

    @Override
    public String getType() {
        return "player";
    }

    public String getName() {
        return name;
    }

    public Player setName(String name) {
        this.name = name;
        return this;
    }

    public Client getClient() {
        return client;
    }

    public Player setClient(Client client) {
        this.client = client;
        return this;
    }
}
