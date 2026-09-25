import { productById } from "./catalog";

/**
 * Product photos come straight from each product's supplier listing
 * (AliExpress CDN, see `listing` in catalog.ts). The CDN serves resized
 * variants via a `_{size}x{size}` suffix.
 */
const CDN = "https://ae-pic-a1.aliexpress-media.com/kf/";
const SIZES = [220, 350, 480, 640, 960];

export function productImage(productId: string, width = 640) {
  const file = productById[productId]?.listing?.image;
  if (!file) return undefined;
  const size = SIZES.find((s) => s >= width) ?? SIZES[SIZES.length - 1];
  const ext = file.split(".").pop();
  return `${CDN}${file}_${size}x${size}.${ext}`;
}

export function listingUrl(productId: string) {
  const id = productById[productId]?.listing?.id;
  return id ? `https://www.aliexpress.com/item/${id}.html` : undefined;
}
