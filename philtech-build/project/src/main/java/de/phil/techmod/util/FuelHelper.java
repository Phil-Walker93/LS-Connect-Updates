package de.phil.techmod.util;

import java.util.Optional;

import net.minecraft.core.BlockPos;
import net.minecraft.core.component.DataComponents;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.component.CookingFuel;
import net.minecraft.world.level.storage.loot.LootContext;
import net.minecraft.world.level.storage.loot.LootParams;
import net.minecraft.world.level.storage.loot.parameters.LootContextParamSets;
import net.minecraft.world.level.storage.loot.parameters.LootContextParams;
import net.minecraft.world.phys.Vec3;

public final class FuelHelper {
    private FuelHelper() {
    }

    public static boolean isFuel(ItemStack stack) {
        return !stack.isEmpty() && stack.has(DataComponents.COOKING_FUEL);
    }

    public static int getBurnTime(ServerLevel level, BlockPos pos, ItemStack stack) {
        CookingFuel fuel = stack.get(DataComponents.COOKING_FUEL);
        if (fuel == null) {
            return 0;
        }

        LootContext context = new LootContext.Builder(
                new LootParams.Builder(level)
                        .withParameter(LootContextParams.BLOCK_STATE, level.getBlockState(pos))
                        .withParameter(LootContextParams.ORIGIN, Vec3.atCenterOf(pos))
                        .create(LootContextParamSets.BLOCK_INTERACT)
        ).create(Optional.empty());

        return Math.max(0, fuel.burnTime().get(context, 0));
    }
}
