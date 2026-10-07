package de.phil.techmod;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import net.fabricmc.api.ModInitializer;

import net.minecraft.resources.Identifier;

import de.phil.techmod.block.ModBlocks;
import de.phil.techmod.block.entity.ModBlockEntities;
import de.phil.techmod.menu.ModMenuTypes;
import de.phil.techmod.item.ModItems;

public final class TechMod implements ModInitializer {
    public static final String MOD_ID = "philtech";
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        ModItems.initialize();
        ModBlocks.initialize();
        ModBlockEntities.initialize();
        ModMenuTypes.initialize();

        LOGGER.info("PhilTech {} initialized.", "0.1.0-alpha.3");
    }

    public static Identifier id(String path) {
        return Identifier.fromNamespaceAndPath(MOD_ID, path);
    }
}
