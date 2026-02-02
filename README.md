Here is my implementation of a prototype viewer of IVION bundled datas, including pointcloud and panoramic images.

# Exploration of the bundle 📁
Below are notable folders and files used for building the custom viewer.
- cloud: contains _Potree_ compatible pointcloud data format (including _metadata.json_ and the blob file itself _octree.bin_)
- pano/info.list: each line is a JSON file name which contains a panorama infos
- info: each JSON file contains informations about one panorama image.
  - cam0...cam3: angles from which the image has been shot
  - cam_head: position and orientation of the head of the camera. It's this data that is used for positionning the markers onto the pointcloud.
  - footprint: position on the ground
  - valid: infos is used if and only if this is `true` (All of the json files seems to have `valid=true` though)
Other files/folders:
- pano: contains NavVis panorama data
- dataset.json: one interesting field of this field is `$.artifacts.panorama_format` which contains the geometry to be used when mapping the panorama images. (This implementation uses a sphere)
- panorama_visibilit.json: additional information about the panorama images, including their visbility.
- cloud_attributes: additional metadatas about the pointcloud

# Generation/Exportation of panorama images 📷
The bundle packages NavVis format images which is proprietary format and require additional decoder/reader if we want to render it in Potree (which uses Three.js)
As we have access to an __e57__ file including panoramas, we can extract them beforehand using external tooling like libe57 or PDAL, but we'll use a python wrapper for simplicity.
You can find below how to use `e57_img_extractor` from this same project.

# Which files are relevant and why
Our goal is to build a custom viewer that maps panorama markers onto the pointcloud. From the bundle, we need :
- the pointcloud: located in _cloud/_ folder
- panorama position and orientation: located in _info/_ folder
- since we can not iterate over the files, we need an exhaustive list of the panorama beforehand : described by _pano/info.list_
- panorama images: ⚠️ have to be extracted from the attached __e57__

# How to run
Clone the repo and its submodules. _Potree_ is not a consummable package on npm registry.
```sh
git clone --recurse-submodules https://github.com/bleak-and-bare/potree_panorama_viewer
```

Now we have to extract the panorama images. We will be using the _python_ utility inside this project.
```sh
cd potree_panorama_viewer/e57_img_extractor
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
- Let's keep the data files under one folder named `Test` (you can choose any other name)
- Extract the IVION bundle
- Copy the __e57__ file as well
Inside the cloned repo, we should have
```
Test
|_ TrialProject.e57
|_ Buero_2_2026-01-12
  |_ 2025-05-02_09.38.15
  | |_ cloud
  | |_ info
  | |_ pano
  | |_ ...
  |_ ...
```
Make sure to be inside `e57_img_extractor` then run
```
python main.py ../Test/TrialProject.e57
```
### 🔴 Observation
We don't manage to extract as much images as described inside `pano/info.list` of the bundle.
1. The e57 file may not contain every panorama images
2. The images may be using different representation (The script only extract images with `sphericalRepresentation`
)

All the datas to be used is now gathered

```
Test
|_ TrialProject.e57
|_ panorama
| |_ 00000.jpg
| |_ 00001.jpg
|_|_ ...
|_ Buero_2_2026-01-12
  |_ 2025-05-02_09.38.15
  | |_ cloud
  | |_ info
  | |_ pano
  | |_ ...
  |_ ...
```

We have to indicate where to find the relevant files using env variables.
Create a copy of `.env.example` as `.env` then change
```
DATAS=./Test_Project_Programmer
```
to 
```
DATAS=./Test
```

## 🐋 Now run
``` sh
docker compose up -d
```
# Additional notes 🤔
- The controls in _panorama_ mode is just simply bad but relatively acceptable for a prototype. Might have to dig a little deeper into `three.js` API to make it behave more like "human neck"
- Image extraction using the python script does not need to be done manually, it can be part of the `docker` pipeline so no python installation would be required.
- The panorama images should have been mapped to a cube instead of a sphere as mentionned `panorama_visibility.json` That file can be read at runtime then we pick the appropriate geometry to use.
- Rudimentary UI: basic toggle option between pointcloud and panorama view (we can do more)

Thank you for reading.
