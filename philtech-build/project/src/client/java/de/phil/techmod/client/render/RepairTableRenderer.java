package de.phil.techmod.client.render;

import com.mojang.blaze3d.vertex.PoseStack;
import com.mojang.math.Axis;
import org.jetbrains.annotations.Nullable;

import net.minecraft.client.renderer.SubmitNodeCollector;
import net.minecraft.client.renderer.blockentity.BlockEntityRenderer;
import net.minecraft.client.renderer.blockentity.BlockEntityRendererProvider;
import net.minecraft.client.renderer.feature.ModelFeatureRenderer;
import net.minecraft.client.renderer.item.ItemModelResolver;
import net.minecraft.client.renderer.state.level.CameraRenderState;
import net.minecraft.client.renderer.texture.OverlayTexture;
import net.minecraft.world.item.ItemDisplayContext;
import net.minecraft.world.phys.Vec3;

import de.phil.techmod.block.entity.RepairTableBlockEntity;

public final class RepairTableRenderer implements BlockEntityRenderer<RepairTableBlockEntity, RepairTableRenderState> {
    private final ItemModelResolver itemModelResolver;

    public RepairTableRenderer(BlockEntityRendererProvider.Context context) {
        this.itemModelResolver = context.itemModelResolver();
    }

    @Override
    public RepairTableRenderState createRenderState() {
        return new RepairTableRenderState();
    }

    @Override
    public void extractRenderState(
            RepairTableBlockEntity blockEntity,
            RepairTableRenderState state,
            float tickProgress,
            Vec3 cameraPos,
            @Nullable ModelFeatureRenderer.CrumblingOverlay crumblingOverlay
    ) {
        BlockEntityRenderer.super.extractRenderState(blockEntity, state, tickProgress, cameraPos, crumblingOverlay);

        state.item.clear();
        var stack = blockEntity.getRenderedStack();
        if (stack.isEmpty()) {
            return;
        }

        itemModelResolver.updateForTopItem(
                state.item,
                stack,
                ItemDisplayContext.GROUND,
                blockEntity.getLevel(),
                null,
                (int) blockEntity.getBlockPos().asLong()
        );

        float time = blockEntity.getLevel() == null
                ? tickProgress
                : blockEntity.getLevel().getGameTime() + tickProgress;

        state.repairing = blockEntity.isRepairing();
        state.bob = (float) Math.sin(time * 0.12F) * (state.repairing ? 0.055F : 0.025F);
        state.rotationDegrees = (time * (state.repairing ? 2.5F : 1.0F)) % 360.0F;
    }

    @Override
    public void submit(
            RepairTableRenderState state,
            PoseStack poseStack,
            SubmitNodeCollector nodes,
            CameraRenderState cameraRenderState
    ) {
        if (state.item.isEmpty()) {
            return;
        }

        poseStack.pushPose();
        poseStack.translate(0.5F, 1.15F + state.bob, 0.5F);
        poseStack.rotate(Axis.YP.rotationDegrees(state.rotationDegrees));
        poseStack.rotate(Axis.XP.rotationDegrees(75.0F));
        poseStack.scale(0.72F, 0.72F, 0.72F);

        state.item.submit(poseStack, nodes, state.lightCoords, OverlayTexture.NO_OVERLAY, 0);
        poseStack.popPose();
    }
}
