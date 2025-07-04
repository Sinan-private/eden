import cloud_image1 from '../../assets/images/clouds1.png'
import cloud_image2 from '../../assets/images/clouds2.png'
import branch_image2 from '../../assets/images/Branch3.png'
import branch_image3 from '../../assets/images/Branch4.png'
import branch_image4 from '../../assets/images/Branch5.png'
import branch_image5 from '../../assets/images/Branch6.png'
import branch_image7 from '../../assets/images/Branch8.png'
import branch_image8 from '../../assets/images/Branch9.png'
import branch_image9 from '../../assets/images/Branch10.png'
import branch_image10 from '../../assets/images/Branch11.png'
import mushroom_image1 from '../../assets/images/mushroom1.png'
import mushroom_image2 from '../../assets/images/mushroom2.png'
import mushroom_image3 from '../../assets/images/mushroom3.png'
import mushroom_image4 from '../../assets/images/mushroom4.png'
import mushroom_image5 from '../../assets/images/mushroom5.png'
import mushroom_image6 from '../../assets/images/mushroom6.png'
import mana_vein1 from '../../assets/images/mana_vein1.png'
import mana_vein2 from '../../assets/images/mana_vein2.png'
import mana_vein3 from '../../assets/images/mana_vein3.png'
import test_image from '../../assets/images/test.png'


export const imageRegistry = [
  { key: 'test', image: test_image, width: 160, height: 100, type: 'test' },
  { key: 'cloud1', image: cloud_image1, width: 768, height: 369, type: 'cloud' },
  { key: 'cloud2', image: cloud_image2, width: 674, height: 375, type: 'cloud' },
  { key: 'branch2', image: branch_image2, width: 800, height: 222, type: 'branch' },
  { key: 'branch3', image: branch_image3, width: 704, height: 300, type: 'branch' },
  { key: 'branch4', image: branch_image4, width: 496, height: 280, type: 'branch' },
  { key: 'branch5', image: branch_image5, width: 800, height: 285, type: 'branch' },
  { key: 'branch7', image: branch_image7, width: 600, height: 309, type: 'branch' },
  { key: 'branch8', image: branch_image8, width: 400, height: 269, type: 'branch' },
  { key: 'branch9', image: branch_image9, width: 300, height: 192, type: 'branch' },
  { key: 'branch10', image: branch_image10, width: 612, height: 336, type: 'branch' },
  { key: 'mushroom1', image: mushroom_image1, width: 200, height: 90, type: 'mushroom' },
  { key: 'mushroom2', image: mushroom_image2, width: 137, height: 75, type: 'mushroom' },
  { key: 'mushroom3', image: mushroom_image3, width: 160, height: 127, type: 'mushroom' },
  { key: 'mushroom4', image: mushroom_image4, width: 180, height: 113, type: 'mushroom' },
  { key: 'mushroom5', image: mushroom_image5, width: 167, height: 110, type: 'mushroom' },
  { key: 'mushroom6', image: mushroom_image6, width: 200, height: 142, type: 'mushroom' },
  { key: 'mana_vein1', image: mana_vein1, width: 120, height: 400, type: 'mana_vein' },
  { key: 'mana_vein2', image: mana_vein2, width: 236, height: 401, type: 'mana_vein' },
  { key: 'mana_vein3', image: mana_vein3, width: 142, height: 258, type: 'mana_vein' },
] as const;

export type ImageEntry = (typeof imageRegistry)[number];

export type RenderImageKey = ImageEntry['key'];
export type RenderImageType = ImageEntry['type'];
