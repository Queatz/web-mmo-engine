package camp.mage.server.game.map;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import camp.mage.server.game.objs.BaseObject;

import static camp.mage.server.Log.log;


/**
 * Created by jacob on 12/31/17.
 */

public class ObjectMap {

    private final Map<String, BaseObject> objs;
    private final Map<Class<? extends BaseObject>, Set<BaseObject>> objsByType;
    private final Set<BaseObject> added = new HashSet<>();
    private final Set<BaseObject> removed = new HashSet<>();

    public ObjectMap() {
        objs = new HashMap<>();
        objsByType = new HashMap<>();
    }

    public void update() {
        all().forEach(o -> o.update());
        flush();
    }

    public void flush() {
        added.forEach(this::addInternal);
        removed.forEach(this::removeInternal);
        added.clear();
        removed.clear();
    }

    public void add(BaseObject obj) {
        added.add(obj);
    }

    public BaseObject remove(String id) {
        BaseObject obj = objs.get(id);

        if (obj != null) {
            this.removed.add(obj);
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

    public BaseObject get(String id) {
        return objs.getOrDefault(id, null);
    }

    public boolean near(MapPos pos, Class<? extends BaseObject> objType, float distance) {
        for (BaseObject obj : all(objType)) {
            if (obj.getPos().squareDistance(pos) < distance) {
                return true;
            }
        }

        return false;
    }

    public <T extends BaseObject> Iterable<T> all(MapPos pos, Class<T> objType, float distance) {
        return all(objType).stream()
                .filter(obj -> obj.getPos().squareDistance(pos) < distance)
                .collect(Collectors.toSet());
    }

    private void addInternal(BaseObject obj) {
        objs.put(obj.getId(), obj);

        if (!objsByType.containsKey(obj.getClass())) {
            objsByType.put(obj.getClass(), new HashSet<>());
        }

        objsByType.get(obj.getClass()).add(obj);
    }

    private void removeInternal(BaseObject obj) {
        objs.remove(obj.getId());

        if (objsByType.containsKey(obj.getClass())) {
            objsByType.get(obj.getClass()).remove(obj);
        }
    }
}
