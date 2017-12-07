package camp.mage.server.game.events;

import camp.mage.server.Event;

/**
 * Created by jacob on 12/7/17.
 */

public class BasicError implements Event {
    @Override
    public String event() {
        return "basic_error";
    }

    private String message;

    public BasicError(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public BasicError setMessage(String message) {
        this.message = message;
        return this;
    }
}
