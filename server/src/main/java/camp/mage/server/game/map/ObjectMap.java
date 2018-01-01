package camp.mage.server.game.map;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import camp.mage.server.game.objs.BaseObject;

/**
 * Created by jacob on 12/31/17.
 */

public class ObjectMap {

    private final Map<String, BaseObject> objs;
    private final Map<Class<? extends BaseObject>, Set<BaseObject>> objsByType;

    public ObjectMap() {
        objs = new HashMap<>();
        objsByType = new HashMap<>();
    }

    public void add(BaseObject obj) {
        objs.put(obj.getId(), obj);

        if (!objsByType.containsKey(obj.getClass())) {
            objsByType.put(obj.getClass(), new HashSet<>());
        }

        objsByType.get(obj.getClass()).add(obj);
    }

    public BaseObject remove(String id) {
        BaseObject obj = objs.remove(id);

        if (obj != null && objsByType.containsKey(obj.getClass())) {
            objsByType.get(obj.getClass()).remove(obj);
        }

        return obj;
    }

    public Collection<BaseObject> all() {
        return objs.values();
    }

    @SuppressWarnings("unchecked")
    public <T extends BaseObject> Collection<T> all(Class<T> clazz) {
        if (!objsByType.containsKey(clazz)) {
            return new HashSet<>();
        }

        return (Collection<T>) objsByType.get(clazz);
    }
}
