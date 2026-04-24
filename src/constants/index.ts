import imgPGMIA from '../assets/images/PGMIA.png';
import imgUnique from '../assets/images/unique.png';
import imgPreworkout from '../assets/images/preworkout.avif';
import imgThavage from '../assets/images/thavage.webp';
import imgCorePower from '../assets/images/corepower.png';
import imgBellTop from '../assets/images/bell_top.png';
import imgSaraSkirt from '../assets/images/sara_skirt.png';
import imgMajoPants from '../assets/images/majo_pants.png';
import imgVisaGiftCard from '../assets/images/visa_gift_card.png';
import imgTotalWar from '../assets/images/total_war.png';
import imgRawProtein from '../assets/images/raw_protein_shake.png';
import imgLeanBody from '../assets/images/lean_body_protein_shake.png';

export const BUSINESS_PARTNERS = {
  POWERHOUSE_GYM: { name: 'Powerhouse SoFlo', logo: imgPGMIA },
  UNIQUE: { name: 'UNIQUE', logo: imgUnique },
} as const;

export const PRODUCT_IMAGES: Record<string, string> = {
  'Scoop of Pre-Workout': imgPreworkout,
  'Bum Thavage 20% off': imgThavage,
  'Core Power Protein 20% off': imgCorePower,
  'Day Pass 50% off': imgPGMIA,
  'Belle Top 15% off': imgBellTop,
  'Sara Button Skirt 15% off': imgSaraSkirt,
  'Majo Pants 15% off': imgMajoPants,
  '$25 Visa Gift Card': imgVisaGiftCard,
  '20% Off RAW Protein Shake': imgRawProtein,
  '20% Off Lean Body Protein Shake': imgLeanBody,
  '20% Off Total War Pre-Workout Drink': imgTotalWar,
};

export function getProductImage(itemName: string): string {
  const direct = PRODUCT_IMAGES[itemName];
  if (direct) return direct;

  const lower = itemName.toLowerCase();
  if (lower.includes('core power') || lower.includes('corepower')) return PRODUCT_IMAGES['Core Power Protein 20% off'];
  if (lower.includes('total war')) return PRODUCT_IMAGES['20% Off Total War Pre-Workout Drink'];
  if (lower.includes('pre-workout') || lower.includes('preworkout')) return PRODUCT_IMAGES['Scoop of Pre-Workout'];
  if (lower.includes('thavage')) return PRODUCT_IMAGES['Bum Thavage 20% off'];
  if (lower.includes('day pass')) return PRODUCT_IMAGES['Day Pass 50% off'];
  if (lower.includes('visa') || lower.includes('gift card')) return PRODUCT_IMAGES['$25 Visa Gift Card'];
  if (lower.includes('belle top')) return PRODUCT_IMAGES['Belle Top 15% off'];
  if (lower.includes('sara')) return PRODUCT_IMAGES['Sara Button Skirt 15% off'];
  if (lower.includes('majo')) return PRODUCT_IMAGES['Majo Pants 15% off'];
  if (lower.includes('lean body')) return PRODUCT_IMAGES['20% Off Lean Body Protein Shake'];
  if (lower.includes('unique')) return imgUnique;

  return BUSINESS_PARTNERS.POWERHOUSE_GYM.logo;
}

export function getBrandFromItemName(itemName: string): string {
  const lower = itemName.toLowerCase();
  if (lower.includes('belle top') || lower.includes('sara') || lower.includes('majo')) {
    return BUSINESS_PARTNERS.UNIQUE.name;
  }
  return BUSINESS_PARTNERS.POWERHOUSE_GYM.name;
}
