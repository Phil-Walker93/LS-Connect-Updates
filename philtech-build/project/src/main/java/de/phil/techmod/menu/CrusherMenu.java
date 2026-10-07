package de.phil.techmod.menu;

import net.minecraft.world.Container;
import net.minecraft.world.SimpleContainer;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.inventory.AbstractContainerMenu;
import net.minecraft.world.inventory.ContainerData;
import net.minecraft.world.inventory.SimpleContainerData;
import net.minecraft.world.inventory.Slot;
import net.minecraft.world.item.ItemStack;

import de.phil.techmod.block.entity.CrusherBlockEntity;
import de.phil.techmod.recipe.CrusherRecipes;

public final class CrusherMenu extends AbstractContainerMenu {
    private static final int MACHINE_SLOT_COUNT = 2;
    private static final int PLAYER_INV_START = MACHINE_SLOT_COUNT;
    private static final int PLAYER_INV_END = PLAYER_INV_START + Inventory.INVENTORY_SIZE;

    private final Container container;
    private final ContainerData data;

    public CrusherMenu(int containerId, Inventory inventory) {
        this(containerId, inventory, new SimpleContainer(MACHINE_SLOT_COUNT), new SimpleContainerData(5));
    }

    public CrusherMenu(int containerId, Inventory inventory, Container container, ContainerData data) {
        super(ModMenuTypes.CRUSHER, containerId);
        checkContainerSize(container, MACHINE_SLOT_COUNT);
        checkContainerDataCount(data, 5);
        this.container = container;
        this.data = data;
        container.startOpen(inventory.player);

        addSlot(new Slot(container, CrusherBlockEntity.INPUT_SLOT, 56, 35) {
            @Override public boolean mayPlace(ItemStack stack) { return CrusherRecipes.canCrush(stack); }
        });
        addSlot(new Slot(container, CrusherBlockEntity.OUTPUT_SLOT, 116, 35) {
            @Override public boolean mayPlace(ItemStack stack) { return false; }
        });

        addStandardInventorySlots(inventory, 8, 84);
        addDataSlots(data);
    }

    public int getProgress() { return data.get(0); }
    public int getMaxProgress() { return data.get(1); }
    public int getEnergy() { return data.get(2); }
    public int getEnergyCapacity() { return data.get(3); }
    public boolean isWorking() { return data.get(4) != 0; }
    public float getProcessProgress() { return getMaxProgress() <= 0 ? 0F : getProgress() / (float) getMaxProgress(); }
    public float getEnergyProgress() { return getEnergyCapacity() <= 0 ? 0F : getEnergy() / (float) getEnergyCapacity(); }

    @Override
    public ItemStack quickMoveStack(Player player, int slotIndex) {
        Slot slot = slots.get(slotIndex);
        if (!slot.hasItem()) return ItemStack.EMPTY;
        ItemStack stack = slot.getItem();
        ItemStack copy = stack.copy();
        if (slotIndex < MACHINE_SLOT_COUNT) {
            if (!moveItemStackTo(stack, PLAYER_INV_START, PLAYER_INV_END, true)) return ItemStack.EMPTY;
        } else {
            if (!CrusherRecipes.canCrush(stack) || !moveItemStackTo(stack, 0, 1, false)) return ItemStack.EMPTY;
        }
        if (stack.isEmpty()) slot.setByPlayer(ItemStack.EMPTY); else slot.setChanged();
        return copy;
    }

    @Override public boolean stillValid(Player player) { return container.stillValid(player); }
    @Override public void removed(Player player) { super.removed(player); container.stopOpen(player); }
}
