package de.phil.techmod.block;

import java.util.function.Function;

import net.fabricmc.fabric.api.creativetab.v1.CreativeModeTabEvents;

import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.references.BlockItemId;
import net.minecraft.resources.ResourceKey;
import net.minecraft.world.item.BlockItem;
import net.minecraft.world.item.CreativeModeTabs;
import net.minecraft.world.item.Item;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.SoundType;
import net.minecraft.world.level.block.state.BlockBehaviour;

import de.phil.techmod.block.custom.CopperCableBlock;
import de.phil.techmod.block.custom.CrusherBlock;
import de.phil.techmod.block.custom.EnergyCellBlock;
import de.phil.techmod.block.custom.GeneratorBlock;
import de.phil.techmod.block.custom.RepairTableBlock;

public final class ModBlocks {
    public static final Block REPAIR_TABLE = register(
            ModBlockItemIds.REPAIR_TABLE,
            RepairTableBlock::new,
            machineProperties()
    );

    public static final Block GENERATOR = register(
            ModBlockItemIds.GENERATOR,
            GeneratorBlock::new,
            machineProperties()
    );

    public static final Block CRUSHER = register(
            ModBlockItemIds.CRUSHER,
            CrusherBlock::new,
            machineProperties()
    );

    public static final Block ENERGY_CELL = register(
            ModBlockItemIds.ENERGY_CELL,
            EnergyCellBlock::new,
            machineProperties()
    );

    public static final Block COPPER_CABLE = register(
            ModBlockItemIds.COPPER_CABLE,
            CopperCableBlock::new,
            BlockBehaviour.Properties.of()
                    .strength(1.5F)
                    .sound(SoundType.COPPER)
                    .requiresCorrectToolForDrops()
    );

    private ModBlocks() {
    }

    private static BlockBehaviour.Properties machineProperties() {
        return BlockBehaviour.Properties.of()
                .strength(3.5F)
                .sound(SoundType.METAL)
                .requiresCorrectToolForDrops();
    }

    private static Block register(ResourceKey<Block> id,
                                  Function<BlockBehaviour.Properties, Block> blockFactory,
                                  BlockBehaviour.Properties properties) {
        Block block = blockFactory.apply(properties.setId(id));
        return Registry.register(BuiltInRegistries.BLOCK, id, block);
    }

    private static Block register(BlockItemId id,
                                  Function<BlockBehaviour.Properties, Block> blockFactory,
                                  BlockBehaviour.Properties properties) {
        Block block = register(id.block(), blockFactory, properties);
        BlockItem blockItem = new BlockItem(
                block,
                new Item.Properties().useBlockDescriptionPrefix().setId(id.item())
        );
        Registry.register(BuiltInRegistries.ITEM, id.item(), blockItem);
        return block;
    }

    public static void initialize() {
        CreativeModeTabEvents.modifyOutputEvent(CreativeModeTabs.FUNCTIONAL_BLOCKS).register(entries -> {
            entries.accept(GENERATOR.asItem());
            entries.accept(ENERGY_CELL.asItem());
            entries.accept(REPAIR_TABLE.asItem());
            entries.accept(CRUSHER.asItem());
        });

        CreativeModeTabEvents.modifyOutputEvent(CreativeModeTabs.REDSTONE_BLOCKS).register(entries -> {
            entries.accept(COPPER_CABLE.asItem());
        });
    }
}
