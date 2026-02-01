namespace Potree {
    function loadPointCloud(url: string, name: string, callback: (e: Event) => void)

    interface Compass {
        setVisible(visible: boolean)
    }

    class Controls {
        enabled: boolean
    }

    class PointCloud {
        visible: boolean
    }

    class EventDispatcher {
        addEventListener(type: string, listener: () => void)
        removeEventListener(type: string, listener: () => void)
    }

    class Annotation extends EventDispatcher {
        constructor(args: {
            position?: InstanceType<typeof THREE.Vector3>,
            title?: string
        })

        add(child: Annotation)
    }

    class Scene {
        scene: InstanceType<typeof THREE.Scene>
        pointclouds: PointCloud[]
        annotations: Annotation

        addPointCloud<T>(pc: T)
        getActiveCamera(): InstanceType<typeof THREE.Camera> | null
    }

    class Viewer extends EventDispatcher {
        scene: Scene
        compass: Compass
        controls: Controls
        earthControls: Controls
        renderer: InstanceType<typeof THREE.WebGLRenderer>

        constructor(e: HTMLElement)
        setControls(controls: Controls)
        setEDLEnabled(enabled: boolean)
        setBackground(bg: string)
        loadSettingsFromURL()
        fitToScreen()
        setPointBudget(n: number)
        getFOV(): number
        setFOV(fov: number)
    }
}
