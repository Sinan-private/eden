import {
  ImageEntry,
  imageRegistry,
  RenderImageKey,
  RenderImageType
} from "@/Game/RenderEngine/imageRegistry.ts";
import {randomRange} from "@/Game/helpers/randomRange.ts";
import {getGajaSize, getScreenSize, MediaQueryKey} from "@/Game/RenderEngine/media_queries.ts";

export class ImageProvider {
  constructor() {

  }

  static get = (key: RenderImageKey): ImageEntry =>
    imageRegistry.find(entry => entry.key === key) as ImageEntry;

  static getByType = (type: RenderImageType): ImageEntry[] =>
    imageRegistry.filter(image => image.type === type);

  static random = (type: RenderImageType) => {
    const images = ImageProvider.getByType(type)
    const index = randomRange(0, images.length - 1)
    return images[index]
  }

  static get screen_size(): MediaQueryKey {
    return getScreenSize(window.innerWidth)
  }

  static get getGajaSize() {
    return getGajaSize()
  }

}

