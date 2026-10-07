package de.phil.techmod.energy;

import net.minecraft.core.BlockPos;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.entity.BlockEntityType;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.storage.ValueInput;
import net.minecraft.world.level.storage.ValueOutput;

public abstract class AbstractEnergyBlockEntity extends BlockEntity implements TechEnergy {
    private long energy;

    protected AbstractEnergyBlockEntity(BlockEntityType<?> type, BlockPos pos, BlockState state) {
        super(type, pos, state);
    }

    @Override
    public long getEnergy() {
        return energy;
    }

    protected void setEnergy(long value) {
        energy = Math.max(0L, Math.min(getEnergyCapacity(), value));
        super.setChanged();
    }

    /**
     * Adds energy created internally by this machine. This deliberately bypasses
     * {@link #canReceiveEnergy()}, which only describes external network input.
     */
    protected long addEnergyInternal(long amount) {
        if (amount <= 0L) {
            return 0L;
        }
        long accepted = Math.min(amount, getEnergyCapacity() - energy);
        if (accepted > 0L) {
            energy += accepted;
            super.setChanged();
        }
        return accepted;
    }

    @Override
    public long receiveEnergy(long amount, boolean simulate) {
        if (!canReceiveEnergy() || amount <= 0L) {
            return 0L;
        }

        long accepted = Math.min(amount, getEnergyCapacity() - energy);
        if (!simulate && accepted > 0L) {
            energy += accepted;
            super.setChanged();
        }
        return accepted;
    }

    @Override
    public long extractEnergy(long amount, boolean simulate) {
        if (!canExtractEnergy() || amount <= 0L) {
            return 0L;
        }

        long extracted = Math.min(amount, energy);
        if (!simulate && extracted > 0L) {
            energy -= extracted;
            super.setChanged();
        }
        return extracted;
    }

    protected boolean consumeEnergy(long amount) {
        if (amount <= 0L || energy < amount) {
            return false;
        }
        energy -= amount;
        super.setChanged();
        return true;
    }

    @Override
    protected void saveAdditional(ValueOutput output) {
        super.saveAdditional(output);
        output.putLong("tech_energy", energy);
    }

    @Override
    protected void loadAdditional(ValueInput input) {
        super.loadAdditional(input);
        energy = Math.max(0L, Math.min(getEnergyCapacity(), input.getLongOr("tech_energy", 0L)));
    }
}
