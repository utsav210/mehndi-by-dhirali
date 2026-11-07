import type { Product } from '@/types'

export const INITIAL_PRODUCTS: Product[] = [
  // 1. Mehndi Powder
  {
    id: 'powder-100g',
    name: '100 gm Mehndi Powder',
    slug: '100-gm-mehndi-powder',
    description:
      '100% natural, triple-cloth sifted micro-fine organic Rajasthani Sojat henna powder (100g). Rich dye content (Lawsone 2.8%+) providing rich, deep mahogany stain for professional henna paste preparation and natural hair treatment. Detailed step-by-step instruction card included.',
    specifications: 'Weight: 100g | Origin: Sojat, Rajasthan | Grade: Triple-cloth sifted (Micro-fine) | 100% Organic | Instruction card included',
    category_id: 'cat-mehndi-powder',
    category_name: 'Mehndi Powder',
    category_slug: 'mehndi-powder',
    price_minor: 9900, // ₹99.00
    compare_at_price_minor: 14900, // ₹149.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-POWDER-100',
    weight_grams: 100,
    images: [
      {
        id: 'img-powder-100',
        product_id: 'powder-100g',
        url: '/images/products/100-gm-mehndi-powder.jpg',
        alt_text: '100 gm Organic Mehndi Powder',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },
  {
    id: 'powder-200g',
    name: '200 gm Mehndi Powder',
    slug: '200-gm-mehndi-powder',
    description:
      '100% natural, triple-cloth sifted micro-fine organic Rajasthani Sojat henna powder (200g). High-potency Lawsonia inermis powder ideal for mixing silky, elastic bridal henna paste or full herbal hair conditioning. Detailed step-by-step instruction card included.',
    specifications: 'Weight: 200g | Origin: Sojat, Rajasthan | Grade: Triple-cloth sifted (Micro-fine) | 100% Organic | Instruction card included',
    category_id: 'cat-mehndi-powder',
    category_name: 'Mehndi Powder',
    category_slug: 'mehndi-powder',
    price_minor: 18900, // ₹189.00
    compare_at_price_minor: 27900, // ₹279.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-POWDER-200',
    weight_grams: 200,
    images: [
      {
        id: 'img-powder-200',
        product_id: 'powder-200g',
        url: '/images/products/200-gm-mehndi-powder.jpg',
        alt_text: '200 gm Organic Mehndi Powder',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },
  {
    id: 'powder-anti-leak-50g',
    name: '50 gram Anti leakage powder',
    slug: '50-gram-anti-leakage-powder',
    description:
      'Specialized 50g organic anti-leakage formula powder. Mix with your henna paste to improve consistency, eliminate smudging, and prevent tip seepage for razor-sharp lines. Detailed step-by-step instruction card included.',
    specifications: 'Weight: 50g | Purpose: Anti-leakage paste stabilizer | 100% Herbal & Organic | Instruction card included',
    category_id: 'cat-mehndi-powder',
    category_name: 'Mehndi Powder',
    category_slug: 'mehndi-powder',
    price_minor: 4900, // ₹49.00
    compare_at_price_minor: 7900, // ₹79.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-POWDER-ANTI-LEAK',
    weight_grams: 50,
    images: [
      {
        id: 'img-powder-anti-leak',
        product_id: 'powder-anti-leak-50g',
        url: '/images/products/50-gram-anti-leakage-powder.jpg',
        alt_text: '50 gram Anti leakage powder',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-30T00:00:00Z',
    updated_at: '2026-10-30T00:00:00Z',
  },

  // 2. Mehndi Oil
  {
    id: 'oil-100ml',
    name: '100ML Mehndi oil',
    slug: '100ml-mehndi-oil',
    description:
      'Pure 100% natural eucalyptus and terpene essential oil blend (100ml). Specially formulated to enhance Lawsone dye penetration into skin pores for deep, rich mahogany to dark burgundy henna stains. Free from synthetic fragrances and mineral oil. Detailed step-by-step instruction card included.',
    specifications: 'Volume: 100ml | Key Ingredients: Pure Eucalyptus Globulus & Herbal Terpenes | 100% Pure Essential Oil | Instruction card included',
    category_id: 'cat-mehndi-oil',
    category_name: 'Mehndi Oil',
    category_slug: 'mehndi-oil',
    price_minor: 24900, // ₹249.00
    compare_at_price_minor: 34900, // ₹349.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-OIL-100',
    weight_grams: 100,
    images: [
      {
        id: 'img-oil-100',
        product_id: 'oil-100ml',
        url: '/images/products/mehndi-oil.jpg',
        alt_text: '100ML Pure Mehndi Oil',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },

  // 3. Mehndi Cones
  {
    id: 'cone-pack-5',
    name: 'Pack of 5 Mehndi Cones',
    slug: 'pack-of-5-mehndi-cones',
    description:
      'Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 5). Formulated with pure eucalyptus essential oil for a deep, rich mahogany stain. Ultra-smooth 0.38mm tip for intricate bridal and festive designs. Step-by-step instruction & stain care card included.',
    specifications: 'Quantity: 5 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included',
    category_id: 'cat-mehndi-cones',
    category_name: 'Mehndi Cones',
    category_slug: 'mehndi-cones',
    price_minor: 9900, // ₹99.00
    compare_at_price_minor: 14900, // ₹149.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-CONE-05',
    weight_grams: 150,
    images: [
      {
        id: 'img-cone-5',
        product_id: 'cone-pack-5',
        url: '/images/products/pack-of-5-mehndi-cones.jpg',
        alt_text: 'Pack of 5 Mehndi Cones',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },
  {
    id: 'cone-pack-8',
    name: 'Pack of 8 Mehndi Cones',
    slug: 'pack-of-8-mehndi-cones',
    description:
      'Freshly rolled 100% organic Rajasthani Sojat henna cones (pack of 8). Hand-poured in small artisanal batches with natural eucalyptus oil for guaranteed dark stain. Step-by-step instruction & stain care card included.',
    specifications: 'Quantity: 8 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included',
    category_id: 'cat-mehndi-cones',
    category_name: 'Mehndi Cones',
    category_slug: 'mehndi-cones',
    price_minor: 15900, // ₹159.00
    compare_at_price_minor: 22900, // ₹229.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-CONE-08',
    weight_grams: 240,
    images: [
      {
        id: 'img-cone-8',
        product_id: 'cone-pack-8',
        url: '/images/products/pack-of-8-mehndi-cones.jpg',
        alt_text: 'Pack of 8 Mehndi Cones',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },
  {
    id: 'cone-pack-12',
    name: 'Pack of 12 Mehndi Cones',
    slug: 'pack-of-12-mehndi-cones',
    description:
      'Complete 1-dozen pack of freshly rolled organic henna cones. Ideal for family celebrations, Karwa Chauth, Eid, and wedding festivities. Zero chemicals, 100% natural. Step-by-step instruction & stain care card included.',
    specifications: 'Quantity: 12 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included',
    category_id: 'cat-mehndi-cones',
    category_name: 'Mehndi Cones',
    category_slug: 'mehndi-cones',
    price_minor: 23900, // ₹239.00
    compare_at_price_minor: 34900, // ₹349.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-CONE-12',
    weight_grams: 360,
    images: [
      {
        id: 'img-cone-12',
        product_id: 'cone-pack-12',
        url: '/images/products/pack-of-12-mehndi-cones.jpg',
        alt_text: 'Pack of 12 Mehndi Cones',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },
  {
    id: 'cone-pack-16',
    name: 'Pack of 16 Mehndi Cones',
    slug: 'pack-of-16-mehndi-cones',
    description:
      'Value bundle of 16 organic bridal henna cones. Crafted with triple-sifted micro-fine henna powder and pure essential oils for smooth flow and crisp line work. Step-by-step instruction & stain care card included.',
    specifications: 'Quantity: 16 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included',
    category_id: 'cat-mehndi-cones',
    category_name: 'Mehndi Cones',
    category_slug: 'mehndi-cones',
    price_minor: 31900, // ₹319.00
    compare_at_price_minor: 45900, // ₹459.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-CONE-16',
    weight_grams: 480,
    images: [
      {
        id: 'img-cone-16',
        product_id: 'cone-pack-16',
        url: '/images/products/pack-of-16-mehndi-cones.jpg',
        alt_text: 'Pack of 16 Mehndi Cones',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },
  {
    id: 'cone-pack-20',
    name: 'Pack of 20 Mehndi Cones',
    slug: 'pack-of-20-mehndi-cones',
    description:
      'Studio pack of 20 fresh organic henna cones. Perfect for henna artists and large family occasions. Long-lasting, rich burgundy dye release. Step-by-step instruction & stain care card included.',
    specifications: 'Quantity: 20 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included',
    category_id: 'cat-mehndi-cones',
    category_name: 'Mehndi Cones',
    category_slug: 'mehndi-cones',
    price_minor: 39900, // ₹399.00
    compare_at_price_minor: 59900, // ₹599.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-CONE-20',
    weight_grams: 600,
    images: [
      {
        id: 'img-cone-20',
        product_id: 'cone-pack-20',
        url: '/images/products/pack-of-20-mehndi-cones.jpg',
        alt_text: 'Pack of 20 Mehndi Cones',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },
  {
    id: 'cone-pack-50',
    name: 'Pack of 50 Mehndi Cones',
    slug: 'pack-of-50-mehndi-cones',
    description:
      'Bulk artist master pack of 50 freshly rolled organic henna cones. Shipped in insulated packaging to maintain optimal freshness. The ultimate value for professional bridal bookings. Step-by-step instruction & stain care card included.',
    specifications: 'Quantity: 50 Cones | Weight: ~30g each | Tip: 0.38mm | Shelf life: 6 months frozen | Instruction card included',
    category_id: 'cat-mehndi-cones',
    category_name: 'Mehndi Cones',
    category_slug: 'mehndi-cones',
    price_minor: 99900, // ₹999.00
    compare_at_price_minor: 149900, // ₹1,499.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-CONE-50',
    weight_grams: 1500,
    images: [
      {
        id: 'img-cone-50',
        product_id: 'cone-pack-50',
        url: '/images/products/pack-of-50-mehndi-cones.jpg',
        alt_text: 'Pack of 50 Mehndi Cones',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-10-26T00:00:00Z',
    updated_at: '2026-10-26T00:00:00Z',
  },

  // 4. Bridal & Student Kits
  {
    id: 'kit-business-diy',
    name: 'Business DIY Kit',
    slug: 'business-diy-kit',
    description:
      '100 gram mehndi powder ,30 ml oil , 0.38mm Plastic pin  Piping big bag  stocking  Anti leakage powder  Golden cone sheets pre rolled White flower cones Instruction card (notes for mixology) with upto 5 kg measurement.',
    specifications:
      '100g Henna Powder, 30ml Oil, 0.38mm Plastic Pin, Piping Big Bag, Stocking, Anti-leakage Powder, Golden Cone Sheets, Pre-rolled White Flower Cones, Mixology Guide (Up to 5kg)',
    category_id: 'cat-mehndi-kits',
    category_name: 'Bridal & Student Kits',
    category_slug: 'mehndi-kits',
    price_minor: 19900, // ₹199.00
    compare_at_price_minor: 29900, // ₹299.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-KIT-BIZ-DIY',
    weight_grams: 250,
    images: [
      {
        id: 'img-kit-biz-1',
        product_id: 'kit-business-diy',
        url: '/images/products/trial-kit.jpg',
        alt_text: 'Business DIY Kit (100g Powder, 30ml Oil, 0.38mm Pin, Piping Bag, Stocking, Sheets & Cones)',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
  {
    id: 'kit-duo-business-diy',
    name: 'Duo Business DIY Kit + FREE shipping',
    slug: 'duo-business-diy-kit',
    description:
      '200 gram mehndi powder, 100 ml oil, 0.38mm Plastic pin, Piping big bag, stocking, Anti leakage powder - 50gram , Golden cone sheets - 20 piece , pre rolled White flower cones, Instruction card (notes for mixology) with upto 5 kg measurement.',
    specifications:
      '200g Henna Powder, 100ml Oil, 0.38mm Plastic Pin, Piping Big Bag, Stocking, 50g Anti-leakage Powder, 20x Golden Cone Sheets, Pre-rolled White Flower Cones, Mixology Guide (Up to 5kg) | FREE shipping',
    category_id: 'cat-mehndi-kits',
    category_name: 'Bridal & Student Kits',
    category_slug: 'mehndi-kits',
    price_minor: 39900, // ₹399.00
    compare_at_price_minor: 59900, // ₹599.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-KIT-DUO-BIZ',
    weight_grams: 500,
    images: [
      {
        id: 'img-kit-duo-1',
        product_id: 'kit-duo-business-diy',
        url: '/images/products/mehndi-artist-kit.jpg',
        alt_text: 'Duo Business DIY Kit + FREE shipping (200g Powder, 100ml Oil, Pin, Piping Bag, 50g Anti-leak, Sheets, Cones)',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
  {
    id: 'kit-bridal-diy',
    name: 'Bridal DIY kit + FREE shipping',
    slug: 'bridal-diy-kit',
    description:
      '200 gram mehndi powder, 100ml dark stain oil, 0.38mm - 2 pin, Piping bag - small 2,Transperant 20 micron sheet- 20 piece, Pre rolled cones - 2, stocking - 1, Instruction card (or bridal mehndi paste making).',
    specifications:
      '200g Henna Powder, 100ml Dark Stain Oil, 2x 0.38mm Pins, 2x Small Piping Bags, 20x Transparent 20 Micron Sheets, 2x Pre-rolled Cones, 1x Stocking, Bridal Paste Guide | FREE shipping',
    category_id: 'cat-mehndi-kits',
    category_name: 'Bridal & Student Kits',
    category_slug: 'mehndi-kits',
    price_minor: 44900, // ₹449.00
    compare_at_price_minor: 64900, // ₹649.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-KIT-BRIDAL-DIY',
    weight_grams: 550,
    images: [
      {
        id: 'img-kit-bridal-1',
        product_id: 'kit-bridal-diy',
        url: '/images/products/mehndi-artist-kit.jpg',
        alt_text: 'Bridal DIY kit + FREE shipping (200g Powder, 100ml Oil, 2 Pins, 2 Bags, 20 Sheets, 2 Cones, Stocking)',
        sort_order: 1,
        is_primary: true,
      },
    ],
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },

  // 5. Accessories
  {
    id: 'acc-pink-bowl',
    name: 'Pink Bowl',
    slug: 'pink-bowl',
    description:
      'Ergonomic, lightweight durable pink mixing bowl specially designed for smooth, lump-free henna paste preparation and easy stirring. Stain-resistant, non-reactive food-grade plastic safe for essential oils and lemon-sugar mixes.',
    specifications:
      'Material: BPA-free Non-reactive Polypropylene | Diameter: ~15cm | Color: Vibrant Pink | Safe for: Henna paste mixing & aftercare prep',
    category_id: 'cat-accessories',
    category_name: 'Accessories',
    category_slug: 'accessories',
    price_minor: 4900, // ₹49.00
    compare_at_price_minor: 7900, // ₹79.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-ACC-BOWL',
    weight_grams: 60,
    images: [
      {
        id: 'img-pink-bowl-1',
        product_id: 'acc-pink-bowl',
        url: '/images/products/pink-bowl-1.jpg',
        alt_text: 'Pink Bowl - Side View',
        sort_order: 1,
        is_primary: true,
      },
      {
        id: 'img-pink-bowl-2',
        product_id: 'acc-pink-bowl',
        url: '/images/products/pink-bowl-2.jpg',
        alt_text: 'Pink Bowl - Top View Inside',
        sort_order: 2,
        is_primary: false,
      },
    ],
    created_at: '2026-11-03T00:00:00Z',
    updated_at: '2026-11-03T00:00:00Z',
  },
  {
    id: 'acc-clip-piping-bag',
    name: 'Clip for Piping Bag',
    slug: 'clip-for-piping-bag',
    description:
      'Pack of heavy-duty sealing clips for henna piping bags and carrot bags. Tight snap-lock clamp ensures an airtight seal, preventing paste from drying out, leaking, or pushing backwards while rolling and filling henna cones.',
    specifications:
      'Quantity: Pack of 6 Clamping Clips | Material: High-durability food-grade polymer | Colors: Multi-color assortment | Use: Airtight seal for henna carrot & piping bags',
    category_id: 'cat-accessories',
    category_name: 'Accessories',
    category_slug: 'accessories',
    price_minor: 4900, // ₹49.00
    compare_at_price_minor: 6900, // ₹69.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-ACC-CLIP',
    weight_grams: 40,
    images: [
      {
        id: 'img-clip-piping-bag-1',
        product_id: 'acc-clip-piping-bag',
        url: '/images/products/clip-for-piping-bag-1.jpg',
        alt_text: 'Clip for Piping Bag - Pack of 6',
        sort_order: 1,
        is_primary: true,
      },
      {
        id: 'img-clip-piping-bag-2',
        product_id: 'acc-clip-piping-bag',
        url: '/images/products/clip-for-piping-bag-2.jpg',
        alt_text: 'Clip for Piping Bag - In Hand',
        sort_order: 2,
        is_primary: false,
      },
    ],
    created_at: '2026-11-03T00:00:00Z',
    updated_at: '2026-11-03T00:00:00Z',
  },
  {
    id: 'acc-038-pin',
    name: '0.38 mm pin (pack of 5 pin)',
    slug: '0-38-mm-pin-pack-of-5',
    description:
      '0.38 mm pin (pack of 5 pin) for henna cone clogging prevention and tip sealing. Essential precision tool for smooth henna paste flow.',
    specifications: '0.38 mm tip caliber, pack of 5 durable plastic sealing pins',
    category_id: 'cat-accessories',
    category_name: 'Accessories',
    category_slug: 'accessories',
    price_minor: 3500, // ₹35.00
    compare_at_price_minor: 5000, // ₹50.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-ACC-PIN-038',
    weight_grams: 20,
    images: [
      {
        id: 'img-038-pin-1',
        product_id: 'acc-038-pin',
        url: '/images/products/0-38-mm-pin.jpg',
        alt_text: '0.38 mm pin (pack of 5 pin)',
        sort_order: 1,
        is_primary: true,
      },
      {
        id: 'img-038-pin-2',
        product_id: 'acc-038-pin',
        url: '/images/products/0-38-mm-pin-1.jpg',
        alt_text: '0.38 mm pin (pack of 5 pin) detail view',
        sort_order: 2,
        is_primary: false,
      },
    ],
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
  {
    id: 'acc-stocking-set',
    name: 'Stocking (Set of 2)',
    slug: 'stocking-set-of-2',
    description:
      'High-grade fine mesh stocking strainers for silky-smooth, lump-free henna paste filtration. Set of 2 durable nylon stockings.',
    specifications: 'Ultra-fine nylon mesh, stretchable elastic fit, Set of 2 strainers',
    category_id: 'cat-accessories',
    category_name: 'Accessories',
    category_slug: 'accessories',
    price_minor: 2500, // ₹25.00
    compare_at_price_minor: 4000, // ₹40.00
    stock_quantity: 100,
    is_active: true,
    is_featured: true,
    sku: 'MBD-ACC-STOCKING-2',
    weight_grams: 30,
    images: [
      {
        id: 'img-stocking-1',
        product_id: 'acc-stocking-set',
        url: '/images/products/stocking-set-of-2.jpg',
        alt_text: 'Stocking (Set of 2)',
        sort_order: 1,
        is_primary: true,
      },
      {
        id: 'img-stocking-2',
        product_id: 'acc-stocking-set',
        url: '/images/products/stocking-set-of-2-1.jpg',
        alt_text: 'Stocking (Set of 2) detail view',
        sort_order: 2,
        is_primary: false,
      },
    ],
    created_at: '2026-11-07T00:00:00Z',
    updated_at: '2026-11-07T00:00:00Z',
  },
]
