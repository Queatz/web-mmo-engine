package camp.mage.server.game.events.server;

import java.util.stream.Collectors;

import camp.mage.server.game.events.defs.MapDef;
import camp.mage.server.game.events.defs.ObjDef;
import camp.mage.server.game.objs.BaseObject;
import camp.mage.server.game.objs.CharacterObject;
import camp.mage.server.game.objs.MapObject;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 12/31/17.
 */

public class StateServerEvent {

    private MapDef map;
    private String you;

    public StateServerEvent map(MapObject map) {
        this.map = new MapDef(
                map.getName(),
                map.getTilesAsList(),
                map.getObjs().all().stream()
                        .map((BaseObject o) -> {
                            ObjDef def = new ObjDef(o.getId(), o.getType(), o.getPos().asList(), o.getData());

                            if (o instanceof CharacterObject) {
                                def.health = ((CharacterObject) o).getHealth();
                                def.magic = ((CharacterObject) o).getMagic();
                                def.hunger = ((CharacterObject) o).getHunger();
                            }

                            return def;
                        })
                        .collect(Collectors.toList())
        );

        return this;
    }

    public StateServerEvent you(Player player) {
        this.you = player.getId();

        return this;
    }

    public MapDef getMap() {
        return map;
    }

    public String getYou() {
        return you;
    }
}
