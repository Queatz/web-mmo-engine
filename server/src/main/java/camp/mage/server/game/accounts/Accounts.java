package camp.mage.server.game.accounts;

import java.util.HashMap;
import java.util.Map;

import camp.mage.server.game.World;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 1/1/18.
 */

public class Accounts {

    private final Map<String, Player> playersByToken = new HashMap<>();
    private final Map<String, Player> playersByLogin = new HashMap<>();

    private final World world;

    public Accounts(World world) {
        this.world = world;
    }

    public void setPlayerForToken(String token, Player player) {
        playersByToken.put(token, player);
    }

    public void setPlayerForLogin(String username, String password, Player player) {
        playersByLogin.put(username + "|" + password, player);
    }

    public Player getPlayerFromToken(String token) {
        return playersByToken.getOrDefault(token, null);
    }

    public Player getPlayerFromLogin(String username, String password) {
        return playersByLogin.getOrDefault(username + "|" + password, null);
    }
}
