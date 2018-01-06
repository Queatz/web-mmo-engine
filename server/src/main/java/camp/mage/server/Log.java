package camp.mage.server;

import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by jacob on 1/4/18.
 */

public class Log {
    public static void log(String message) {
        Logger.getAnonymousLogger().log(Level.WARNING, message);
    }
}
