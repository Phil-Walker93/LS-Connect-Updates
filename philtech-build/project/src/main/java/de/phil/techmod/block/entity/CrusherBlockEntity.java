package de.phil.techmod.block.entity;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

import net.minecraft.core.BlockPos;
import net.minecraft.core.NonNullList;
import net.minecraft.network.chat.Component;
import net.minecraft.world.Container;
import net.minecraft.world.ContainerHelper;
import net.minecraft.world.MenuProvider;
import net.minecraft.world.entity.player.Inventory;
import net.minecraft.world.entity.player.Player;
import net.minecraft.world.inventory.AbstractContainerMenu;
import net.minecraft.world.inventory.ContainerData;
import net.minecraft.world.item.ItemStack;
import net.minecraft.world.level.Level;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.storage.ValueInput;
import net.minecraft.world.level.storage.ValueOutput;

import de.phil.techmod.block.custom.CrusherBlock;
import de.phil.techmod.container.ImplementedContainer;
import de.phil.techmod.energy.AbstractEnergyBlockEntity;
import de.phil.techmod.energy.EnergyRole;
import de.phil.techmod.recipe.CrusherRecipes;
import de.phil.techmod.menu.CrusherMenu;

public final class CrusherBlockEntity extends AbstractEnergyBlockEntity implements ImplementedContainer, MenuProvider {
    public static final int INPUT_SLOT = 0;
    public static final int OUTPUT_SLOT = 1;
    public static final int SLOT_COUNT = 2;
    public static final long CAPACITY = 20_000L;
    public static final long ENERGY_PER_TICK = 20L;
    public static final int PROCESS_TICKS = 100;

    private final NonNullList<ItemStack> items = NonNullList.withSize(SLOT_COUNT, ItemStack.EMPTY);
    private int progress;

    private final ContainerData data = new ContainerData() {
        @Override
        public int get(int index) {
            return switch (index) {
                case 0 -> progress;
                case 1 -> PROCESS_TICKS;
                case 2 -> (int) getEnergy();
                case 3 -> (int) getEnergyCapacity();
                case 4 -> isWorking() ? 1 : 0;
                default -> 0;
            };
        }

        @Override public void set(int index, int value) { if (index == 0) progress = value; }
        @Override public int getCount() { return 5; }
    };

    public CrusherBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.CRUSHER, pos, state);
    }

    public static void tick(Level level, BlockPos pos, BlockState state, CrusherBlockEntity crusher) {
        if (level.isClientSide()) return;

        boolean canProcess = crusher.canProcess();
        boolean active = canProcess && crusher.getEnergy() >= ENERGY_PER_TICK;

        if (active) {
            if (crusher.consumeEnergy(ENERGY_PER_TICK)) {
                crusher.progress++;
                if (crusher.progress >= PROCESS_TICKS) {
                    crusher.finishProcess();
                    crusher.progress = 0;
                }
                crusher.setChanged();
            }
        } else if (!canProcess && crusher.progress != 0) {
            crusher.progress = 0;
            crusher.setChanged();
        }

        if (state.hasProperty(CrusherBlock.ACTIVE) && state.getValue(CrusherBlock.ACTIVE) != active) {
            level.setBlock(pos, state.setValue(CrusherBlock.ACTIVE, active), 3);
        }
    }

    private boolean canProcess() {
        ItemStack input = getItem(INPUT_SLOT);
        if (input.isEmpty()) return false;

        ItemStack result = CrusherRecipes.getResult(input);
        if (result.isEmpty()) return false;

        ItemStack output = getItem(OUTPUT_SLOT);
        if (output.isEmpty()) return true;
        return ItemStack.isSameItemSameComponents(output, result) && output.getCount() + result.getCount() <= output.getMaxStackSize();
    }

    private void finishProcess() {
        ItemStack input = getItem(INPUT_SLOT);
        ItemStack result = CrusherRecipes.getResult(input);
        if (result.isEmpty()) return;

        input.shrink(1);
        if (input.isEmpty()) items.set(INPUT_SLOT, ItemStack.EMPTY);

        ItemStack output = getItem(OUTPUT_SLOT);
        if (output.isEmpty()) items.set(OUTPUT_SLOT, result.copy());
        else output.grow(result.getCount());
    }

    public boolean isWorking() { return canProcess() && getEnergy() >= ENERGY_PER_TICK; }
    public ContainerData getData() { return data; }

    @Override public long getEnergyCapacity() { return CAPACITY; }
    @Override public boolean canReceiveEnergy() { return true; }
    @Override public boolean canExtractEnergy() { return false; }
    @Override public EnergyRole getEnergyRole() { return EnergyRole.CONSUMER; }
    @Override public NonNullList<ItemStack> getItems() { return items; }

    @Override
    public void setItem(int slot, ItemStack stack) {
        if (slot < 0 || slot >= SLOT_COUNT) return;
        if (slot == INPUT_SLOT && !stack.isEmpty() && !CrusherRecipes.canCrush(stack)) return;
        items.set(slot, stack);
        if (slot == INPUT_SLOT) progress = 0;
        setChanged();
    }

    @Override public boolean stillValid(Player player) { return Container.stillValidBlockEntity(this, player); }

    @Override
    protected void saveAdditional(ValueOutput output) {
        super.saveAdditional(output);
        ContainerHelper.saveAllItems(output, items);
        output.putInt("progress", progress);
    }

    @Override
    protected void loadAdditional(ValueInput input) {
        super.loadAdditional(input);
        ContainerHelper.loadAllItems(input, items);
        progress = input.getIntOr("progress", 0);
    }

    @Override @NonNull public Component getDisplayName() { return Component.translatable("container.philtech.crusher"); }
    @Override public @Nullable AbstractContainerMenu createMenu(int containerId, Inventory inventory, Player player) {
        return new CrusherMenu(containerId, inventory, this, data);
    }
}
