package de.phil.techmod.block.entity;

import net.minecraft.core.BlockPos;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.state.BlockState;

import de.phil.techmod.energy.AbstractEnergyBlockEntity;
import de.phil.techmod.energy.EnergyNetwork;
import de.phil.techmod.energy.EnergyRole;

public final class EnergyCellBlockEntity extends AbstractEnergyBlockEntity {
    public static final long CAPACITY = 100_000L;
    public static final long MAX_OUTPUT_PER_TICK = 200L;

    public EnergyCellBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.ENERGY_CELL, pos, state);
    }

    public static void tick(Level level, BlockPos pos, BlockState state, EnergyCellBlockEntity cell) {
        if (level.isClientSide() || cell.getEnergy() <= 0L) {
            return;
        }
        EnergyNetwork.distribute(level, pos, cell, MAX_OUTPUT_PER_TICK, false);
    }

    @Override
    public long getEnergyCapacity() {
        return CAPACITY;
    }

    @Override
    public boolean canReceiveEnergy() {
        return true;
    }

    @Override
    public boolean canExtractEnergy() {
        return true;
    }

    @Override
    public EnergyRole getEnergyRole() {
        return EnergyRole.STORAGE;
    }
}
