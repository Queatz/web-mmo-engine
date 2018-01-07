package camp.mage.server.game;

import com.arangodb.entity.DocumentField;

import camp.mage.server.game.map.MapPos;
import camp.mage.server.game.objs.BaseObject;

/**
 * Created by jacob on 1/6/18.
 */

public class FrozenObject {
    @DocumentField(DocumentField.Type.KEY)
    public String id;

    public MapPos pos;
    public String type;
    public String map;
    public String data;

    public FrozenObject() {}

    public static FrozenObject from(BaseObject obj) {
        FrozenObject frozenObj = new FrozenObject();
        frozenObj.id = obj.getId();
        frozenObj.type = obj.getType();
        frozenObj.pos = obj.getPos();
        frozenObj.map = (obj.getMap() == null ? null : obj.getMap().getId());
        frozenObj.data = obj.freeze();
        return frozenObj;
    }
}
