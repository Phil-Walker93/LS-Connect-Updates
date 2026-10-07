package de.phil.techmod.item;

import java.util.function.Function;

import net.fabricmc.fabric.api.creativetab.v1.CreativeModeTabEvents;
import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.resources.ResourceKey;
import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.Item;

public final class ModItems {
    public static final Item IRON_DUST = register(ModItemIds.IRON_DUST, Item::new, new Item.Properties());
    public static final Item COPPER_DUST = register(ModItemIds.COPPER_DUST, Item::new, new Item.Properties());
    public static final Item GOLD_DUST = register(ModItemIds.GOLD_DUST, Item::new, new Item.Properties());

    private ModItems() {}

    private static Item register(ResourceKey<Item> key, Function<Item.Properties, Item> factory, Item.Properties properties) {
        Item item = factory.apply(properties.setId(key));
        return Registry.register(BuiltInRegistries.ITEM, key, item);
    }

    public static void initialize() {
        CreativeModeTabEvents.modifyOutputEvent(CreativeModeTabs.INGREDIENTS).register(entries -> {
            entries.accept(IRON_DUST);
            entries.accept(COPPER_DUST);
            entries.accept(GOLD_DUST);
        });
    }
}
