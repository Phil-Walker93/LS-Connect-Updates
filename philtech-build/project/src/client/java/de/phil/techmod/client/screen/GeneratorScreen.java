package de.phil.techmod.client.screen;

import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.client.renderer.RenderPipelines;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.Identifier;
import net.minecraft.world.entity.player.Inventory;

import de.phil.techmod.menu.GeneratorMenu;

public final class GeneratorScreen extends AbstractContainerScreen<GeneratorMenu> {
    private static final Identifier BACKGROUND = Identifier.withDefaultNamespace("textures/gui/container/dispenser.png");

    public GeneratorScreen(GeneratorMenu menu, Inventory inventory, Component title) {
        super(menu, inventory, title);
        this.titleLabelX = (this.imageWidth - this.font.width(this.title)) / 2;
    }

    @Override
    public void extractBackground(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta) {
        super.extractBackground(graphics, mouseX, mouseY, delta);
        graphics.blit(RenderPipelines.GUI_TEXTURED, BACKGROUND, leftPos, topPos, 0.0F, 0.0F,
                imageWidth, imageHeight, BACKGROUND_TEXTURE_WIDTH, BACKGROUND_TEXTURE_HEIGHT);

        drawBar(graphics, leftPos + 108, topPos + 32, 55, 6, menu.getEnergyProgress(), 0xFF4FA7FF);
        drawBar(graphics, leftPos + 108, topPos + 44, 55, 6, menu.getBurnProgress(), 0xFFFF9A36);
    }

    private static void drawBar(GuiGraphicsExtractor graphics, int x, int y, int width, int height, float progress, int fill) {
        int pixels = Math.round(Math.max(0.0F, Math.min(1.0F, progress)) * width);
        graphics.fill(x - 1, y - 1, x + width + 1, y + height + 1, 0xFF303030);
        graphics.fill(x, y, x + width, y + height, 0xFF606060);
        if (pixels > 0) {
            graphics.fill(x, y, x + pixels, y + height, fill);
        }
    }

    @Override
    protected void extractLabels(GuiGraphicsExtractor graphics, int mouseX, int mouseY) {
        super.extractLabels(graphics, mouseX, mouseY);
        graphics.text(font,
                Component.translatable("gui.philtech.energy", menu.getEnergy(), menu.getEnergyCapacity()),
                8, 18, 0xFF404040, false);
        graphics.text(font,
                Component.translatable("gui.philtech.generator.output", menu.getGenerationPerTick()),
                8, 62, 0xFF404040, false);
    }
}
