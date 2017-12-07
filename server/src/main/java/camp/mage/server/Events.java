package camp.mage.server;

import com.google.gson.Gson;

import camp.mage.server.game.events.PlayerInfo;

/**
 * Created by jacob on 12/7/17.
 */

public class Events {
    public static Event translate(Gson gson, EventJson eventJson) {
        switch (eventJson.getEvent()) {
            case "player_info":
                return gson.fromJson(gson.toJson(eventJson.getData()), PlayerInfo.class);
            default:
                return null;
        }
    }
}
