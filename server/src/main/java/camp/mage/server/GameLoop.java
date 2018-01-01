package camp.mage.server;

import camp.mage.server.game.World;

/**
 * Created by jacob on 1/1/18.
 */

public class GameLoop extends Thread {

    private boolean dead;
    private World world;

    public GameLoop(World world) {
        this.world = world;
    }

    @Override
    public void run() {
        while (!dead) try {
            this.world.update();

            try {
                sleep(1000 / 15);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void die() {
        this.dead = true;
    }
}
