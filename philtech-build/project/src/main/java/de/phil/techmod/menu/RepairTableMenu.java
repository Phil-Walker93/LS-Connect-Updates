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

public final class RepairTableMenu extends AbstractContainerMenu {
    private static final int MACHINE_SLOT = 0;
    private static final int MACHINE_SLOT_COUNT = 1;
    private static final int PLAYER_INV_START = MACHINE_SLOT_COUNT;
    private static final int PLAYER_INV_END = PLAYER_INV_START + Inventory.INVENTORY_SIZE;

    private final Container container;
    private final ContainerData data;

    public RepairTableMenu(int containerId, Inventory inventory) {
        this(containerId, inventory, new SimpleContainer(MACHINE_SLOT_COUNT), new SimpleContainerData(6));
    }

    public RepairTableMenu(int containerId, Inventory inventory, Container container, ContainerData data) {
        super(ModMenuTypes.REPAIR_TABLE, containerId);
        checkContainerSize(container, MACHINE_SLOT_COUNT);
        checkContainerDataCount(data, 6);

        this.container = container;
        this.data = data;

        container.startOpen(inventory.player);

        addSlot(new Slot(container, MACHINE_SLOT, 80, 35) {
            @Override
            public boolean mayPlace(ItemStack stack) {
                return stack.isDamageableItem() && stack.getDamageValue() > 0;
            }

            @Override
            public int getMaxStackSize() {
                return 1;
            }
        });

        addStandardInventorySlots(inventory, 8, 84);
        addDataSlots(data);
    }

    public int getCurrentDamage() {
        return data.get(0);
    }

    public int getInitialDamage() {
        return data.get(1);
    }

    public boolean isRepairing() {
        return data.get(2) == 1;
    }

    public int getRemainingTicks() {
        return data.get(3);
    }

    public int getEnergy() {
        return data.get(4);
    }

    public int getEnergyCapacity() {
        return data.get(5);
    }

    public float getRepairProgress() {
        int initial = getInitialDamage();
        if (initial <= 0) {
            return 0.0F;
        }
        return Math.max(0.0F, Math.min(1.0F, (initial - getCurrentDamage()) / (float) initial));
    }

    public float getEnergyProgress() {
        int capacity = getEnergyCapacity();
        if (capacity <= 0) {
            return 0.0F;
        }
        return Math.max(0.0F, Math.min(1.0F, getEnergy() / (float) capacity));
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
            if (!stack.isDamageableItem() || stack.getDamageValue() <= 0) {
                return ItemStack.EMPTY;
            }
            if (!moveItemStackTo(stack, 0, MACHINE_SLOT_COUNT, false)) {
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
