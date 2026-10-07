package de.phil.techmod.block;

import net.minecraft.references.BlockItemId;
import net.minecraft.resources.Identifier;

import de.phil.techmod.TechMod;

public final class ModBlockItemIds {
    public static final BlockItemId REPAIR_TABLE = create("repair_table");
    public static final BlockItemId GENERATOR = create("generator");
    public static final BlockItemId ENERGY_CELL = create("energy_cell");
    public static final BlockItemId COPPER_CABLE = create("copper_cable");
    public static final BlockItemId CRUSHER = create("crusher");

    private ModBlockItemIds() {
    }

    private static BlockItemId create(String name) {
        Identifier id = TechMod.id(name);
        return BlockItemId.create(id, id);
    }
}
