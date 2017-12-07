package camp.mage.server;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDB;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;

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
