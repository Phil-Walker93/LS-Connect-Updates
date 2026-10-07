package de.phil.techmod.client;

import net.fabricmc.api.ClientModInitializer;

import net.minecraft.client.gui.screens.MenuScreens;
import net.minecraft.client.renderer.blockentity.BlockEntityRenderers;

import de.phil.techmod.block.entity.ModBlockEntities;
import de.phil.techmod.client.render.RepairTableRenderer;
import de.phil.techmod.client.screen.CrusherScreen;
import de.phil.techmod.client.screen.GeneratorScreen;
import de.phil.techmod.client.screen.RepairTableScreen;
import de.phil.techmod.menu.ModMenuTypes;

public final class TechModClient implements ClientModInitializer {
    @Override
    public void onInitializeClient() {
        MenuScreens.register(ModMenuTypes.REPAIR_TABLE, RepairTableScreen::new);
        MenuScreens.register(ModMenuTypes.GENERATOR, GeneratorScreen::new);
        MenuScreens.register(ModMenuTypes.CRUSHER, CrusherScreen::new);
        BlockEntityRenderers.register(ModBlockEntities.REPAIR_TABLE, RepairTableRenderer::new);
    }
}
