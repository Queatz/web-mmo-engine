package camp.mage.server;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

import camp.mage.server.game.Game;

/**
 * Created by jacob on 12/6/17.
 */

public class GameServer extends ServerEndpointConfig.Configurator {

    private final Game game = new Game();
    private final Set<Client> sessions = new HashSet<>();

    public void broadcast(Client chat, String message) {
        synchronized (sessions) {
            for (Client other : sessions) {
                if (!other.getSession().isOpen()) {
                    continue;
                }

                if (chat.getSession().getId().equals(other.getSession().getId())) {
                    continue;
                }

                try {
                    other.getSession().getBasicRemote().sendText(message);
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public void join(Client client) {
        game.onPlayerJoin(client.getPlayer());

        synchronized (sessions) {
            sessions.add(client);
        }
    }

    public void leave(Client client) {
        game.onPlayerLeave(client.getPlayer());

        synchronized (sessions) {
            sessions.remove(client);
        }
    }

    @Override
    public void modifyHandshake(ServerEndpointConfig conf,
                                HandshakeRequest req,
                                HandshakeResponse resp) {
        conf.getUserProperties().put("server", this);
    }

}
