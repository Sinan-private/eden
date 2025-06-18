import cloud_image1 from '../../assets/images/clouds1.png'
import cloud_image2 from '../../assets/images/clouds2.png'
import cloud_image4 from '../../assets/images/clouds4.png'
import branch_image1 from '../../assets/images/Branch2.png'
import branch_image2 from '../../assets/images/Branch3.png'
import branch_image3 from '../../assets/images/Branch4.png'
import branch_image4 from '../../assets/images/Branch5.png'
import branch_image5 from '../../assets/images/Branch6.png'
import branch_image6 from '../../assets/images/Branch7.png'

// type ImageType = 'cloud' | 'branch'
// type ImageMeta = { image: string; width: number; height: number; type: ImageType };

const imageRegistry = {
  cloud1: { image: cloud_image1, width: 768, height: 450, type: 'cloud' },
  cloud2: { image: cloud_image2, width: 726, height: 450, type: 'cloud' },
  cloud3: { image: cloud_image4, width: 600, height: 420, type: 'cloud' },
  branch1: { image: branch_image1, width: 800, height: 544, type: 'branch' },
  branch2: { image: branch_image2, width: 800, height: 222, type: 'branch' },
  branch3: { image: branch_image3, width: 800, height: 314, type: 'branch' },
  branch4: { image: branch_image4, width: 800, height: 262, type: 'branch' },
  branch5: { image: branch_image5, width: 800, height: 285, type: 'branch' },
  branch6: { image: branch_image6, width: 800, height: 862, type: 'branch' },
} as const;

export type RenderImageKey = keyof typeof imageRegistry
export const getImage = (key: RenderImageKey) => imageRegistry[key];
