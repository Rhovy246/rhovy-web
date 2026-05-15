import imgPGMIA from '../assets/images/PGMIA.png';
import imgPre from '../assets/images/pre.png';
import imgThavage from '../assets/images/thavage.png';
import imgBellTop from '../assets/images/unique_belle.png';
import imgSaraSkirt from '../assets/images/unique_sara.png';
import imgMajoPants from '../assets/images/unique_majo.png';
import imgVisaGiftCard from '../assets/images/visa.png';
import imgTotalWar from '../assets/images/totalwar.png';
import imgLeanBody from '../assets/images/leanbody.png';

export const BUSINESS_PARTNERS = {
  POWERHOUSE_GYM: { name: 'Powerhouse SoFlo', logo: imgPGMIA },
  UNIQUE: { name: 'UNIQUE', logo: imgBellTop },
} as const;

export const PRODUCT_IMAGES: Record<string, string> = {
  'Scoop of Pre-Workout': imgPre,
  'Bum Thavage 20% off': imgThavage,
  'Day Pass 50% off': imgPGMIA,
  'Belle Top 15% off': imgBellTop,
  'Sara Button Skirt 15% off': imgSaraSkirt,
  'Majo Pants 15% off': imgMajoPants,
  '$25 Visa Gift Card': imgVisaGiftCard,
  '20% Off Total War Pre-Workout Drink': imgTotalWar,
  '20% Off Lean Body Protein Shake': imgLeanBody,
};

export function getProductImage(itemName: string): string {
  const direct = PRODUCT_IMAGES[itemName];
  if (direct) return direct;

  const lower = itemName.toLowerCase();
  if (lower.includes('thavage')) return imgThavage;
  if (lower.includes('total war')) return imgTotalWar;
  if (lower.includes('pre-workout') || lower.includes('preworkout')) return imgPre;
  if (lower.includes('day pass')) return imgPGMIA;
  if (lower.includes('visa') || lower.includes('gift card')) return imgVisaGiftCard;
  if (lower.includes('belle top')) return imgBellTop;
  if (lower.includes('sara')) return imgSaraSkirt;
  if (lower.includes('majo')) return imgMajoPants;
  if (lower.includes('lean body')) return imgLeanBody;
  if (lower.includes('unique')) return imgBellTop;

  return imgPGMIA;
}

export function getBrandFromItemName(itemName: string): string {
  const lower = itemName.toLowerCase();
  if (lower.includes('belle top') || lower.includes('sara') || lower.includes('majo')) {
    return BUSINESS_PARTNERS.UNIQUE.name;
  }
  return BUSINESS_PARTNERS.POWERHOUSE_GYM.name;
}
