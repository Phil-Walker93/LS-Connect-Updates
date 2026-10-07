package de.phil.techmod.item;

import net.minecraft.core.registries.Registries;
import net.minecraft.resources.ResourceKey;
import net.minecraft.world.item.Item;

import de.phil.techmod.TechMod;

public final class ModItemIds {
    public static final ResourceKey<Item> IRON_DUST = create("iron_dust");
    public static final ResourceKey<Item> COPPER_DUST = create("copper_dust");
    public static final ResourceKey<Item> GOLD_DUST = create("gold_dust");

    private ModItemIds() {}

    private static ResourceKey<Item> create(String name) {
        return ResourceKey.create(Registries.ITEM, TechMod.id(name));
    }
}
