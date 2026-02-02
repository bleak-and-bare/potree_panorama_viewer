import "@mantine/core/styles.css";
import { Affix, MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { PotreeViewer } from "./PotreeViewer";
import { useState } from "react";
import ViewMode from "./ViewMode";
import { FloatingMenu } from "./FloatingMenu";

export default function App() {
    const [viewMode, setViewMode] = useState(ViewMode.PointCloud)
    const [pointBudget, setPointBudget] = useState(1_000_000)
    const [selectedPano, setSelectedPano] = useState("")

    return <MantineProvider theme={theme} defaultColorScheme="dark">
        <Affix zIndex={100} position={{ top: 20, left: 20 }}>
            <FloatingMenu
                pointBudget={pointBudget}
                setPointBudget={points => setPointBudget(points)}
                toggleViewMode={() => setViewMode(mode => mode === ViewMode.Panorama ? ViewMode.PointCloud : ViewMode.Panorama)}
                viewMode={viewMode}
                selectedPano={selectedPano}
            />
        </Affix>
        <PotreeViewer setSelectedPano={pano => setSelectedPano(pano)} viewMode={viewMode} pointBudget={pointBudget} />
    </MantineProvider>;
}
