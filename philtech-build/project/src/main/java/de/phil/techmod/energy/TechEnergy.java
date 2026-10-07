package de.phil.techmod.energy;

public interface TechEnergy {
    long getEnergy();

    long getEnergyCapacity();

    long receiveEnergy(long amount, boolean simulate);

    long extractEnergy(long amount, boolean simulate);

    boolean canReceiveEnergy();

    boolean canExtractEnergy();

    EnergyRole getEnergyRole();
}
