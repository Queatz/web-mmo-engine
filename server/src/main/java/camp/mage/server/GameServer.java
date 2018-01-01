package camp.mage.server;

import java.io.IOException;
import java.util.HashSet;
import java.util.Set;

import javax.websocket.HandshakeResponse;
import javax.websocket.server.HandshakeRequest;
import javax.websocket.server.ServerEndpointConfig;

/**
 * Created by jacob on 12/6/17.
 */

public class GameServer extends ServerEndpointConfig.Configurator {

    private final Manager manager;
    private final Set<Client> sessions = new HashSet<>();

    public GameServer() {
        this.manager = new Manager(this);
    }

    public void send(Client client, String message) {
        try {
            client.getSession().getBasicRemote().sendText(message);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void broadcast(Client client, String message) {
        synchronized (sessions) {
            for (Client other : sessions) {
                if (!other.getSession().isOpen()) {
                    continue;
                }

                if (client != null && client.getSession().getId().equals(other.getSession().getId())) {
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

    public void got(Client client, String message) {
        manager.onPlayerMessage(client, message);
    }

    public void join(Client client) {
        manager.onPlayerJoin(client);

        synchronized (sessions) {
            sessions.add(client);
        }
    }

    public void leave(Client client) {
        manager.onPlayerLeave(client);

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

    public Manager getManager() {
        return manager;
    }
}
