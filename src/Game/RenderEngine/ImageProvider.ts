import {
  getImagesByType,
  ImageEntry,
  imageRegistry,
  RenderImageKey,
  RenderImageType
} from "@/Game/RenderEngine/imageRegistry.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";

class ImageProvider {
  constructor(private images: readonly ImageEntry[]) {

  }

  public get = (key: RenderImageKey): ImageEntry =>
    this.images.find(entry => entry.key === key) as ImageEntry;

  public getByType = (type: RenderImageType): ImageEntry[] =>
    this.images.filter(image => image.type === type);

  public random = (type: RenderImageType) => {
    const images = getImagesByType(type)
    const index = randomRange(0, images.length - 1)
    return images[index]
  }

}

export const imageProvider = new ImageProvider(imageRegistry)