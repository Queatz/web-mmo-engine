package camp.mage.server;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDB;
import com.arangodb.ArangoDBException;
import com.arangodb.ArangoDatabase;

/**
 * Created by jacob on 12/6/17.
 */

public class Persistence {

    private static final String DB_USER = "slime";
    private static final String DB_PASS = "slime";
    private static final String DB_DATABASE = "slime";
    public static final String DB_COLLECTION = "world";

    private static ArangoDatabase __arangoDatabase;

    public static ArangoCollection getCollection() {
        return getDb().collection(DB_COLLECTION);
    }

    public static ArangoDatabase getDb() {
        if (__arangoDatabase == null) {
            __arangoDatabase = new ArangoDB.Builder()
                    .user(DB_USER)
                    .password(DB_PASS)
                    .build()
                    .db(DB_DATABASE);

            try {
                __arangoDatabase.createCollection(DB_COLLECTION);
            } catch (ArangoDBException ignored) {
                // Whatever
            }
        }

        return __arangoDatabase;
    }
}
