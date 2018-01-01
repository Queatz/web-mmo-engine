package camp.mage.server.game.objs;

import java.util.ArrayList;
import java.util.List;

import camp.mage.server.game.World;
import camp.mage.server.game.events.server.MapServerEvent;
import camp.mage.server.game.events.server.ObjServerEvent;
import camp.mage.server.game.map.MapPos;
import camp.mage.server.game.map.MapTile;
import camp.mage.server.game.map.ObjectMap;
import camp.mage.server.game.map.TileMap;
import camp.mage.server.game.map.TilePos;

/**
 * Created by jacob on 12/31/17.
 */

public class MapObject extends BaseObject {

    private TileMap tiles;
    private ObjectMap objs;
    private String name;

    public MapObject(World world) {
        super(world);
        objs = new ObjectMap();
        tiles = new TileMap();
    }

    @Override
    public String getType() {
        return "map";
    }

    public void add(BaseObject obj) {
        MapServerEvent mapEvent = new MapServerEvent().add(obj);

        objs.all(Player.class).forEach(
                player -> world.send(player, mapEvent)
        );

        objs.add(obj);
    }

    public void remove(String id) {
        BaseObject obj = objs.remove(id);

        MapServerEvent mapEvent = new MapServerEvent().remove(obj);

        objs.all(Player.class).forEach(
                player -> world.send(player, mapEvent)
        );
    }

    public ObjectMap getObjs() {
        return objs;
    }

    public MapTile getTileAt(TilePos pos) {
        return tiles.getTileAt(pos);
    }

    public void setTileAt(TilePos pos, MapTile tile) {
        tiles.setTileAt(pos, tile);

        List<List<Integer>> tiles = new ArrayList<>();
        List<Integer> t = new ArrayList<>();
        t.add(pos.x);
        t.add(pos.y);
        t.add(tile.set);
        t.add(tile.index);
        tiles.add(t);

        MapServerEvent mapServerEvent = new MapServerEvent().tiles(tiles);

        objs.all(Player.class).forEach(player -> world.send(player, mapServerEvent));
    }

    public String getName() {
        return name;
    }

    public MapObject setName(String name) {
        this.name = name;
        return this;
    }

    public List<List<Integer>> getTilesAsList() {
        return tiles.allAsList();
    }

    public void move(BaseObject obj, MapPos pos) {
        obj.getPos().set(pos);

        ObjServerEvent objServerEvent = new ObjServerEvent(obj.getId(), obj.getPos().asList());

        objs.all(Player.class).forEach(player -> {
            if (player == obj) {
                return;
            }

            world.send(player, objServerEvent);
        });
    }
}
