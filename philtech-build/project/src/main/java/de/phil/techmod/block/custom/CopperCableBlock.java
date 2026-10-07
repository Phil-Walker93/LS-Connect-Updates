package de.phil.techmod.block.custom;

import java.util.EnumMap;
import java.util.Map;

import net.minecraft.core.BlockPos;
import net.minecraft.core.Direction;
import net.minecraft.util.RandomSource;
import net.minecraft.world.item.context.BlockPlaceContext;
import net.minecraft.world.level.BlockGetter;
import net.minecraft.world.level.LevelReader;
import net.minecraft.world.level.ScheduledTickAccess;
import net.minecraft.world.level.block.Block;
import net.minecraft.world.level.block.state.BlockState;
import net.minecraft.world.level.block.state.StateDefinition;
import net.minecraft.world.level.block.state.properties.BooleanProperty;
import net.minecraft.world.phys.shapes.CollisionContext;
import net.minecraft.world.phys.shapes.Shapes;
import net.minecraft.world.phys.shapes.VoxelShape;

import de.phil.techmod.energy.TechEnergy;

public final class CopperCableBlock extends Block {
    private static final Map<Direction, BooleanProperty> CONNECTIONS = new EnumMap<>(Direction.class);

    public static final BooleanProperty DOWN = connection(Direction.DOWN);
    public static final BooleanProperty UP = connection(Direction.UP);
    public static final BooleanProperty NORTH = connection(Direction.NORTH);
    public static final BooleanProperty SOUTH = connection(Direction.SOUTH);
    public static final BooleanProperty WEST = connection(Direction.WEST);
    public static final BooleanProperty EAST = connection(Direction.EAST);

    private static final VoxelShape CORE = Block.box(6, 6, 6, 10, 10, 10);
    private static final VoxelShape ARM_DOWN = Block.box(6, 0, 6, 10, 6, 10);
    private static final VoxelShape ARM_UP = Block.box(6, 10, 6, 10, 16, 10);
    private static final VoxelShape ARM_NORTH = Block.box(6, 6, 0, 10, 10, 6);
    private static final VoxelShape ARM_SOUTH = Block.box(6, 6, 10, 10, 10, 16);
    private static final VoxelShape ARM_WEST = Block.box(0, 6, 6, 6, 10, 10);
    private static final VoxelShape ARM_EAST = Block.box(10, 6, 6, 16, 10, 10);

    private static BooleanProperty connection(Direction direction) {
        BooleanProperty property = BooleanProperty.create(direction.getName());
        CONNECTIONS.put(direction, property);
        return property;
    }

    public CopperCableBlock(Properties properties) {
        super(properties);
        BlockState state = stateDefinition.any();
        for (BooleanProperty property : CONNECTIONS.values()) {
            state = state.setValue(property, false);
        }
        registerDefaultState(state);
    }

    @Override
    protected void createBlockStateDefinition(StateDefinition.Builder<Block, BlockState> builder) {
        CONNECTIONS.values().forEach(builder::add);
    }

    @Override
    public BlockState getStateForPlacement(BlockPlaceContext context) {
        BlockState state = defaultBlockState();
        for (Direction direction : Direction.values()) {
            state = state.setValue(CONNECTIONS.get(direction), shouldConnect(context.getLevel(), context.getClickedPos().relative(direction)));
        }
        return state;
    }

    @Override
    protected BlockState updateShape(BlockState state, LevelReader level, ScheduledTickAccess tickAccess,
                                     BlockPos pos, Direction direction, BlockPos neighborPos,
                                     BlockState neighborState, RandomSource random) {
        return state.setValue(CONNECTIONS.get(direction), shouldConnect(level, neighborPos));
    }

    private static boolean shouldConnect(BlockGetter level, BlockPos pos) {
        if (level.getBlockState(pos).getBlock() instanceof CopperCableBlock) return true;
        return level.getBlockEntity(pos) instanceof TechEnergy;
    }

    @Override
    protected VoxelShape getShape(BlockState state, BlockGetter level, BlockPos pos, CollisionContext context) {
        VoxelShape shape = CORE;
        if (state.getValue(DOWN)) shape = Shapes.or(shape, ARM_DOWN);
        if (state.getValue(UP)) shape = Shapes.or(shape, ARM_UP);
        if (state.getValue(NORTH)) shape = Shapes.or(shape, ARM_NORTH);
        if (state.getValue(SOUTH)) shape = Shapes.or(shape, ARM_SOUTH);
        if (state.getValue(WEST)) shape = Shapes.or(shape, ARM_WEST);
        if (state.getValue(EAST)) shape = Shapes.or(shape, ARM_EAST);
        return shape;
    }
}
