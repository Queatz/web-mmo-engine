package camp.mage.server.game.objs;

import java.util.HashSet;
import java.util.Set;

import camp.mage.server.Client;
import camp.mage.server.game.World;
import camp.mage.server.game.accounts.Account;
import camp.mage.server.game.events.defs.InvDef;

/**
 * Created by jacob on 12/6/17.
 */

public class Player extends CharacterObject {

    public enum PlayerState {
        ATTACKING("attack"),
        INTERACTING("interact");

        private final String event;

        PlayerState(String event) {
            this.event = event;
        }

        public String event() {
            return event;
        }
    }

    public static class PlayerStateCustomEvent {
        public Set<String> state;

        public Set<String> getState() {
            return state;
        }

        public PlayerStateCustomEvent setState(Set<String> state) {
            this.state = state;
            return this;
        }
    }

    private String name;
    private Client client;
    private Account account;
    private Set<PlayerState> state;

    public Player(World world) {
        super(world);
        state = new HashSet<>();
    }

    @Override
    public String getType() {
        return "player";
    }

    public void useInventory(InvDef inv) {
        if (account == null) {
            return;
        }

        if (account.getInventory().available(inv.type, inv.qty)) {
            account.addInventory(inv.type, -inv.qty);
            addHealth(0.2f);
        }
    }

    public void dropInventory(InvDef inv) {
        if (account == null) {
            return;
        }

        if (account.getInventory().available(inv.type, inv.qty)) {
            account.addInventory(inv.type, -inv.qty);
            DropObject drop = world.create(DropObject.class);
            if (inv.pos != null) {
                drop.getPos().x = inv.pos.get(0);
                drop.getPos().y = inv.pos.get(1);
            } else {
                drop.getPos().set(pos);
            }

            drop.setQuantity(inv.qty);
            drop.setItemType(inv.type);
            drop.setMap(map);

            world.join(drop);
        }
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

    public Set<PlayerState> getState() {
        return state;
    }

    public Account getAccount() {
        return account;
    }

    public Player setAccount(Account account) {
        this.account = account;
        return this;
    }
}
