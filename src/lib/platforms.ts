import type { L10n } from "@/i18n/config";
import type { Currency } from "./pricing";

export type Platform = {
  key: string;
  name: string;
  /** Chinese / native name shown as a secondary label */
  native?: string;
  url: string;
  domains: string[];
  currency: Currency;
  kind: "wholesale" | "retail" | "b2b";
  color: string;
  description: L10n;
  bestFor: L10n;
  tip: L10n;
};

export const platforms: Platform[] = [
  {
    key: "1688", name: "1688", native: "阿里巴巴1688", url: "https://www.1688.com", domains: ["1688.com"], currency: "CNY", kind: "wholesale", color: "#FF6A00",
    description: { fr: "Le marché de gros intérieur chinois. Les prix les plus bas, directement usine.", en: "China's domestic wholesale market. Lowest prices, straight from factories.", ar: "سوق الجملة الداخلي في الصين. أدنى الأسعار مباشرة من المصانع." },
    bestFor: { fr: "Pièces OEM chinoises, petites séries", en: "Chinese OEM parts, small batches", ar: "قطع أصلية صينية، كميات صغيرة" },
    tip: { fr: "Interface en chinois — collez simplement le lien ici, on s'occupe du reste.", en: "Chinese-only interface — just paste the link here, we handle the rest.", ar: "الواجهة بالصينية فقط — الصق الرابط هنا ونتكفل بالباقي." },
  },
  {
    key: "taobao", name: "Taobao", native: "淘宝", url: "https://www.taobao.com", domains: ["taobao.com", "tb.cn"], currency: "CNY", kind: "retail", color: "#FF5000",
    description: { fr: "Des millions de vendeurs, idéal pour les pièces d'origine difficiles à trouver.", en: "Millions of sellers — ideal for hard-to-find genuine parts.", ar: "ملايين البائعين — مثالي للقطع الأصلية النادرة." },
    bestFor: { fr: "Pièces introuvables, pièce à l'unité", en: "Rare parts, single units", ar: "قطع نادرة، قطعة واحدة" },
    tip: { fr: "Cherchez avec la référence OEM : c'est plus fiable que le nom.", en: "Search with the OEM reference — more reliable than the name.", ar: "ابحث برقم القطعة الأصلي فهو أدق من الاسم." },
  },
  {
    key: "tmall", name: "Tmall", native: "天猫", url: "https://www.tmall.com", domains: ["tmall.com"], currency: "CNY", kind: "retail", color: "#E4002B",
    description: { fr: "Boutiques officielles de marques et distributeurs agréés.", en: "Official brand stores and authorised distributors.", ar: "متاجر رسمية للعلامات وموزعون معتمدون." },
    bestFor: { fr: "Pièces de marque garanties", en: "Guaranteed branded parts", ar: "قطع أصلية مضمونة" },
    tip: { fr: "Un peu plus cher, mais authenticité quasi certaine.", en: "A bit pricier, but authenticity is near-certain.", ar: "أغلى قليلاً لكن الأصالة شبه مؤكدة." },
  },
  {
    key: "alibaba", name: "Alibaba", url: "https://www.alibaba.com", domains: ["alibaba.com"], currency: "USD", kind: "b2b", color: "#FF7A00",
    description: { fr: "Plateforme B2B internationale en anglais, fabricants vérifiés.", en: "International B2B platform in English, verified manufacturers.", ar: "منصة B2B دولية بالإنجليزية مع مصنعين موثقين." },
    bestFor: { fr: "Commandes en volume, garages et revendeurs", en: "Volume orders, garages and resellers", ar: "طلبات بالجملة، ورشات وتجار" },
    tip: { fr: "Vérifiez le badge « Verified Supplier » et le MOQ.", en: "Check the “Verified Supplier” badge and the MOQ.", ar: "تحقق من شارة المورد الموثق والحد الأدنى للطلب." },
  },
  {
    key: "aliexpress", name: "AliExpress", url: "https://www.aliexpress.com", domains: ["aliexpress.com", "aliexpress.us", "a.aliexpress.com"], currency: "USD", kind: "retail", color: "#E62E04",
    description: { fr: "Achat à l'unité, accessoires et consommables.", en: "Single-unit buying, accessories and consumables.", ar: "شراء بالقطعة، إكسسوارات ومستهلكات." },
    bestFor: { fr: "Accessoires, éclairage, multimédia", en: "Accessories, lighting, multimedia", ar: "إكسسوارات، إنارة، وسائط" },
    tip: { fr: "Les prix affichés varient selon le pays : on recalcule au prix Chine.", en: "Prices vary by country — we recalculate at China price.", ar: "الأسعار تختلف حسب البلد — نعيد الحساب بسعر الصين." },
  },
  {
    key: "made-in-china", name: "Made-in-China", url: "https://www.made-in-china.com", domains: ["made-in-china.com"], currency: "USD", kind: "b2b", color: "#C8102E",
    description: { fr: "Annuaire de fabricants industriels, fort sur les pièces lourdes.", en: "Industrial manufacturer directory, strong on heavy parts.", ar: "دليل المصنعين الصناعيين، قوي في القطع الثقيلة." },
    bestFor: { fr: "Turbos, boîtes, pièces poids lourds", en: "Turbos, gearboxes, heavy-duty parts", ar: "توربو، علب سرعة، قطع ثقيلة" },
    tip: { fr: "Demandez toujours photos réelles et fiche technique.", en: "Always ask for real photos and a spec sheet.", ar: "اطلب دائماً صوراً حقيقية وورقة المواصفات." },
  },
  {
    key: "dhgate", name: "DHgate", url: "https://www.dhgate.com", domains: ["dhgate.com"], currency: "USD", kind: "retail", color: "#F5A623",
    description: { fr: "Petit gros et unité, bon rapport qualité/prix.", en: "Small wholesale and single units, good value.", ar: "جملة صغيرة وبالقطعة، قيمة جيدة." },
    bestFor: { fr: "Suspension, transmission, outillage", en: "Suspension, drivetrain, tools", ar: "تعليق، نقل حركة، أدوات" },
    tip: { fr: "Privilégiez les vendeurs avec plus de 95 % d'avis positifs.", en: "Prefer sellers with 95%+ positive feedback.", ar: "فضّل البائعين بتقييم إيجابي فوق 95٪." },
  },
  {
    key: "jd", name: "JD.com", native: "京东", url: "https://www.jd.com", domains: ["jd.com", "3.cn"], currency: "CNY", kind: "retail", color: "#E1251B",
    description: { fr: "Distribution officielle avec logistique propre, stock réel.", en: "Official retail with its own logistics, real stock.", ar: "بيع رسمي بلوجستيك خاص، مخزون حقيقي." },
    bestFor: { fr: "Huiles, batteries, pièces d'entretien", en: "Oils, batteries, service parts", ar: "زيوت، بطاريات، قطع صيانة" },
    tip: { fr: "Les produits « 自营 » sont vendus par JD directement.", en: "“自营” items are sold by JD itself.", ar: "المنتجات «自营» تبيعها JD مباشرة." },
  },
];

export const platformByKey = Object.fromEntries(platforms.map((p) => [p.key, p])) as Record<string, Platform>;

export function detectPlatform(rawUrl: string): Platform | undefined {
  try {
    const host = new URL(rawUrl.trim()).hostname.toLowerCase();
    return platforms.find((p) => p.domains.some((d) => host === d || host.endsWith(`.${d}`)));
  } catch {
    return undefined;
  }
}
