package camp.mage.server.game.accounts;

import java.util.HashMap;
import java.util.Map;

import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 1/1/18.
 */

public class Accounts {

    private Map<String, Player> playersByToken = new HashMap<>();

    public void setPlayerForToken(String token, Player player) {
        playersByToken.put(token, player);
    }

    public Player getPlayerFromToken(String token) {
        return playersByToken.getOrDefault(token, null);
    }
}
