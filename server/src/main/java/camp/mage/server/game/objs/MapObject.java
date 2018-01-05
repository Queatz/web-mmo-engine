package camp.mage.server.game.objs;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

    public static final float TILE_SIZE = 0.5f;

    private TileMap tiles;
    private ObjectMap objs;
    private String name;

    private Map<Integer, Set<Integer>> nonCollidingTiles;

    public MapObject(World world) {
        super(world);
        objs = new ObjectMap();
        tiles = new TileMap();

        nonCollidingTiles = new HashMap<>();
        Set<Integer> grassyTiles = new HashSet<>();
        grassyTiles.add(20);
        grassyTiles.add(24);
        grassyTiles.add(25);
        grassyTiles.add(26);
        grassyTiles.add(27);
        grassyTiles.add(33);
        grassyTiles.add(35);
        grassyTiles.add(36);
        grassyTiles.add(40);
        grassyTiles.add(41);
        grassyTiles.add(42);
        grassyTiles.add(43);
        grassyTiles.add(44);
        grassyTiles.add(46);
        grassyTiles.add(48);
        grassyTiles.add(49);
        grassyTiles.add(50);
        grassyTiles.add(51);
        grassyTiles.add(56);
        grassyTiles.add(57);
        grassyTiles.add(58);
        grassyTiles.add(59);
        nonCollidingTiles.put(0, grassyTiles);
        nonCollidingTiles.put(1, new HashSet<>());
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

        if (obj != null) {
            MapServerEvent mapEvent = new MapServerEvent().remove(obj);

            objs.all(Player.class).forEach(
                    player -> world.send(player, mapEvent)
            );
        }
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

        if (obj.collides) {
            collide(obj);
        }

        if (new Date().getTime() - obj.lastSendPosTime.getTime() > 500 && !obj.lastSendPos.equals(obj.pos)) {
            obj.lastSendPosTime = new Date();
            obj.lastSendPos.set(obj.pos);
            ObjServerEvent objServerEvent = new ObjServerEvent(obj.getId(), obj.getPos().asList());

            objs.all(Player.class).forEach(player -> {
                if (player == obj) {
                    return;
                }

                world.send(player, objServerEvent);
            });
        }
    }

    public void moveBy(BaseObject obj, MapPos amount) {
        move(obj, obj.getPos().add(amount));
    }

    public boolean collide(BaseObject obj) {
        MapTile tile = getTileAt(obj.getPos().toTilePos());

        if (nonCollidingTiles.get(tile.set).contains(tile.index)) {
            return false;
        }

        tile = getTileAt(new MapPos(obj.pos.x, obj.prevPos.y).toTilePos());

        if (nonCollidingTiles.get(tile.set).contains(tile.index)) {
            obj.pos.y = obj.prevPos.y;
            return true;
        }

        tile = getTileAt(new MapPos(obj.prevPos.x, obj.pos.y).toTilePos());

        if (nonCollidingTiles.get(tile.set).contains(tile.index)) {
            obj.pos.x = obj.prevPos.x;
            return true;
        }

        obj.pos.set(obj.prevPos);

        return true;
    }
}
