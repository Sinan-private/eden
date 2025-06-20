import cloud_image1 from '../../assets/images/clouds1.png'
import cloud_image2 from '../../assets/images/clouds2.png'
// import cloud_image4 from '../../assets/images/clouds4.png'
import branch_image1 from '../../assets/images/Branch2.png'
import branch_image2 from '../../assets/images/Branch3.png'
import branch_image3 from '../../assets/images/Branch4.png'
import branch_image4 from '../../assets/images/Branch5.png'
import branch_image5 from '../../assets/images/Branch6.png'
import branch_image6 from '../../assets/images/Branch7.png'

// type ImageType = 'cloud' | 'branch'
// type ImageMeta = { image: string; width: number; height: number; type: ImageType };

const imageRegistry = [
  { key: 'cloud1', image: cloud_image1, width: 768, height: 369, type: 'cloud' },
  { key: 'cloud2', image: cloud_image2, width: 674, height: 375, type: 'cloud' },
  // { key: 'cloud3', image: cloud_image4, width: 600, height: 420, type: 'cloud' },
  { key: 'branch1', image: branch_image1, width: 800, height: 544, type: 'branch' },
  { key: 'branch2', image: branch_image2, width: 800, height: 222, type: 'branch' },
  { key: 'branch3', image: branch_image3, width: 800, height: 314, type: 'branch' },
  { key: 'branch4', image: branch_image4, width: 800, height: 262, type: 'branch' },
  { key: 'branch5', image: branch_image5, width: 800, height: 285, type: 'branch' },
  { key: 'branch6', image: branch_image6, width: 800, height: 862, type: 'branch' },
] as const;

type ImageEntry = (typeof imageRegistry)[number];

export type RenderImageKey = ImageEntry['key'];
export type RenderImageType = ImageEntry['type'];

export const getImage = (key: RenderImageKey): ImageEntry =>
  imageRegistry.find(entry => entry.key === key) as ImageEntry;
export const getImagesByType = (type: RenderImageType): ImageEntry[] =>
  imageRegistry.filter(image => image.type === type);