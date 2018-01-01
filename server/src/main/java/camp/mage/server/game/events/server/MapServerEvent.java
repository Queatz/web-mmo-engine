package camp.mage.server.game.events.server;

import java.util.ArrayList;
import java.util.List;

import camp.mage.server.game.events.defs.ObjDef;
import camp.mage.server.game.objs.BaseObject;

/**
 * Created by jacob on 12/31/17.
 */

public class MapServerEvent {

    private List<ObjDef> add;
    private List<String> remove;
    private String weather;
    private List<List<Integer>> tiles;

    public MapServerEvent add(BaseObject obj) {
        if (add == null) {
            add = new ArrayList<>();
        }

        add.add(new ObjDef(obj.getId(), obj.getType(), obj.getPos().asList()));

        return this;
    }

    public MapServerEvent remove(BaseObject obj) {
        if (remove == null) {
            remove = new ArrayList<>();
        }

        remove.add(obj.getId());

        return this;
    }

    public MapServerEvent weather(String weather) {
        this.weather = weather;

        return this;
    }

    public MapServerEvent tiles(List<List<Integer>> tiles) {
        this.tiles = tiles;

        return this;
    }

    public List<ObjDef> getAdd() {
        return add;
    }

    public List<String> getRemove() {
        return remove;
    }

    public String getWeather() {
        return weather;
    }

    public List<List<Integer>> getTiles() {
        return tiles;
    }
}
