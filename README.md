# World Auto — Global Mobility Solution

Plateforme d'import de pièces auto Chine → Algérie (FR / AR / EN).

## Démarrer

```bash
npm install
cp .env.example .env.local   # taux de change, commission, WhatsApp
npm run dev                  # http://localhost:3000 → redirige vers /fr
```

## Pages

| Route | Rôle |
|---|---|
| `/[locale]` | Accueil : collage de lien, recherche véhicule, pièces rares, studio, marques, plateformes, simulateur de prix, FAQ |
| `/[locale]/quote?url=` | Devis par lien : détection plateforme, lecture auto (best-effort) sinon saisie du prix, calcul final |
| `/[locale]/platforms` | Guide des plateformes chinoises (1688, Taobao, Tmall, Alibaba, AliExpress, Made-in-China, DHgate, JD) |
| `/[locale]/vehicles` → `/[brand]` → `/[model]` | Recherche par marque / modèle, pièces compatibles par catégorie |
| `/[locale]/studio?brand=&model=` | Studio 3D (three.js) : clic sur les zones de la voiture, emplacements type "config PC" |
| `/[locale]/products` · `/products/[id]` | Catalogue filtrable + fiche produit |
| `/[locale]/cart` | Panier (localStorage) → commande envoyée sur WhatsApp + `POST /api/orders` |

## Où modifier quoi

- **Prix** : `src/lib/pricing.ts` — `final = prix × taux × (1 + commission%)`
- **Catalogue / marques / modèles** : `src/lib/catalog.ts` (données mock, à brancher sur Supabase/Prisma)
- **Plateformes** : `src/lib/platforms.ts`
- **Textes** : `src/i18n/dictionaries/{fr,ar,en}.ts`
- **Contact / WhatsApp / wilayas** : `src/lib/site.ts`
- **Voiture 3D** : `src/components/studio/carGeometry.ts` (profils par carrosserie : SUV, berline, citadine, pick-up)

## À faire avant production

- `/api/quote` : les sites chinois bloquent souvent les robots → brancher une API d'agent de sourcing (1688/Taobao) pour lire prix et titre de façon fiable.
- `/api/orders` : enregistrer les commandes en base + back-office.
- Catalogue : les 36 produits correspondent à de vraies annonces AliExpress (photo, OEM, compatibilité) — champ `listing` dans `catalog.ts`. Lien fournisseur : `listingUrl()` dans `src/lib/product-images.ts`. Les notes et nombres de ventes sont encore fictifs.

Stack : Next.js 16 (App Router), TypeScript, Tailwind v4, React Three Fiber, Zustand.
