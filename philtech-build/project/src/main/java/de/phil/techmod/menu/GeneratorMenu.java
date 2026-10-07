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

import de.phil.techmod.util.FuelHelper;

public final class GeneratorMenu extends AbstractContainerMenu {
    private static final int FUEL_SLOT = 0;
    private static final int MACHINE_SLOT_COUNT = 1;
    private static final int PLAYER_INV_START = MACHINE_SLOT_COUNT;
    private static final int PLAYER_INV_END = PLAYER_INV_START + Inventory.INVENTORY_SIZE;

    private final Container container;
    private final ContainerData data;

    public GeneratorMenu(int containerId, Inventory inventory) {
        this(containerId, inventory, new SimpleContainer(MACHINE_SLOT_COUNT), new SimpleContainerData(5));
    }

    public GeneratorMenu(int containerId, Inventory inventory, Container container, ContainerData data) {
        super(ModMenuTypes.GENERATOR, containerId);
        checkContainerSize(container, MACHINE_SLOT_COUNT);
        checkContainerDataCount(data, 5);

        this.container = container;
        this.data = data;
        container.startOpen(inventory.player);

        addSlot(new Slot(container, FUEL_SLOT, 80, 35) {
            @Override
            public boolean mayPlace(ItemStack stack) {
                return FuelHelper.isFuel(stack);
            }
        });

        addStandardInventorySlots(inventory, 8, 84);
        addDataSlots(data);
    }

    public int getEnergy() {
        return data.get(0);
    }

    public int getEnergyCapacity() {
        return data.get(1);
    }

    public int getBurnTime() {
        return data.get(2);
    }

    public int getTotalBurnTime() {
        return data.get(3);
    }

    public int getGenerationPerTick() {
        return data.get(4);
    }

    public float getEnergyProgress() {
        return getEnergyCapacity() <= 0 ? 0.0F : getEnergy() / (float) getEnergyCapacity();
    }

    public float getBurnProgress() {
        return getTotalBurnTime() <= 0 ? 0.0F : getBurnTime() / (float) getTotalBurnTime();
    }

    @Override
    public ItemStack quickMoveStack(Player player, int slotIndex) {
        Slot slot = slots.get(slotIndex);
        if (!slot.hasItem()) {
            return ItemStack.EMPTY;
        }

        ItemStack stack = slot.getItem();
        ItemStack copy = stack.copy();

        if (slotIndex < MACHINE_SLOT_COUNT) {
            if (!moveItemStackTo(stack, PLAYER_INV_START, PLAYER_INV_END, true)) {
                return ItemStack.EMPTY;
            }
        } else {
            if (!FuelHelper.isFuel(stack) || !moveItemStackTo(stack, 0, MACHINE_SLOT_COUNT, false)) {
                return ItemStack.EMPTY;
            }
        }

        if (stack.isEmpty()) {
            slot.setByPlayer(ItemStack.EMPTY);
        } else {
            slot.setChanged();
        }
        return copy;
    }

    @Override
    public boolean stillValid(Player player) {
        return container.stillValid(player);
    }

    @Override
    public void removed(Player player) {
        super.removed(player);
        container.stopOpen(player);
    }
}
