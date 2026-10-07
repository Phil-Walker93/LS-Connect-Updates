package de.phil.techmod.menu;

import net.minecraft.core.Registry;
import net.minecraft.core.registries.BuiltInRegistries;
import net.minecraft.world.flag.FeatureFlagSet;
import net.minecraft.world.inventory.AbstractContainerMenu;
import net.minecraft.world.inventory.MenuType;

import de.phil.techmod.TechMod;

public final class ModMenuTypes {
    public static final MenuType<RepairTableMenu> REPAIR_TABLE = register(
            "repair_table",
            RepairTableMenu::new
    );

    public static final MenuType<GeneratorMenu> GENERATOR = register(
            "generator",
            GeneratorMenu::new
    );

    public static final MenuType<CrusherMenu> CRUSHER = register(
            "crusher",
            CrusherMenu::new
    );

    private ModMenuTypes() {
    }

    private static <T extends AbstractContainerMenu> MenuType<T> register(
            String name,
            MenuType.MenuSupplier<T> constructor
    ) {
        return Registry.register(
                BuiltInRegistries.MENU,
                TechMod.id(name),
                new MenuType<>(constructor, FeatureFlagSet.of())
        );
    }

    public static void initialize() {
    }
}
