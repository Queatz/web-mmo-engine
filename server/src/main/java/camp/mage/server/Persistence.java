package camp.mage.server;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoCursor;
import com.arangodb.ArangoDB;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;
import com.google.gson.JsonObject;

/**
 * Created by jacob on 12/6/17.
 */

public class Persistence {

    private static final String DB_USER = "webgame";
    private static final String DB_PASS = "webgame";
    private static final String DB_COLLECTION = "webgame";

    private static ArangoDatabase __arangoDatabase;

    public static boolean isEmpty() {
        return getCollection().count().getCount() == 0;
    }

    public static void loadAll() {
        ArangoCursor<Fossil> cursor = getDb().query("for x in " + DB_COLLECTION + " return x", null, null, Fossil.class);

        while (cursor.hasNext()) {
            GameObject gameObject =
                    (GameObject) Fossilize.defossilize(Json.from(cursor.next().getFossil(), JsonObject.class));

            Game.world.add(gameObject);
        }
    }

    public static void saveAll() {
        Game.world.save();
    }

    private static ArangoCollection getCollection() {
        return getDb().collection(DB_COLLECTION);
    }

    private static ArangoDatabase getDb() {
        if (__arangoDatabase != null) {
            return __arangoDatabase;
        }

        __arangoDatabase = new ArangoDB.Builder()
                .user(DB_USER)
                .password(DB_PASS)
                .build()
                .db();

        try {
            __arangoDatabase.createCollection(DB_COLLECTION);
        } catch (ArangoDBException ignored) {
            // Whatever
        }

        return __arangoDatabase;
    }
}
