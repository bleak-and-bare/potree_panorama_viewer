import { useState } from "react";
import { Popover, ActionIcon, Text, Slider, Group, Stack } from "@mantine/core";
import { IconCloud, IconPhoto, IconPlus, IconX } from "@tabler/icons-react";
import ViewMode from "./ViewMode";

type FloatingMenuProps = {
    pointBudget: number,
    setPointBudget: (points: number) => void,
    viewMode: ViewMode,
    toggleViewMode: () => void,
    selectedPano: string,
}

export function FloatingMenu({
    pointBudget,
    viewMode,
    selectedPano,
    setPointBudget,
    toggleViewMode,
}: FloatingMenuProps) {
    const [opened, setOpened] = useState(false);

    return (
        <Popover
            opened={opened}
            onChange={setOpened}
            position="top-end"
            withArrow
            shadow="md"
        >
            <Popover.Target>
                <ActionIcon
                    size="lg"
                    radius="xl"
                    onClick={() => setOpened((o) => !o)}
                >
                    {opened ? <IconX size={18} /> : <IconPlus size={18} />}
                </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
                <Stack>
                    <Text c="white" size="sm">Point budget</Text>
                    <Slider
                        defaultValue={pointBudget}
                        min={500_000}
                        max={2_000_000}
                        step={10_000}
                        onChangeEnd={setPointBudget}
                        label={value => value} />
                    <Group>
                        <Text c="white" size="sm">Select view mode</Text>
                        <ActionIcon
                            title="Panorama"
                            disabled={viewMode === ViewMode.Panorama}
                            variant="outline"
                            onClick={toggleViewMode}
                        >
                            <IconPhoto />
                        </ActionIcon>
                        <ActionIcon
                            title="Point cloud"
                            disabled={viewMode === ViewMode.PointCloud}
                            variant="outline"
                            onClick={toggleViewMode}
                        >
                            <IconCloud />
                        </ActionIcon>
                    </Group>
                    {selectedPano && selectedPano.length > 0 && <Text><b>Selected panorama</b> : {selectedPano}</Text>}
                </Stack>
            </Popover.Dropdown>
        </Popover>
    );
}
