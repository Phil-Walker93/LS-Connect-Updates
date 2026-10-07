package de.phil.techmod.block.entity;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

import net.minecraft.core.BlockPos;
import net.minecraft.core.HolderLookup;
import net.minecraft.core.NonNullList;
import net.minecraft.nbt.CompoundTag;
import net.minecraft.network.chat.Component;
import net.minecraft.network.protocol.Packet;
import net.minecraft.network.protocol.game.ClientGamePacketListener;
import net.minecraft.network.protocol.game.ClientboundBlockEntityDataPacket;
import net.minecraft.world.Container;
import net.minecraft.world.ContainerHelper;
import net.minecraft.world.MenuProvider;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.inventory.AbstractContainerMenu;
import net.minecraft.world.inventory.ContainerData;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.storage.ValueInput;
import net.minecraft.world.level.storage.ValueOutput;

import de.phil.techmod.container.ImplementedContainer;
import de.phil.techmod.block.custom.RepairTableBlock;
import de.phil.techmod.energy.AbstractEnergyBlockEntity;
import de.phil.techmod.energy.EnergyRole;
import de.phil.techmod.menu.RepairTableMenu;

public final class RepairTableBlockEntity extends AbstractEnergyBlockEntity implements ImplementedContainer, MenuProvider {
    public static final int SLOT_COUNT = 1;
    public static final int TICKS_PER_DURABILITY = 2;
    public static final long ENERGY_PER_DURABILITY = 5L;
    public static final long CAPACITY = 10_000L;

    private final NonNullList<ItemStack> items = NonNullList.withSize(SLOT_COUNT, ItemStack.EMPTY);
    private int repairTick;
    private int initialDamage;

    private final ContainerData data = new ContainerData() {
        @Override
        public int get(int index) {
            ItemStack stack = getItem(0);
            return switch (index) {
                case 0 -> stack.isEmpty() ? 0 : stack.getDamageValue();
                case 1 -> initialDamage;
                case 2 -> isRepairing() ? 1 : 0;
                case 3 -> stack.isEmpty() ? 0 : Math.max(0, stack.getDamageValue() * TICKS_PER_DURABILITY - repairTick);
                case 4 -> (int) getEnergy();
                case 5 -> (int) getEnergyCapacity();
                default -> 0;
            };
        }

        @Override
        public void set(int index, int value) {
            if (index == 1) {
                initialDamage = value;
            } else if (index == 3) {
                repairTick = value;
            }
        }

        @Override
        public int getCount() {
            return 6;
        }
    };

    public RepairTableBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.REPAIR_TABLE, pos, state);
    }

    public static void tick(Level level, BlockPos pos, BlockState state, RepairTableBlockEntity blockEntity) {
        if (level.isClientSide()) {
            return;
        }

        ItemStack stack = blockEntity.getItem(0);
        if (stack.isEmpty() || !stack.isDamageableItem() || stack.getDamageValue() <= 0) {
            blockEntity.repairTick = 0;
            blockEntity.updateActiveState(state, false);
            return;
        }

        if (blockEntity.initialDamage <= 0) {
            blockEntity.initialDamage = stack.getDamageValue();
        }

        if (blockEntity.getEnergy() < ENERGY_PER_DURABILITY) {
            blockEntity.updateActiveState(state, false);
            return;
        }

        blockEntity.updateActiveState(state, true);

        blockEntity.repairTick++;
        if (blockEntity.repairTick < TICKS_PER_DURABILITY) {
            return;
        }

        blockEntity.repairTick = 0;
        if (!blockEntity.consumeEnergy(ENERGY_PER_DURABILITY)) {
            return;
        }

        stack.setDamageValue(Math.max(0, stack.getDamageValue() - 1));
        blockEntity.setChanged();
    }

    private void updateActiveState(BlockState state, boolean active) {
        if (state.hasProperty(RepairTableBlock.ACTIVE)
                && state.getValue(RepairTableBlock.ACTIVE) != active
                && level != null) {
            level.setBlock(worldPosition, state.setValue(RepairTableBlock.ACTIVE, active), Block.UPDATE_CLIENTS);
        }
    }

    public boolean isRepairing() {
        ItemStack stack = getItem(0);
        return !stack.isEmpty()
                && stack.isDamageableItem()
                && stack.getDamageValue() > 0
                && getEnergy() >= ENERGY_PER_DURABILITY;
    }

    public boolean isWaitingForEnergy() {
        ItemStack stack = getItem(0);
        return !stack.isEmpty()
                && stack.isDamageableItem()
                && stack.getDamageValue() > 0
                && getEnergy() < ENERGY_PER_DURABILITY;
    }

    public ItemStack getRenderedStack() {
        return getItem(0);
    }

    public ContainerData getData() {
        return data;
    }

    @Override
    public long getEnergyCapacity() {
        return CAPACITY;
    }

    @Override
    public boolean canReceiveEnergy() {
        return true;
    }

    @Override
    public boolean canExtractEnergy() {
        return false;
    }

    @Override
    public EnergyRole getEnergyRole() {
        return EnergyRole.CONSUMER;
    }

    @Override
    public NonNullList<ItemStack> getItems() {
        return items;
    }

    @Override
    public void setItem(int slot, ItemStack stack) {
        if (slot != 0) {
            return;
        }

        if (!stack.isEmpty()) {
            stack.limitSize(1);
        }

        items.set(0, stack);
        initialDamage = stack.isEmpty() ? 0 : stack.getDamageValue();
        repairTick = 0;
        setChanged();
    }

    @Override
    public ItemStack removeItem(int slot, int count) {
        ItemStack removed = ContainerHelper.removeItem(items, slot, count);
        if (!removed.isEmpty()) {
            if (items.get(0).isEmpty()) {
                initialDamage = 0;
                repairTick = 0;
            }
            setChanged();
        }
        return removed;
    }

    @Override
    public ItemStack removeItemNoUpdate(int slot) {
        ItemStack removed = ContainerHelper.takeItem(items, slot);
        if (!removed.isEmpty()) {
            initialDamage = 0;
            repairTick = 0;
        }
        return removed;
    }

    @Override
    public void clearContent() {
        items.clear();
        initialDamage = 0;
        repairTick = 0;
        setChanged();
    }

    @Override
    public boolean stillValid(Player player) {
        return Container.stillValidBlockEntity(this, player);
    }

    @Override
    protected void saveAdditional(ValueOutput output) {
        super.saveAdditional(output);
        ContainerHelper.saveAllItems(output, items);
        output.putInt("repair_tick", repairTick);
        output.putInt("initial_damage", initialDamage);
    }

    @Override
    protected void loadAdditional(ValueInput input) {
        super.loadAdditional(input);
        ContainerHelper.loadAllItems(input, items);
        repairTick = input.getIntOr("repair_tick", 0);
        initialDamage = input.getIntOr("initial_damage", 0);
    }

    @Override
    public void setChanged() {
        super.setChanged();
        if (level == null) {
            return;
        }

        BlockState state = getBlockState();
        level.sendBlockUpdated(worldPosition, state, state, Block.UPDATE_ALL);
    }

    @Override
    public CompoundTag getUpdateTag(HolderLookup.Provider registryLookup) {
        return saveWithoutMetadata(registryLookup);
    }

    @Override
    public Packet<ClientGamePacketListener> getUpdatePacket() {
        return ClientboundBlockEntityDataPacket.create(this);
    }

    @Override
    @NonNull
    public Component getDisplayName() {
        return Component.translatable("container.philtech.repair_table");
    }

    @Override
    public @Nullable AbstractContainerMenu createMenu(int containerId, Inventory inventory, Player player) {
        return new RepairTableMenu(containerId, inventory, this, data);
    }
}
