package camp.mage.server;

import java.io.IOException;

import javax.websocket.EndpointConfig;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import camp.mage.server.game.objs.Player;

import static java.util.concurrent.TimeUnit.MINUTES;

@ServerEndpoint(value = "/ws", configurator = GameServer.class)
public class Client {

    private Session session;
    private GameServer server;
    private Player player;

    @OnOpen
    public void onOpen(Session session, EndpointConfig endpointConfig) {
        session.setMaxIdleTimeout(MINUTES.toMillis(10));

        this.session = session;

        server = (GameServer) endpointConfig.getUserProperties().get("server");

        player = new Player(server.getManager().getWorld());
        server.join(this);
    }

    @OnClose
    public void onClose() {
        if (session.isOpen()) {
            try {
                session.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        server.leave(this);
    }

    @OnMessage
    public void onMessage(String message) throws IOException {
        server.got(this, message);
    }

    @OnMessage
    public void onData(byte[] data) throws IOException {
    }

    @OnError
    public void onError(Throwable t) throws Throwable {
        t.printStackTrace();
    }

    public GameServer getServer() {
        return server;
    }

    public Session getSession() {
        return session;
    }

    public Player getPlayer() {
        return player;
    }
}
