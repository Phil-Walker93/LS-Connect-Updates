package de.phil.techmod.energy;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.entity.BlockEntity;

import de.phil.techmod.block.ModBlocks;

public final class EnergyNetwork {
    public static final int MAX_CABLES_PER_TRANSFER = 512;

    private EnergyNetwork() {
    }

    public static long distribute(Level level, BlockPos sourcePos, TechEnergy source, long requested, boolean allowStorageTargets) {
        if (level.isClientSide() || requested <= 0L || !source.canExtractEnergy()) {
            return 0L;
        }

        long available = Math.min(requested, source.extractEnergy(requested, true));
        if (available <= 0L) {
            return 0L;
        }

        List<TechEnergy> consumers = new ArrayList<>();
        List<TechEnergy> storages = new ArrayList<>();
        Set<BlockPos> visitedCables = new HashSet<>();
        Set<BlockPos> visitedTargets = new HashSet<>();
        ArrayDeque<BlockPos> queue = new ArrayDeque<>();

        scanNeighbors(level, sourcePos, sourcePos, queue, visitedCables, visitedTargets, consumers, storages, allowStorageTargets);

        while (!queue.isEmpty() && visitedCables.size() <= MAX_CABLES_PER_TRANSFER) {
            BlockPos cable = queue.removeFirst();
            scanNeighbors(level, cable, sourcePos, queue, visitedCables, visitedTargets, consumers, storages, allowStorageTargets);
        }

        long transferred = transferToTargets(source, consumers, available);
        if (allowStorageTargets && transferred < available) {
            transferred += transferToTargets(source, storages, available - transferred);
        }
        return transferred;
    }

    private static void scanNeighbors(
            Level level,
            BlockPos origin,
            BlockPos sourcePos,
            ArrayDeque<BlockPos> queue,
            Set<BlockPos> visitedCables,
            Set<BlockPos> visitedTargets,
            List<TechEnergy> consumers,
            List<TechEnergy> storages,
            boolean allowStorageTargets
    ) {
        for (Direction direction : Direction.values()) {
            BlockPos next = origin.relative(direction);
            if (next.equals(sourcePos)) {
                continue;
            }

            if (level.getBlockState(next).is(ModBlocks.COPPER_CABLE)) {
                if (visitedCables.size() < MAX_CABLES_PER_TRANSFER && visitedCables.add(next.immutable())) {
                    queue.addLast(next.immutable());
                }
                continue;
            }

            if (!visitedTargets.add(next.immutable())) {
                continue;
            }

            BlockEntity blockEntity = level.getBlockEntity(next);
            if (!(blockEntity instanceof TechEnergy target) || !target.canReceiveEnergy()) {
                continue;
            }

            if (target.getEnergyRole() == EnergyRole.CONSUMER) {
                consumers.add(target);
            } else if (allowStorageTargets && target.getEnergyRole() == EnergyRole.STORAGE) {
                storages.add(target);
            }
        }
    }

    private static long transferToTargets(TechEnergy source, List<TechEnergy> targets, long budget) {
        long transferred = 0L;
        for (TechEnergy target : targets) {
            long remaining = budget - transferred;
            if (remaining <= 0L) {
                break;
            }

            long canAccept = target.receiveEnergy(remaining, true);
            if (canAccept <= 0L) {
                continue;
            }

            long extracted = source.extractEnergy(canAccept, false);
            if (extracted <= 0L) {
                break;
            }

            // The simulation immediately precedes the real transfer on the server tick,
            // so the target must be able to accept the same amount here.
            long accepted = target.receiveEnergy(extracted, false);
            transferred += accepted;
        }
        return transferred;
    }
}
