package de.phil.techmod.client.screen;

import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.client.renderer.RenderPipelines;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.Identifier;
import net.minecraft.world.entity.player.Inventory;

import de.phil.techmod.menu.CrusherMenu;

public final class CrusherScreen extends AbstractContainerScreen<CrusherMenu> {
    private static final Identifier BACKGROUND = Identifier.withDefaultNamespace("textures/gui/container/dispenser.png");

    public CrusherScreen(CrusherMenu menu, Inventory inventory, Component title) {
        super(menu, inventory, title);
        titleLabelX = (imageWidth - font.width(title)) / 2;
    }

    @Override
    public void extractBackground(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta) {
        super.extractBackground(graphics, mouseX, mouseY, delta);
        graphics.blit(RenderPipelines.GUI_TEXTURED, BACKGROUND, leftPos, topPos, 0, 0, imageWidth, imageHeight, BACKGROUND_TEXTURE_WIDTH, BACKGROUND_TEXTURE_HEIGHT);
        drawBar(graphics, leftPos + 79, topPos + 38, 28, 6, menu.getProcessProgress(), 0xFFFFA53A);
        drawBar(graphics, leftPos + 108, topPos + 55, 55, 6, menu.getEnergyProgress(), 0xFF4FA7FF);
    }

    @Override
    protected void extractLabels(GuiGraphicsExtractor graphics, int mouseX, int mouseY) {
        super.extractLabels(graphics, mouseX, mouseY);
        graphics.text(font, Component.translatable("gui.philtech.energy", menu.getEnergy(), menu.getEnergyCapacity()), 8, 18, 0xFF404040, false);
        graphics.text(font, Component.translatable(menu.isWorking() ? "gui.philtech.crusher.working" : "gui.philtech.crusher.idle"), 8, 62, 0xFF404040, false);
    }

    private static void drawBar(GuiGraphicsExtractor graphics, int x, int y, int width, int height, float progress, int fill) {
        int pixels = Math.round(Math.max(0F, Math.min(1F, progress)) * width);
        graphics.fill(x - 1, y - 1, x + width + 1, y + height + 1, 0xFF303030);
        graphics.fill(x, y, x + width, y + height, 0xFF606060);
        if (pixels > 0) graphics.fill(x, y, x + pixels, y + height, fill);
    }
}
