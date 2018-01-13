package camp.mage.server.game.objs;

import java.util.Date;

import camp.mage.server.game.World;

/**
 * Created by jacob on 1/11/18.
 */

public class CharacterObject extends BaseObject {

    private float health = 1f;
    private float magic = 1f;
    private float hunger = 1f;

    private long lastHungerDecrease;

    public CharacterObject(World world) {
        super(world);
    }

    @Override
    public void update() {
        super.update();

        // Get more hungry every 15 seconds
        long now = new Date().getTime();
        if (now > lastHungerDecrease + 15000) {
            if (hunger > 0) {
                addHunger(-0.05f);
            } else {
                addHealth(-0.05f);
            }
            lastHungerDecrease = now;
        }
    }

    public void addHealth(float health) {
        setHealth(this.health + health);
    }

    public void addMagic(float magic) {
        setMagic(this.magic + magic);
    }

    public void addHunger(float hunger) {
        setHunger(this.hunger + hunger);
    }

    public float getHealth() {
        return health;
    }

    public CharacterObject setHealth(float health) {
        health = Math.max(0, Math.min(1, health));

        if (this.health == health) {
            return this;
        }

        this.health = health;
        world.statsChanged(this);
        return this;
    }

    public float getMagic() {
        return magic;
    }

    public CharacterObject setMagic(float magic) {
        magic = Math.max(0, Math.min(1, magic));

        if (this.magic == magic) {
            return this;
        }

        this.magic = magic;
        world.statsChanged(this);
        return this;
    }

    public float getHunger() {
        return hunger;
    }

    public CharacterObject setHunger(float hunger) {
        hunger = Math.max(0, Math.min(1, hunger));

        if (this.hunger == hunger) {
            return this;
        }

        this.hunger = hunger;
        world.statsChanged(this);
        return this;
    }
}
