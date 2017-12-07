package camp.mage.server;

import com.google.gson.Gson;

import camp.mage.server.game.events.JoinPlayer;
import camp.mage.server.game.events.LeavePlayer;
import camp.mage.server.game.events.PlayerInfo;
import camp.mage.server.game.events.StartGame;

/**
 * Created by jacob on 12/7/17.
 */

public class Events {
    public static Event translate(Gson gson, EventJson eventJson) {
        switch (eventJson.getEvent()) {
            case "player_info":
                return gson.fromJson(gson.toJson(eventJson.getData()), PlayerInfo.class);
            case "join_player":
                return gson.fromJson(gson.toJson(eventJson.getData()), JoinPlayer.class);
            case "leave_player":
                return gson.fromJson(gson.toJson(eventJson.getData()), LeavePlayer.class);
            case "start_game":
                return gson.fromJson(gson.toJson(eventJson.getData()), StartGame.class);
            default:
                return null;
        }
    }
}
