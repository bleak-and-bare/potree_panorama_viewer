import { useEffect, useRef, useState } from "react";
import PanoramaViewer from "./panorama/PanoramaViewer";
import ViewMode from "./ViewMode";
import { getPanoramas } from "./panorama/panoramas";
import Panorama from "./panorama/Panorama";

type PotreeViewerProps = {
    pointBudget: number,
    viewMode: ViewMode,
    setSelectedPano: (pano: string) => void
}

export function PotreeViewer({ pointBudget, setSelectedPano, viewMode }: PotreeViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const viewerRef = useRef<Potree.Viewer>(null)
    const panoRef = useRef<PanoramaViewer>(null)
    const prevCameraRef = useRef<{
        position: InstanceType<typeof THREE.Vector3>,
        quaternion: InstanceType<typeof THREE.Quaternion>
    } | null>(null)
    const [panoramas, setPanoramas] = useState<Panorama[]>([])
    const [activePanoId, setActivePanoId] = useState<string | null>(null)

    useEffect(() => {
        if (!containerRef.current) return
        getPanoramas().then(panos => {
            setPanoramas(panos)
            setActivePanoId(panos[0].id)
        })

        const viewer = new Potree.Viewer(containerRef.current)
        viewer.setEDLEnabled(true)
        viewer.loadSettingsFromURL()
        viewer.setBackground("skybox")
        viewer.compass.setVisible(true)

        const pcUrl = import.meta.env.VITE_POINTCLOUD // '/pointclouds/cloud/metadata.json'
        Potree.loadPointCloud(
            pcUrl,
            "test_cloud",
            (e: any) => {
                const pc = e.pointcloud
                viewer.scene.addPointCloud(pc)
                viewer.fitToScreen()

                viewerRef.current = viewer
                panoRef.current = new PanoramaViewer(viewer)
            }
        )

        return () => {
            if (containerRef.current)
                containerRef.current.innerHTML = ""
        }
    }, [])

    useEffect(() => {
        const viewer = viewerRef.current
        if (!viewer || !panoRef.current) return

        const group = panoRef.current.markerGroup
        panoramas.forEach(pano => {
            const marker = createMarker(pano)
            group.add(marker)
        })
        viewer.scene.scene.add(group)

        setupMarkerInteraction(viewer, pano => {
            if (viewMode === ViewMode.Panorama) return

            setActivePanoId(pano.id)
            setSelectedPano(pano.id)
        })
    }, [panoramas, panoRef])

    useEffect(() => {
        if (
            !panoRef.current
            || panoramas.length === 0
            || activePanoId === null
            || activePanoId.length === 0) return

        if (viewMode === ViewMode.Panorama) {
            const pano = panoramas.find(pano => pano.id === activePanoId)
            const camera = viewerRef.current?.scene.getActiveCamera()
            if (camera) {
                prevCameraRef.current = {
                    position: camera.position.clone(),
                    quaternion: camera.quaternion.clone()
                }
            }

            panoRef.current.enterMode(pano!)
        } else {
            panoRef.current.exitMode()

            const camera = viewerRef.current?.scene.getActiveCamera()
            const prevCamera = prevCameraRef.current
            if (camera && prevCamera) {
                camera.position.copy(prevCamera.position)
                camera.quaternion.copy(prevCamera.quaternion)
            }
        }
    }, [viewMode])

    useEffect(() => {
        if (viewerRef.current) {
            viewerRef.current.setPointBudget(pointBudget)
        }
    }, [pointBudget])

    return <div ref={containerRef} style={{
        width: "100vw",
        height: "100vh"
    }}></div>
}

function createMarker(pano: Panorama): InstanceType<typeof THREE.Sprite> {
    const material = new THREE.SpriteMaterial({
        map: new THREE.TextureLoader().load("/icons/360-degree.png"),
        sizeAttenuation: true
    })

    const sprite = new THREE.Sprite(material)
    sprite.userData.panorama = pano
    sprite.scale.set(0.5, 0.5, 0.5)
    sprite.position.set(
        pano.position[0],
        pano.position[1],
        pano.position[2],
    )

    return sprite
}

function setupMarkerInteraction(
    viewer: Potree.Viewer,
    onClick: (p: Panorama) => void
) {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const dom = viewer.renderer.domElement;

    dom.addEventListener("click", (event) => {
        const camera = viewer.scene.getActiveCamera()
        if (!camera) {
            console.error("Failed to get active camera")
            return
        }

        const rect = dom.getBoundingClientRect();
        mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(viewer.scene.scene.children, true);
        for (const i of intersects) {
            const obj = i.object;
            if (obj.userData.panorama) {
                onClick(obj.userData.panorama);
                break;
            }
        }
    });
}

