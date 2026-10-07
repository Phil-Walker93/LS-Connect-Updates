package de.phil.techmod.recipe;

import net.minecraft.world.item.ItemStack;
import net.minecraft.world.item.Items;

import de.phil.techmod.item.ModItems;

public final class CrusherRecipes {
    private CrusherRecipes() {
    }

    public static ItemStack getResult(ItemStack input) {
        if (input.isEmpty()) {
            return ItemStack.EMPTY;
        }

        if (input.is(Items.RAW_IRON)) return new ItemStack(ModItems.IRON_DUST, 2);
        if (input.is(Items.IRON_INGOT)) return new ItemStack(ModItems.IRON_DUST, 1);
        if (input.is(Items.RAW_GOLD)) return new ItemStack(ModItems.GOLD_DUST, 2);
        if (input.is(Items.GOLD_INGOT)) return new ItemStack(ModItems.GOLD_DUST, 1);
        if (input.is(Items.RAW_COPPER)) return new ItemStack(ModItems.COPPER_DUST, 2);
        if (input.is(Items.COPPER_INGOT)) return new ItemStack(ModItems.COPPER_DUST, 1);
        if (input.is(Items.COBBLESTONE)) return new ItemStack(Items.GRAVEL, 1);
        if (input.is(Items.GRAVEL)) return new ItemStack(Items.SAND, 1);
        if (input.is(Items.STONE)) return new ItemStack(Items.COBBLESTONE, 1);

        return ItemStack.EMPTY;
    }

    public static boolean canCrush(ItemStack input) {
        return !getResult(input).isEmpty();
    }
}
