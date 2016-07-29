# Images processing
A field marked with the flag *"isFile"* is associated with an image upload. When an image is uploaded a new folder with the source image is created, then when the actual record insertion (or update) is complete, the image processing logic is triggered and a new image for each cut defined is created in the same folder.

## Asset config file
```javascript
services: {// 1)
  assets: {// 2)
    cuts:{// 3)
      news:[// 4)
        {name: 'small', width: 100, height:100},// 5)
        {name: 'medium', width: 500, height:500}
      ]
    }
  }
}
```
1. append to the config object services;
2. append to the property assets;
3. append to the property cuts, which contains the information on how to process an image;
4. settings for the model "news", each item of the array will create an image with the settings expressed;
5. single image setting: *name* is the name of the cut and will be prepended to the source image, like this `small_sourceImageUUID.png`,
  width and height are the size of the new image in pixels.
