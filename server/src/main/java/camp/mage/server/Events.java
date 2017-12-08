package camp.mage.server;

import com.google.gson.Gson;

import camp.mage.server.game.events.JoinPlayer;
import camp.mage.server.game.events.LeavePlayer;
import camp.mage.server.game.events.PlayerInfo;
import camp.mage.server.game.events.SetPick;
import camp.mage.server.game.events.StartGame;

/**
 * Created by jacob on 12/7/17.
 */

public class Events {
    public static Event translate(Gson gson, EventJson eventJson) {
        Class<? extends Event> clazz;

        switch (eventJson.getEvent()) {
            case "player_info": clazz = PlayerInfo.class; break;
            case "join_player": clazz = JoinPlayer.class; break;
            case "leave_player": clazz = LeavePlayer.class; break;
            case "start_game": clazz = StartGame.class; break;
            case "set_pick": clazz = SetPick.class; break;
            default: return null;
        }

        return gson.fromJson(gson.toJson(eventJson.getData()), clazz);
    }
}
