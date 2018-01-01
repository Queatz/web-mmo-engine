package camp.mage.server;

import java.lang.reflect.InvocationTargetException;
import java.util.HashMap;
import java.util.Map;

import camp.mage.server.game.World;
import camp.mage.server.game.objs.BaseObject;
import camp.mage.server.game.objs.ButterflyObject;
import camp.mage.server.game.objs.MapObject;
import camp.mage.server.game.objs.Player;

/**
 * Created by jacob on 1/1/18.
 */

public class Objects {
    private final static Map<String, Class<? extends BaseObject>> objTypes = new HashMap<>();

    static {
        objTypes.put("map", MapObject.class);
        objTypes.put("player", Player.class);
        objTypes.put("butterfly", ButterflyObject.class);
    }

    public static BaseObject createFromType(World world, String type) {
        try {
            return objTypes.get(type).getConstructor(World.class).newInstance(world);
        } catch (InstantiationException | IllegalAccessException | InvocationTargetException | NoSuchMethodException e) {
            e.printStackTrace();
            return null;
        }
    }
}
