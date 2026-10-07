package de.phil.techmod.client.screen;

import net.minecraft.client.gui.GuiGraphicsExtractor;
import net.minecraft.client.gui.screens.inventory.AbstractContainerScreen;
import net.minecraft.client.renderer.RenderPipelines;
import net.minecraft.network.chat.Component;
import net.minecraft.resources.Identifier;
import net.minecraft.world.entity.player.Inventory;

import de.phil.techmod.menu.RepairTableMenu;

public final class RepairTableScreen extends AbstractContainerScreen<RepairTableMenu> {
    private static final Identifier BACKGROUND = Identifier.withDefaultNamespace("textures/gui/container/dispenser.png");

    public RepairTableScreen(RepairTableMenu menu, Inventory inventory, Component title) {
        super(menu, inventory, title);
        this.titleLabelX = (this.imageWidth - this.font.width(this.title)) / 2;
    }

    @Override
    public void extractBackground(GuiGraphicsExtractor graphics, int mouseX, int mouseY, float delta) {
        super.extractBackground(graphics, mouseX, mouseY, delta);
        graphics.blit(RenderPipelines.GUI_TEXTURED, BACKGROUND, leftPos, topPos, 0.0F, 0.0F,
                imageWidth, imageHeight, BACKGROUND_TEXTURE_WIDTH, BACKGROUND_TEXTURE_HEIGHT);

        // Two compact machine bars to the right of the repair slot.
        drawBar(graphics, leftPos + 108, topPos + 32, 55, 6, menu.getRepairProgress(), 0xFF39C6D8);
        drawBar(graphics, leftPos + 108, topPos + 44, 55, 6, menu.getEnergyProgress(), 0xFF4FA7FF);
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

        if (!menu.getSlot(0).hasItem()) {
            graphics.text(font, Component.translatable("gui.philtech.repair_table.empty"), 8, 60, 0xFF606060, false);
            return;
        }

        int currentDamage = menu.getCurrentDamage();
        if (currentDamage <= 0) {
            graphics.text(font, Component.translatable("gui.philtech.repair_table.complete"), 8, 60, 0xFF2E8B57, false);
            return;
        }

        int seconds = (int) Math.ceil(menu.getRemainingTicks() / 20.0D);
        graphics.text(font, Component.translatable("gui.philtech.repair_table.damage", currentDamage), 8, 58, 0xFF404040, false);
        graphics.text(font,
                menu.isRepairing()
                        ? Component.translatable("gui.philtech.repair_table.time", seconds)
                        : Component.translatable("gui.philtech.repair_table.no_power"),
                8, 70, menu.isRepairing() ? 0xFF404040 : 0xFFB13A3A, false);
    }
}
