import Panorama from "./Panorama";

type RawPanorama = {
    cam_head: {
        position: number[],
        quaternion: number[],
    },
    valid: boolean
}

async function imageExist(path: string): Promise<boolean> {
    try {
        const loader = new THREE.TextureLoader()
        await loader.loadAsync(path)
        return true
    } catch (e) {
        return false
    }
}

async function getPanoramas(): Promise<Panorama[]> {
    let res = await fetch(import.meta.env.VITE_BASE_DATA_URL + import.meta.env.VITE_PANO_LIST)
    const raw = await res.text()
    const infoList = raw.split('\n').map(line => line.trim())
    const panoramas: Panorama[] = []

    for (const info of infoList) {
        if (info.length === 0) continue

        try {
            res = await fetch(`${import.meta.env.VITE_BASE_DATA_URL + import.meta.env.VITE_PANO_INFOS}/${info}`)
            const pano: RawPanorama = await res.json()
            const panoId = info.split('-')[0]
            const panoImg = `${import.meta.env.VITE_BASE_DATA_URL + import.meta.env.VITE_PANO_IMAGES}/${panoId}.jpg`

            if (await imageExist(panoImg))
                panoramas.push({
                    id: panoId,
                    image: panoImg,
                    position: pano.cam_head.position,
                    quaternion: pano.cam_head.quaternion,
                })
        } catch (e) {
            console.error(e)
        }
    }

    return panoramas
}

export { getPanoramas }
