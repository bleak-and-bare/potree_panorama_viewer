import "@mantine/core/styles.css";
import { Affix, MantineProvider, Text, Slider, Stack, ActionIcon, Group } from "@mantine/core";
import { theme } from "./theme";
import { PotreeViewer } from "./PotreeViewer";
import { useState } from "react";
import { IconPhoto, IconCloud } from "@tabler/icons-react";
import ViewMode from "./ViewMode";

export default function App() {
    const [viewMode, setViewMode] = useState(ViewMode.PointCloud)
    const [pointBudget, setPointBudget] = useState(1_000_000)
    const [selectedPano, setSelectedPano] = useState("")

    const toggleViewMode = () => setViewMode(mode => mode === ViewMode.Panorama ? ViewMode.PointCloud : ViewMode.Panorama)

    return <MantineProvider theme={theme} defaultColorScheme="dark">
        <Affix zIndex={100} position={{ top: 20, left: 20 }}>
            <Stack style={{ minWidth: 360 }}>
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
                {selectedPano.length > 0 && <Text><b>Selected panorama</b> : {selectedPano}</Text>}
            </Stack>
        </Affix>
        <PotreeViewer setSelectedPano={pano => setSelectedPano(pano)} viewMode={viewMode} pointBudget={pointBudget} />
    </MantineProvider>;
}
