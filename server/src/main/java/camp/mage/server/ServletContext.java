package camp.mage.server;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;

/**
 * Created by jacob on 1/5/18.
 */

public class ServletContext implements ServletContextListener {

    private final static Set<GameServer> set = Collections.synchronizedSet(new HashSet<>());

    public static void register(GameServer server) {
        set.add(server);
    }

    @Override
    public void contextInitialized(ServletContextEvent sce) {

    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        for (GameServer server : set) {
            server.stop();
        }
    }
}
