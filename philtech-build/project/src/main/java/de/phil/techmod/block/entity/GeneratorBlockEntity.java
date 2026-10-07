package de.phil.techmod.block.entity;

import org.jspecify.annotations.NonNull;
import org.jspecify.annotations.Nullable;

import net.minecraft.core.BlockPos;
import net.minecraft.core.NonNullList;
import net.minecraft.network.chat.Component;
import net.minecraft.server.level.ServerLevel;
import net.minecraft.world.Container;
import net.minecraft.world.Containers;
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

import de.phil.techmod.container.ImplementedContainer;
import de.phil.techmod.block.custom.GeneratorBlock;
import de.phil.techmod.energy.AbstractEnergyBlockEntity;
import de.phil.techmod.energy.EnergyNetwork;
import de.phil.techmod.energy.EnergyRole;
import de.phil.techmod.menu.GeneratorMenu;
import de.phil.techmod.util.FuelHelper;

public final class GeneratorBlockEntity extends AbstractEnergyBlockEntity implements ImplementedContainer, MenuProvider {
    public static final int SLOT_COUNT = 1;
    public static final long CAPACITY = 20_000L;
    public static final long GENERATION_PER_TICK = 20L;
    public static final long MAX_OUTPUT_PER_TICK = 200L;

    private final NonNullList<ItemStack> items = NonNullList.withSize(SLOT_COUNT, ItemStack.EMPTY);
    private int burnTime;
    private int totalBurnTime;

    private final ContainerData data = new ContainerData() {
        @Override
        public int get(int index) {
            return switch (index) {
                case 0 -> (int) getEnergy();
                case 1 -> (int) getEnergyCapacity();
                case 2 -> burnTime;
                case 3 -> totalBurnTime;
                case 4 -> (int) GENERATION_PER_TICK;
                default -> 0;
            };
        }

        @Override
        public void set(int index, int value) {
            if (index == 2) {
                burnTime = value;
            } else if (index == 3) {
                totalBurnTime = value;
            }
        }

        @Override
        public int getCount() {
            return 5;
        }
    };

    public GeneratorBlockEntity(BlockPos pos, BlockState state) {
        super(ModBlockEntities.GENERATOR, pos, state);
    }

    public static void tick(Level level, BlockPos pos, BlockState state, GeneratorBlockEntity generator) {
        if (!(level instanceof ServerLevel serverLevel)) {
            return;
        }

        boolean changed = false;

        if (generator.burnTime <= 0 && generator.getEnergy() <= generator.getEnergyCapacity() - GENERATION_PER_TICK) {
            changed |= generator.tryConsumeFuel(serverLevel);
        }

        if (generator.burnTime > 0 && generator.getEnergy() <= generator.getEnergyCapacity() - GENERATION_PER_TICK) {
            generator.burnTime--;
            generator.addEnergyInternal(GENERATION_PER_TICK);
            changed = true;
        }

        if (generator.getEnergy() > 0) {
            EnergyNetwork.distribute(level, pos, generator, MAX_OUTPUT_PER_TICK, true);
        }

        boolean active = generator.burnTime > 0;
        if (state.hasProperty(GeneratorBlock.ACTIVE) && state.getValue(GeneratorBlock.ACTIVE) != active) {
            level.setBlock(pos, state.setValue(GeneratorBlock.ACTIVE, active), net.minecraft.world.level.block.Block.UPDATE_CLIENTS);
        }

        if (changed) {
            generator.setChanged();
        }
    }

    private boolean tryConsumeFuel(ServerLevel level) {
        ItemStack fuelStack = getItem(0);
        int duration = FuelHelper.getBurnTime(level, worldPosition, fuelStack);
        if (duration <= 0) {
            return false;
        }

        var remainder = fuelStack.getCraftingRemainder();
        fuelStack.shrink(1);

        if (remainder != null) {
            ItemStack remainderStack = remainder.create();
            if (fuelStack.isEmpty()) {
                items.set(0, remainderStack);
            } else if (!remainderStack.isEmpty()) {
                Containers.dropItemStack(
                        level,
                        worldPosition.getX() + 0.5D,
                        worldPosition.getY() + 1.0D,
                        worldPosition.getZ() + 0.5D,
                        remainderStack
                );
            }
        } else if (fuelStack.isEmpty()) {
            items.set(0, ItemStack.EMPTY);
        }

        burnTime = duration;
        totalBurnTime = duration;
        setChanged();
        return true;
    }

    public boolean isBurning() {
        return burnTime > 0;
    }

    public int getBurnTime() {
        return burnTime;
    }

    public int getTotalBurnTime() {
        return totalBurnTime;
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
        return false;
    }

    @Override
    public boolean canExtractEnergy() {
        return true;
    }

    @Override
    public EnergyRole getEnergyRole() {
        return EnergyRole.PRODUCER;
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
        items.set(0, stack);
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
        output.putInt("burn_time", burnTime);
        output.putInt("total_burn_time", totalBurnTime);
    }

    @Override
    protected void loadAdditional(ValueInput input) {
        super.loadAdditional(input);
        ContainerHelper.loadAllItems(input, items);
        burnTime = input.getIntOr("burn_time", 0);
        totalBurnTime = input.getIntOr("total_burn_time", 0);
    }

    @Override
    @NonNull
    public Component getDisplayName() {
        return Component.translatable("container.philtech.generator");
    }

    @Override
    public @Nullable AbstractContainerMenu createMenu(int containerId, Inventory inventory, Player player) {
        return new GeneratorMenu(containerId, inventory, this, data);
    }
}
