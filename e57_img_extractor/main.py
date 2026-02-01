import pye57
import sys
import numpy as np
import cv2
import os

OUTPUT_FOLDER = "panorama"

if __name__ == "__main__":
    if len(sys.argv) <= 1:
        print("You have to provide path to e57 point cloud file")
        exit(1)

    e57_file = sys.argv[1]

    # creating output folder
    output_folder = os.path.join(os.path.dirname(e57_file), OUTPUT_FOLDER)
    os.makedirs(output_folder, exist_ok=True)

    with pye57.E57(e57_file) as e:
        root = e.image_file.root()
        print("Point cloud loaded")

        if not root["images2D"]:
            print("File does not contain 2D images.")
        else:
            for idx, img in enumerate(root["images2D"]):
                name = img["name"].value()
                spherical = img["sphericalRepresentation"]
                jpg_img = spherical["jpegImage"]
                jpg_img_data = np.zeros(shape=jpg_img.byteCount(), dtype=np.uint8)
                jpg_img.read(jpg_img_data, 0, jpg_img.byteCount())
                img = cv2.imdecode(jpg_img_data, cv2.IMREAD_COLOR)

                cv2.imwrite(
                    os.path.join(output_folder, name.split("_")[0] + ".jpg"), img
                )
