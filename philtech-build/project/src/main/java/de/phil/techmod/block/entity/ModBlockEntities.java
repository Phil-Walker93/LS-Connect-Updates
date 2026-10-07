package de.phil.techmod.block.entity;

import net.fabricmc.fabric.api.object.builder.v1.block.entity.FabricBlockEntityTypeBuilder;

import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.entity.BlockEntity;
import net.minecraft.world.level.block.entity.BlockEntityType;

import de.phil.techmod.TechMod;
import de.phil.techmod.block.ModBlocks;

public final class ModBlockEntities {
    public static final BlockEntityType<RepairTableBlockEntity> REPAIR_TABLE = register(
            "repair_table",
            RepairTableBlockEntity::new,
            ModBlocks.REPAIR_TABLE
    );

    public static final BlockEntityType<GeneratorBlockEntity> GENERATOR = register(
            "generator",
            GeneratorBlockEntity::new,
            ModBlocks.GENERATOR
    );

    public static final BlockEntityType<CrusherBlockEntity> CRUSHER = register(
            "crusher",
            CrusherBlockEntity::new,
            ModBlocks.CRUSHER
    );

    public static final BlockEntityType<EnergyCellBlockEntity> ENERGY_CELL = register(
            "energy_cell",
            EnergyCellBlockEntity::new,
            ModBlocks.ENERGY_CELL
    );

    private ModBlockEntities() {
    }

    private static <T extends BlockEntity> BlockEntityType<T> register(
            String name,
            FabricBlockEntityTypeBuilder.Factory<? extends T> factory,
            Block... blocks
    ) {
        return Registry.register(
                BuiltInRegistries.BLOCK_ENTITY_TYPE,
                TechMod.id(name),
                FabricBlockEntityTypeBuilder.<T>create(factory, blocks).build()
        );
    }

    public static void initialize() {
    }
}
