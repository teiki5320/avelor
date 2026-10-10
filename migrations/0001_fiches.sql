-- Fiches Solelis (base Cloudflare D1, données stockées dans l'UE).
-- Les champs JSON (reponses, company_data, rappels) sont stockés en texte.
CREATE TABLE IF NOT EXISTS fiches (
  token        TEXT PRIMARY KEY,
  siret        TEXT NOT NULL,
  reponses     TEXT NOT NULL,
  company_data TEXT NOT NULL,
  email        TEXT,
  rappels      TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE INDEX IF NOT EXISTS fiches_rappels ON fiches (token) WHERE rappels IS NOT NULL;
