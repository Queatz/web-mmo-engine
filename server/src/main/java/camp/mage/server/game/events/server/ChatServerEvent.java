package camp.mage.server.game.events.server;

import camp.mage.server.game.events.defs.PlayerDef;

/**
 * Created by jacob on 12/31/17.
 */

public class ChatServerEvent {

    public PlayerDef from;
    public String room;
    public String msg;

    public ChatServerEvent() {}

    public ChatServerEvent(PlayerDef from, String room, String msg) {
        this.from = from;
        this.room = room;
        this.msg = msg;
    }
}
