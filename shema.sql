-- producers
CREATE TABLE IF NOT EXISTS producers (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- optional: collections (przykład rozszerzenia)
CREATE TABLE IF NOT EXISTS collections (
  id SERIAL PRIMARY KEY,
  producer_id INT NOT NULL REFERENCES producers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  meta JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_collections_producer ON collections(producer_id);

-- MODULES / ELEMENTS (np. „Szafka dolna 60”, „Narożnik Prawy”)
CREATE TABLE modules (
  id SERIAL PRIMARY KEY,
  collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT, -- jeśli producenci mają własne kody
  category TEXT, -- np. „szafki dolne”, „fronty”, „narożniki”
  width NUMERIC,
  height NUMERIC,
  depth NUMERIC,
  extra_attributes JSONB DEFAULT '{}', -- pełna elastyczność na dziwactwa PDF
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_collection ON modules(collection_id);
CREATE INDEX idx_modules_category ON modules(category);

-- VARIANTS (wspólne dla całej kolekcji!)
CREATE TABLE module_variants (
  id SERIAL PRIMARY KEY,
  collection_id INT NOT NULL REFERENCES collections(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  attributes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_variants_collection ON module_variants(collection_id);


-- PRICES (pełna elastyczność: ceny za wariant, rozmiar, grupę tkaniny itd.)
CREATE TABLE prices (
  id SERIAL PRIMARY KEY,
  variant_id INT NOT NULL REFERENCES module_variants(id) ON DELETE CASCADE,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'PLN',
  valid_from DATE,
  valid_to DATE,
  price_type TEXT DEFAULT 'standard', -- np. "promo", "dealer", "retail"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_prices_variant ON prices(variant_id);
CREATE INDEX idx_prices_valid ON prices(valid_from, valid_to);
