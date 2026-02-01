import Panorama from "./Panorama"

class PanoramaViewer {
    sphere: InstanceType<typeof THREE.Mesh>
    markerGroup: InstanceType<typeof THREE.Group>
    viewer: Potree.Viewer

    constructor(viewer: Potree.Viewer) {
        const geometry = new THREE.SphereGeometry(50, 64, 64)
        geometry.scale(-1, 1, 1)

        const material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
        })

        const sphere = new THREE.Mesh(geometry, material)
        sphere.visible = false
        sphere.renderOrder = -1

        viewer.scene.scene.add(sphere)
        this.viewer = viewer
        this.sphere = sphere

        this.markerGroup = new THREE.Group()
    }

    enterMode(panorama: Panorama) {
        const camera = this.viewer.scene.getActiveCamera()
        if (!camera) {
            throw new Error("Failed to get active camera")
        }

        camera.position.set(
            panorama.position[0],
            panorama.position[1],
            panorama.position[2])

        camera.quaternion.set(
            panorama.quaternion[0],
            panorama.quaternion[1],
            panorama.quaternion[2],
            panorama.quaternion[3])

        const material = this.sphere.material as InstanceType<typeof THREE.MeshBasicMaterial>
        const loader = new THREE.TextureLoader()
        loader.load(panorama.image, texture => {
            material.map = texture
            this.sphere.visible = true
        })

        this.sphere.position.set(
            panorama.position[0],
            panorama.position[1],
            panorama.position[2])

        this.markerGroup.visible = false

        // only one PC loaded but just for consistency
        this.viewer.scene.pointclouds.forEach(pc => {
            pc.visible = false
            console.log("POINT CLOUD HAS BEEN HIDDEN")
        })
    }

    exitMode() {
        this.sphere.visible = false
        this.markerGroup.visible = true
        this.viewer.controls.enabled = true
        this.viewer.scene.pointclouds.forEach(pc => {
            pc.visible = true
            console.log("POINT CLOUD IS BEING SHOWN")
        })
    }
}

export default PanoramaViewer
