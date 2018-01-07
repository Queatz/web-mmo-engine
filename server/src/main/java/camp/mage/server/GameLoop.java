package camp.mage.server;

import java.util.concurrent.atomic.AtomicBoolean;

import camp.mage.server.game.World;

import static camp.mage.server.Log.log;

/**
 * Created by jacob on 1/1/18.
 */

public class GameLoop extends Thread {

    private final AtomicBoolean dead = new AtomicBoolean(false);
    private final Manager manager;
    private World world;

    public GameLoop(Manager manager) {
        this.manager = manager;
    }

    @Override
    public void run() {
        this.world = new World(manager);

        log("Game loop start");

        world.thaw();

        try {
            while (!dead.get()) {
                world.update();

                try {
                    sleep(1000 / 60);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        world.freeze();

        log("Game loop end");
    }

    public void die() {
        this.dead.set(true);
    }

    public void connect(Client client) {
        world.connect(client);
    }

    public void disconnect(Client client) {
        world.disconnect(client);
    }
}
