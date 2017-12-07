package camp.mage.server;

/**
 * Created by jacob on 12/7/17.
 */

public class EventJson {
    private String event;
    private Object data;

    public EventJson(Event data) {
        this.event = data.event();
        this.data = data;
    }

    public String getEvent() {
        return event;
    }

    public EventJson setEvent(String event) {
        this.event = event;
        return this;
    }

    public Object getData() {
        return data;
    }

    public EventJson setData(Object data) {
        this.data = data;
        return this;
    }
}
