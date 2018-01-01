package camp.mage.server.game.events.server;

/**
 * Created by jacob on 12/7/17.
 */

public class BasicErrorServerEvent {
    private String message;

    public BasicErrorServerEvent() {}

    public BasicErrorServerEvent(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public BasicErrorServerEvent setMessage(String message) {
        this.message = message;
        return this;
    }
}
