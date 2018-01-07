package camp.mage.server;

import com.arangodb.ArangoCollection;
import com.arangodb.ArangoDatabase;

/**
 * Created by jacob on 1/6/18.
 */

public class StorageEngine {

    private final ArangoCollection collection;
    private final ArangoDatabase db;

    public StorageEngine() {
        db = Persistence.getDb();
        collection = Persistence.getCollection();
    }

    public ArangoCollection getCollection() {
        return collection;
    }

    public ArangoDatabase getDb() {
        return db;
    }
}
