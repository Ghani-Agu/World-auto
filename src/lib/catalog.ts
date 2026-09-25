import type { L10n } from "@/i18n/config";

/* ───────────────────────── Categories ───────────────────────── */

export type CategoryKey =
  | "engine"
  | "brakes"
  | "suspension"
  | "lighting"
  | "body"
  | "filters"
  | "electrical"
  | "cooling"
  | "transmission"
  | "interior";

export type Category = { key: CategoryKey; name: L10n; hint: L10n };

export const categories: Category[] = [
  { key: "engine", name: { fr: "Moteur", en: "Engine", ar: "المحرك" }, hint: { fr: "Culasse, joints, distribution, injecteurs", en: "Head, gaskets, timing, injectors", ar: "رأس المحرك، الحشوات، التوقيت، البخاخات" } },
  { key: "brakes", name: { fr: "Freinage", en: "Brakes", ar: "الفرامل" }, hint: { fr: "Disques, plaquettes, étriers, ABS", en: "Discs, pads, calipers, ABS", ar: "أقراص، وسادات، فكوك، ABS" } },
  { key: "suspension", name: { fr: "Suspension", en: "Suspension", ar: "نظام التعليق" }, hint: { fr: "Amortisseurs, bras, rotules, silentblocs", en: "Shocks, arms, ball joints, bushings", ar: "مساعدات، أذرع، مفاصل، جلب" } },
  { key: "lighting", name: { fr: "Éclairage", en: "Lighting", ar: "الإنارة" }, hint: { fr: "Phares, feux arrière, LED, antibrouillards", en: "Headlights, tail lights, LED, fog lamps", ar: "مصابيح أمامية وخلفية، LED، الضباب" } },
  { key: "body", name: { fr: "Carrosserie", en: "Body", ar: "الهيكل" }, hint: { fr: "Pare-chocs, rétroviseurs, calandres, capots", en: "Bumpers, mirrors, grilles, hoods", ar: "صدامات، مرايا، شبكات، أغطية" } },
  { key: "filters", name: { fr: "Filtration", en: "Filters", ar: "الفلاتر" }, hint: { fr: "Huile, air, habitacle, carburant", en: "Oil, air, cabin, fuel", ar: "زيت، هواء، مقصورة، وقود" } },
  { key: "electrical", name: { fr: "Électricité", en: "Electrical", ar: "الكهرباء" }, hint: { fr: "Calculateurs, capteurs, alternateurs, démarreurs", en: "ECUs, sensors, alternators, starters", ar: "حواسيب، حساسات، مولدات، مشغلات" } },
  { key: "cooling", name: { fr: "Refroidissement", en: "Cooling", ar: "التبريد" }, hint: { fr: "Radiateurs, pompes à eau, ventilateurs", en: "Radiators, water pumps, fans", ar: "مشعات، مضخات ماء، مراوح" } },
  { key: "transmission", name: { fr: "Transmission", en: "Transmission", ar: "ناقل الحركة" }, hint: { fr: "Embrayage, cardans, boîtes CVT", en: "Clutch, driveshafts, CVT boxes", ar: "القابض، أعمدة الدوران، علب CVT" } },
  { key: "interior", name: { fr: "Intérieur", en: "Interior", ar: "الداخلية" }, hint: { fr: "Écrans, commandes, garnitures", en: "Screens, controls, trims", ar: "شاشات، أزرار تحكم، تكسيات" } },
];

export const categoryByKey = Object.fromEntries(categories.map((c) => [c.key, c])) as Record<CategoryKey, Category>;

/* ───────────────────────── Vehicles ───────────────────────── */

export type Model = { key: string; name: string; years: string; body: "suv" | "sedan" | "hatch" | "pickup" };
export type Brand = { key: string; name: string; origin: "CN" | "EU" | "KR" | "JP"; models: Model[] };

export const brands: Brand[] = [
  { key: "chery", name: "Chery", origin: "CN", models: [
    { key: "tiggo-2-pro", name: "Tiggo 2 Pro", years: "2021–2025", body: "suv" },
    { key: "tiggo-4-pro", name: "Tiggo 4 Pro", years: "2022–2025", body: "suv" },
    { key: "tiggo-7-pro", name: "Tiggo 7 Pro", years: "2021–2025", body: "suv" },
    { key: "arrizo-5", name: "Arrizo 5", years: "2019–2024", body: "sedan" },
  ] },
  { key: "geely", name: "Geely", origin: "CN", models: [
    { key: "coolray", name: "Coolray", years: "2020–2025", body: "suv" },
    { key: "emgrand", name: "Emgrand", years: "2021–2025", body: "sedan" },
    { key: "tugella", name: "Tugella", years: "2021–2025", body: "suv" },
  ] },
  { key: "jac", name: "JAC", origin: "CN", models: [
    { key: "j7", name: "J7", years: "2021–2025", body: "sedan" },
    { key: "js4", name: "JS4", years: "2021–2025", body: "suv" },
    { key: "t8", name: "T8", years: "2019–2025", body: "pickup" },
  ] },
  { key: "baic", name: "BAIC", origin: "CN", models: [
    { key: "x35", name: "X35", years: "2019–2024", body: "suv" },
    { key: "x55", name: "X55", years: "2022–2025", body: "suv" },
    { key: "bj40", name: "BJ40", years: "2020–2025", body: "suv" },
  ] },
  { key: "haval", name: "Haval", origin: "CN", models: [
    { key: "jolion", name: "Jolion", years: "2021–2025", body: "suv" },
    { key: "h6", name: "H6", years: "2021–2025", body: "suv" },
  ] },
  { key: "great-wall", name: "Great Wall", origin: "CN", models: [
    { key: "wingle-7", name: "Wingle 7", years: "2018–2024", body: "pickup" },
    { key: "poer", name: "Poer", years: "2020–2025", body: "pickup" },
  ] },
  { key: "dfsk", name: "DFSK", origin: "CN", models: [
    { key: "glory-580", name: "Glory 580", years: "2018–2024", body: "suv" },
    { key: "k01", name: "K01", years: "2016–2024", body: "pickup" },
  ] },
  { key: "changan", name: "Changan", origin: "CN", models: [
    { key: "cs35-plus", name: "CS35 Plus", years: "2019–2025", body: "suv" },
    { key: "alsvin", name: "Alsvin", years: "2019–2025", body: "sedan" },
    { key: "cs55", name: "CS55 Plus", years: "2021–2025", body: "suv" },
  ] },
  { key: "mg", name: "MG", origin: "CN", models: [
    { key: "zs", name: "ZS", years: "2018–2025", body: "suv" },
    { key: "mg5", name: "MG5", years: "2020–2025", body: "sedan" },
  ] },
  { key: "byd", name: "BYD", origin: "CN", models: [
    { key: "atto-3", name: "Atto 3", years: "2022–2025", body: "suv" },
    { key: "seal", name: "Seal", years: "2023–2025", body: "sedan" },
  ] },
  { key: "jetour", name: "Jetour", origin: "CN", models: [
    { key: "x70", name: "X70", years: "2020–2025", body: "suv" },
    { key: "dashing", name: "Dashing", years: "2022–2025", body: "suv" },
  ] },
  { key: "renault", name: "Renault", origin: "EU", models: [
    { key: "clio-4", name: "Clio 4", years: "2012–2019", body: "hatch" },
    { key: "symbol", name: "Symbol", years: "2013–2021", body: "sedan" },
    { key: "megane-3", name: "Mégane 3", years: "2008–2016", body: "hatch" },
  ] },
  { key: "peugeot", name: "Peugeot", origin: "EU", models: [
    { key: "208", name: "208", years: "2012–2024", body: "hatch" },
    { key: "301", name: "301", years: "2012–2022", body: "sedan" },
    { key: "308", name: "308", years: "2013–2021", body: "hatch" },
  ] },
  { key: "volkswagen", name: "Volkswagen", origin: "EU", models: [
    { key: "golf-7", name: "Golf 7", years: "2012–2020", body: "hatch" },
    { key: "polo", name: "Polo", years: "2010–2022", body: "hatch" },
    { key: "caddy", name: "Caddy", years: "2010–2020", body: "hatch" },
  ] },
  { key: "hyundai", name: "Hyundai", origin: "KR", models: [
    { key: "accent", name: "Accent RB", years: "2011–2019", body: "sedan" },
    { key: "tucson", name: "Tucson", years: "2015–2024", body: "suv" },
    { key: "i10", name: "Grand i10", years: "2014–2022", body: "hatch" },
  ] },
  { key: "kia", name: "Kia", origin: "KR", models: [
    { key: "picanto", name: "Picanto", years: "2011–2024", body: "hatch" },
    { key: "sportage", name: "Sportage", years: "2016–2024", body: "suv" },
    { key: "rio", name: "Rio", years: "2012–2022", body: "sedan" },
  ] },
  { key: "toyota", name: "Toyota", origin: "JP", models: [
    { key: "hilux", name: "Hilux", years: "2015–2025", body: "pickup" },
    { key: "corolla", name: "Corolla", years: "2013–2025", body: "sedan" },
    { key: "yaris", name: "Yaris", years: "2011–2023", body: "hatch" },
  ] },
  { key: "dacia", name: "Dacia", origin: "EU", models: [
    { key: "logan", name: "Logan", years: "2012–2021", body: "sedan" },
    { key: "sandero", name: "Sandero", years: "2012–2022", body: "hatch" },
    { key: "duster", name: "Duster", years: "2010–2024", body: "suv" },
  ] },
];

export const brandByKey = Object.fromEntries(brands.map((b) => [b.key, b])) as Record<string, Brand>;

export function findModel(brandKey: string, modelKey: string) {
  return brandByKey[brandKey]?.models.find((m) => m.key === modelKey);
}

/* ───────────────────────── Products ───────────────────────── */

export type Availability = "stock" | "order" | "rare";

export type Product = {
  id: string;
  name: L10n;
  category: CategoryKey;
  /** Maker of the part (OEM or aftermarket) */
  maker: string;
  ref: string;
  priceCNY: number;
  /** "*" universal · "chery" whole brand · "chery/tiggo-7-pro" a single model */
  fits: string[];
  availability: Availability;
  leadDays: [number, number];
  rating: number;
  sold: number;
  source: string; // platform key
  /** Supplier listing the product is sourced from */
  listing?: { id: string; image: string };
};

/**
 * Each product mirrors a real AliExpress listing (photo, title, compatibility, OEM ref).
 * priceCNY = listing price shown in DZD at AliExpress's official rate (≈18.5 DZD/CNY), converted back to CNY.
 * Refs starting with "AE-" are the AliExpress item number when the seller gives no OEM reference.
 */
export const products: Product[] = [
  { id: "p01", name: { fr: "Kit chaîne de distribution moteur E4T15B", en: "E4T15B engine timing chain kit", ar: "طقم سلسلة توقيت محرك E4T15B" }, category: "engine", maker: "OEM Fit", ref: "E4T15B", priceCNY: 853, fits: ["chery/tiggo-7-pro", "chery/tiggo-4-pro", "jetour"], availability: "rare", leadDays: [18, 25], rating: 4.8, sold: 214, source: "aliexpress", listing: { id: "1005012767107605", image: "S2d53b72f249d4a24b03ecced95eeb3b7p.png" } },
  { id: "p02", name: { fr: "Joint de culasse Chery Tiggo 2 / Arrizo", en: "Cylinder head gasket Chery Tiggo 2 / Arrizo", ar: "حشوة رأس المحرك شيري تيجو 2 / أريزو" }, category: "engine", maker: "OEM Fit", ref: "DR3 / E4G15", priceCNY: 278, fits: ["chery/tiggo-2-pro", "chery/arrizo-5"], availability: "stock", leadDays: [14, 20], rating: 4.6, sold: 530, source: "aliexpress", listing: { id: "4001196409568", image: "S6ce4c744f84b4a4a9e35f0a0f6e0245cD.jpg" } },
  { id: "p03", name: { fr: "Injecteur essence 01657047 Geely 1.0T / 1.5T", en: "Fuel injector 01657047 Geely 1.0T / 1.5T", ar: "بخاخ وقود 01657047 جيلي 1.0T / 1.5T" }, category: "engine", maker: "Geely OEM", ref: "01657047", priceCNY: 262, fits: ["geely/coolray", "geely/emgrand"], availability: "rare", leadDays: [18, 28], rating: 4.9, sold: 96, source: "aliexpress", listing: { id: "1005011764347550", image: "S0441e6a8a1e04adf88dc6462631655e1t.jpg" } },
  { id: "p04", name: { fr: "Turbocompresseur SQRE4T15B Chery 1.5T", en: "Turbocharger SQRE4T15B Chery 1.5T", ar: "شاحن توربيني SQRE4T15B شيري 1.5T" }, category: "engine", maker: "OEM Fit", ref: "SQRE4T15B", priceCNY: 2429, fits: ["chery/tiggo-7-pro", "chery/tiggo-4-pro", "jetour/x70"], availability: "rare", leadDays: [20, 30], rating: 4.7, sold: 41, source: "aliexpress", listing: { id: "1005012731950142", image: "Sc77aa21bfa56424db81f64e993878a76Z.png" } },
  { id: "p05", name: { fr: "Plaquettes de frein avant céramique Chery Tiggo", en: "Front ceramic brake pads Chery Tiggo", ar: "وسادات فرامل أمامية سيراميك شيري تيجو" }, category: "brakes", maker: "BAOFENG", ref: "AE-9900284787", priceCNY: 139, fits: ["chery/tiggo-2-pro", "chery/tiggo-7-pro"], availability: "stock", leadDays: [12, 18], rating: 4.7, sold: 1820, source: "aliexpress", listing: { id: "1005009900284787", image: "S4d1bc769aee04d7b97cf4e943db06529d.png" } },
  { id: "p06", name: { fr: "Disque de frein T15-3501075 Chery", en: "Brake disc T15-3501075 Chery", ar: "قرص فرامل T15-3501075 شيري" }, category: "brakes", maker: "OEM Fit", ref: "T15-3501075", priceCNY: 415, fits: ["chery"], availability: "stock", leadDays: [14, 20], rating: 4.8, sold: 640, source: "aliexpress", listing: { id: "1005013113974007", image: "Se831bc7511314e0eb49dd61046dad441b.jpg" } },
  { id: "p07", name: { fr: "Bloc ABS hydraulique Chery Tiggo T11 / T19", en: "ABS hydraulic unit Chery Tiggo T11 / T19", ar: "وحدة ABS هيدروليكية شيري تيجو T11 / T19" }, category: "brakes", maker: "Chery OEM", ref: "T11 / T19 ABS", priceCNY: 2831, fits: ["chery"], availability: "rare", leadDays: [20, 30], rating: 4.6, sold: 37, source: "aliexpress", listing: { id: "1005010532200218", image: "Sa60511e997d14da8919ffde1bd5467e0X.jpg" } },
  { id: "p08", name: { fr: "Moteur d'étrier de frein arrière JAC J7", en: "Rear brake caliper motor JAC J7", ar: "محرك فك الفرامل الخلفي JAC J7" }, category: "brakes", maker: "OEM Fit", ref: "AE-0211002947", priceCNY: 948, fits: ["jac/j7"], availability: "order", leadDays: [16, 24], rating: 4.5, sold: 122, source: "aliexpress", listing: { id: "1005010211002947", image: "S618d98c86f0a45bd903dfcddcdf85752i.jpg" } },
  { id: "p09", name: { fr: "Amortisseurs avant complets Chery Tiggo 7 / 8 (paire)", en: "Front strut assemblies Chery Tiggo 7 / 8 (pair)", ar: "مساعدات أمامية كاملة شيري تيجو 7 / 8 (زوج)" }, category: "suspension", maker: "OEM Fit", ref: "AE-2305928476", priceCNY: 668, fits: ["chery/tiggo-7-pro"], availability: "stock", leadDays: [14, 21], rating: 4.8, sold: 870, source: "aliexpress", listing: { id: "1005012305928476", image: "S8dc14cf6e29b42659d32ca507c3a01b9H.jpg" } },
  { id: "p10", name: { fr: "Bras de suspension avant inférieur Chery", en: "Front lower control arm Chery", ar: "ذراع التعليق الأمامي السفلي شيري" }, category: "suspension", maker: "OEM Fit", ref: "AE-3059748314", priceCNY: 596, fits: ["chery"], availability: "stock", leadDays: [14, 20], rating: 4.6, sold: 410, source: "aliexpress", listing: { id: "1005013059748314", image: "S1f43f0a85a454ac0892546a292eec006s.jpg" } },
  { id: "p11", name: { fr: "Silentbloc de bras avant Geely Emgrand", en: "Front control arm bushing Geely Emgrand", ar: "جلبة ذراع التعليق الأمامي جيلي إمجراند" }, category: "suspension", maker: "Geely OEM", ref: "1064001265", priceCNY: 77, fits: ["geely/emgrand"], availability: "stock", leadDays: [12, 18], rating: 4.4, sold: 290, source: "aliexpress", listing: { id: "1005009282200340", image: "S44b28614f67e48319ca18ad8600d63d6G.jpg" } },
  { id: "p12", name: { fr: "Phare avant d'origine Geely Coolray SX11", en: "Genuine headlight Geely Coolray SX11", ar: "مصباح أمامي أصلي جيلي كولراي SX11" }, category: "lighting", maker: "Geely OEM", ref: "7051022400", priceCNY: 2380, fits: ["geely/coolray"], availability: "rare", leadDays: [18, 26], rating: 4.9, sold: 58, source: "aliexpress", listing: { id: "1005009325300774", image: "S06f37a05b534498c9726ea56963b083au.jpg" } },
  { id: "p13", name: { fr: "Feux arrière LED Chery Tiggo 7 Pro", en: "LED tail lights Chery Tiggo 7 Pro", ar: "مصابيح خلفية LED شيري تيجو 7 برو" }, category: "lighting", maker: "OEM Fit", ref: "AE-7044358947", priceCNY: 853, fits: ["chery/tiggo-7-pro"], availability: "rare", leadDays: [18, 26], rating: 4.7, sold: 73, source: "aliexpress", listing: { id: "1005007044358947", image: "Scf382cf34ca249d78c02b81f1c3783eeh.jpg" } },
  { id: "p14", name: { fr: "Ampoules LED H7 20000 lm (x2)", en: "H7 LED bulbs 20,000 lm (x2)", ar: "مصابيح H7 LED بقوة 20000 لومن (×2)" }, category: "lighting", maker: "TOAUTO", ref: "H7 20000LM", priceCNY: 174, fits: ["*"], availability: "stock", leadDays: [10, 16], rating: 4.5, sold: 3120, source: "aliexpress", listing: { id: "1005007987775496", image: "Sf2b1eb4fcb114160926e47b857aa0c1dY.jpg" } },
  { id: "p15", name: { fr: "Antibrouillard avant Haval H6 3e génération", en: "Front fog lamp Haval H6 3rd gen", ar: "مصباح ضباب أمامي هافال H6 الجيل الثالث" }, category: "lighting", maker: "Haval OEM", ref: "4116101XKN01A", priceCNY: 426, fits: ["haval/h6"], availability: "order", leadDays: [14, 22], rating: 4.5, sold: 188, source: "aliexpress", listing: { id: "1005009563124193", image: "S95cfd4bc15cf4ac4b2588ad6f43ad178K.jpg" } },
  { id: "p16", name: { fr: "Pare-chocs avant d'origine Chery Tiggo 2 Pro", en: "Genuine front bumper Chery Tiggo 2 Pro", ar: "صدام أمامي أصلي شيري تيجو 2 برو" }, category: "body", maker: "Chery OEM", ref: "602001087AA", priceCNY: 1867, fits: ["chery/tiggo-2-pro"], availability: "order", leadDays: [22, 32], rating: 4.4, sold: 64, source: "aliexpress", listing: { id: "1005012782023865", image: "Sf10a40a6501d43f896c6411b4fb89ab28.jpg" } },
  { id: "p17", name: { fr: "Rétroviseur extérieur complet Chery Tiggo 5", en: "Complete side mirror Chery Tiggo 5", ar: "مرآة جانبية كاملة شيري تيجو 5" }, category: "body", maker: "OEM Fit", ref: "AE-4967494873", priceCNY: 971, fits: ["chery"], availability: "stock", leadDays: [16, 24], rating: 4.6, sold: 205, source: "aliexpress", listing: { id: "1005004967494873", image: "S4b28e3c0d4dd4dd986b98f213b7d60faT.jpg" } },
  { id: "p18", name: { fr: "Calandre sport Haval H6 3e génération", en: "Sport grille Haval H6 3rd gen", ar: "شبكة أمامية رياضية هافال H6 الجيل الثالث" }, category: "body", maker: "OEM Fit", ref: "AE-2185218717", priceCNY: 752, fits: ["haval/h6"], availability: "rare", leadDays: [20, 30], rating: 4.8, sold: 49, source: "aliexpress", listing: { id: "1005012185218717", image: "Safe6663edd964b86beb2befaf270f653s.jpg" } },
  { id: "p19", name: { fr: "Capot moteur acier Great Wall Wingle", en: "Steel engine hood Great Wall Wingle", ar: "غطاء محرك فولاذي جريت وول وينجل" }, category: "body", maker: "OEM Fit", ref: "AE-3012000074", priceCNY: 6056, fits: ["great-wall"], availability: "order", leadDays: [25, 35], rating: 4.3, sold: 22, source: "aliexpress", listing: { id: "1005013012000074", image: "S9cd32d1c6ab84264ad09dcedd3ca2f959.jpg" } },
  { id: "p20", name: { fr: "Kit 3 filtres (air, habitacle, huile) Chery Tiggo 2 Pro", en: "3-filter kit (air, cabin, oil) Chery Tiggo 2 Pro", ar: "طقم 3 فلاتر (هواء، مقصورة، زيت) شيري تيجو 2 برو" }, category: "filters", maker: "OEM Fit", ref: "SQRE4G15C", priceCNY: 244, fits: ["chery/tiggo-2-pro"], availability: "stock", leadDays: [10, 16], rating: 4.8, sold: 2460, source: "aliexpress", listing: { id: "1005006189968999", image: "S2cb7882f490c41b2bf90c01fdee67f55h.jpg" } },
  { id: "p21", name: { fr: "Filtre à huile 480-1012010 Chery (x2)", en: "Oil filter 480-1012010 Chery (x2)", ar: "فلتر زيت 480-1012010 شيري (قطعتان)" }, category: "filters", maker: "Chery OEM", ref: "480-1012010", priceCNY: 210, fits: ["chery", "jetour"], availability: "stock", leadDays: [10, 16], rating: 4.7, sold: 5210, source: "aliexpress", listing: { id: "1005011762691166", image: "S17644fb576b44681ae32adf9e43fc3f4z.jpg" } },
  { id: "p22", name: { fr: "Filtre habitacle charbon actif MANN CUK 22046", en: "MANN CUK 22046 activated-carbon cabin filter", ar: "فلتر مقصورة كربون MANN CUK 22046" }, category: "filters", maker: "Mann-Filter", ref: "CUK 22046", priceCNY: 199, fits: ["geely/coolray"], availability: "stock", leadDays: [10, 16], rating: 4.6, sold: 1980, source: "aliexpress", listing: { id: "1005010668158733", image: "S0ac22b931d3c4dc7b55bcc386e9103a60.jpg" } },
  { id: "p23", name: { fr: "Calculateur moteur (ECU) Chery Arrizo 5", en: "Engine control unit (ECU) Chery Arrizo 5", ar: "حاسوب المحرك (ECU) شيري أريزو 5" }, category: "electrical", maker: "Chery OEM", ref: "AE-33012989703", priceCNY: 954, fits: ["chery/arrizo-5"], availability: "rare", leadDays: [22, 35], rating: 4.7, sold: 31, source: "aliexpress", listing: { id: "33012989703", image: "S9d33c10d61344947bc220a6b737bf8dbx.jpg" } },
  { id: "p24", name: { fr: "Alternateur Chery Tiggo T11 / A5", en: "Alternator Chery Tiggo T11 / A5", ar: "مولد كهربائي شيري تيجو T11 / A5" }, category: "electrical", maker: "OEM Fit", ref: "B11-3701110", priceCNY: 517, fits: ["chery"], availability: "order", leadDays: [16, 24], rating: 4.5, sold: 144, source: "aliexpress", listing: { id: "1005008741882881", image: "S7179d1088768447f87925ac30cb94174G.jpg" } },
  { id: "p25", name: { fr: "Capteur de position vilebrequin S11-1005117 Chery", en: "Crankshaft position sensor S11-1005117 Chery", ar: "حساس وضعية عمود المرفق S11-1005117 شيري" }, category: "electrical", maker: "OEM Fit", ref: "S11-1005117", priceCNY: 200, fits: ["chery"], availability: "stock", leadDays: [12, 18], rating: 4.6, sold: 760, source: "aliexpress", listing: { id: "1005012114331110", image: "Sebf2a8c5d1c8442ead0cbcc76ad854569.jpg" } },
  { id: "p26", name: { fr: "Démarreur COOLFONE Great Wall Poer", en: "COOLFONE starter motor Great Wall Poer", ar: "مشغل محرك COOLFONE جريت وول باور" }, category: "electrical", maker: "COOLFONE", ref: "AE-8746596003", priceCNY: 806, fits: ["great-wall/poer"], availability: "order", leadDays: [16, 24], rating: 4.6, sold: 98, source: "aliexpress", listing: { id: "1005008746596003", image: "S888c9f393fe64a04a6c599d4abc655bfX.jpg" } },
  { id: "p27", name: { fr: "Radiateur moteur T11-1301110BA Chery Tiggo", en: "Engine radiator T11-1301110BA Chery Tiggo", ar: "مشع المحرك T11-1301110BA شيري تيجو" }, category: "cooling", maker: "OEM Fit", ref: "T11-1301110BA", priceCNY: 569, fits: ["chery"], availability: "stock", leadDays: [16, 24], rating: 4.6, sold: 330, source: "aliexpress", listing: { id: "1005009674270823", image: "Sc0c09d132de04ad09ba78862a879fbaeY.jpg" } },
  { id: "p28", name: { fr: "Pompe à eau D4G15B Chery Tiggo 2 / 3X", en: "Water pump D4G15B Chery Tiggo 2 / 3X", ar: "مضخة ماء D4G15B شيري تيجو 2 / 3X" }, category: "cooling", maker: "OEM Fit", ref: "D4G15B-1307010", priceCNY: 318, fits: ["chery/tiggo-2-pro"], availability: "stock", leadDays: [14, 20], rating: 4.7, sold: 520, source: "aliexpress", listing: { id: "1005007942827030", image: "Sd47a410cc09a4b3e88d91b1dbdf4bb19z.jpg" } },
  { id: "p29", name: { fr: "Motoventilateur de radiateur JAC", en: "JAC radiator cooling fan assembly", ar: "مجموعة مروحة تبريد المشع JAC" }, category: "cooling", maker: "COOLFONE", ref: "AE-2710893783", priceCNY: 303, fits: ["jac"], availability: "order", leadDays: [18, 26], rating: 4.5, sold: 67, source: "aliexpress", listing: { id: "1005012710893783", image: "Sbb40d06491ce46268f1d2763b73acddaS.jpg" } },
  { id: "p30", name: { fr: "Compresseur de climatisation Chery Tiggo 7 / 8", en: "A/C compressor Chery Tiggo 7 / 8", ar: "ضاغط مكيف الهواء شيري تيجو 7 / 8" }, category: "cooling", maker: "Eyonder", ref: "AE-6982379523", priceCNY: 708, fits: ["chery/tiggo-7-pro", "chery/tiggo-4-pro"], availability: "order", leadDays: [18, 28], rating: 4.6, sold: 112, source: "aliexpress", listing: { id: "1005006982379523", image: "Se3af80bbd61f43978ce5a5b919f90bffO.jpg" } },
  { id: "p31", name: { fr: "Kit embrayage Chery Tiggo 4 / 7 1.5T", en: "Clutch kit Chery Tiggo 4 / 7 1.5T", ar: "طقم قابض شيري تيجو 4 / 7 1.5T" }, category: "transmission", maker: "OEM Fit", ref: "SQRE4T15B", priceCNY: 629, fits: ["chery/tiggo-7-pro", "chery/tiggo-4-pro"], availability: "stock", leadDays: [14, 22], rating: 4.7, sold: 690, source: "aliexpress", listing: { id: "1005008618857219", image: "Hfdc081bc055142ccabc76852d7810265i.jpg" } },
  { id: "p32", name: { fr: "Corps de valves boîte CVT QR019CHA", en: "CVT valve body QR019CHA", ar: "جسم صمامات علبة CVT QR019CHA" }, category: "transmission", maker: "OEM Fit", ref: "QR019CHA", priceCNY: 1573, fits: ["chery", "jetour"], availability: "rare", leadDays: [25, 35], rating: 4.8, sold: 19, source: "aliexpress", listing: { id: "1005012236256506", image: "S0b6d6c7864754e40adf16644c7de7edbb.jpg" } },
  { id: "p33", name: { fr: "Cardan avant gauche Chery Tiggo 8 1.6T DCT", en: "Front left driveshaft Chery Tiggo 8 1.6T DCT", ar: "عمود نقل أمامي أيسر شيري تيجو 8 1.6T" }, category: "transmission", maker: "JXU", ref: "AE-3047964202", priceCNY: 660, fits: ["chery"], availability: "stock", leadDays: [14, 22], rating: 4.5, sold: 410, source: "aliexpress", listing: { id: "1005013047964202", image: "S5b11dc95ab2243f4b17924e3e4c2835bu.jpg" } },
  { id: "p34", name: { fr: "Autoradio Android 9\"/10\" CarPlay sans fil", en: "9\"/10\" Android radio with wireless CarPlay", ar: "راديو أندرويد 9/10 بوصة مع كاربلاي لاسلكي" }, category: "interior", maker: "VERTRIO", ref: "AE-2056929448", priceCNY: 1183, fits: ["*"], availability: "stock", leadDays: [12, 20], rating: 4.7, sold: 1340, source: "aliexpress", listing: { id: "1005012056929448", image: "S7414ae20d1544b6ba3f15aa63539a99fw.jpg" } },
  { id: "p35", name: { fr: "Bloc commande lève-vitres conducteur Geely", en: "Driver master window switch Geely", ar: "لوحة أزرار النوافذ للسائق جيلي" }, category: "interior", maker: "OEM Fit", ref: "AE-8276417529", priceCNY: 105, fits: ["geely"], availability: "order", leadDays: [16, 24], rating: 4.4, sold: 156, source: "aliexpress", listing: { id: "1005008276417529", image: "Sbb4c7e763af94d16b248891f00b8182fW.jpg" } },
  { id: "p36", name: { fr: "Écran de combiné d'instruments 12,3\" Chery Tiggo 7 / 8 Pro", en: "12.3\" instrument cluster display Chery Tiggo 7 / 8 Pro", ar: "شاشة عدادات 12.3 بوصة شيري تيجو 7 / 8 برو" }, category: "interior", maker: "Chery OEM", ref: "AE-2072131074", priceCNY: 1777, fits: ["chery/tiggo-7-pro"], availability: "rare", leadDays: [22, 32], rating: 4.8, sold: 24, source: "aliexpress", listing: { id: "1005012072131074", image: "Sddd85172ca884c3ca1bb665619e13b1aS.jpg" } },
];

export const productById = Object.fromEntries(products.map((p) => [p.id, p])) as Record<string, Product>;

export function fitsModel(p: Product, brandKey: string, modelKey?: string) {
  return p.fits.some((f) => f === "*" || f === brandKey || (modelKey && f === `${brandKey}/${modelKey}`));
}

export function productsFor(brandKey: string, modelKey?: string, category?: CategoryKey) {
  return products.filter((p) => fitsModel(p, brandKey, modelKey) && (!category || p.category === category));
}

/** Human label for a product's fitment, e.g. "Chery · Geely" or "Universel" */
export function fitsLabel(p: Product, universal: string) {
  if (p.fits.includes("*")) return universal;
  return p.fits
    .map((f) => {
      const [b, m] = f.split("/");
      const brand = brandByKey[b];
      if (!brand) return f;
      return m ? `${brand.name} ${brand.models.find((x) => x.key === m)?.name ?? m}` : brand.name;
    })
    .join(" · ");
}
