CREATE TABLE IF NOT EXISTS members (
  id serial PRIMARY KEY,
  company_name text NOT NULL,
  website text,
  logo_url text,
  description text NOT NULL DEFAULT '',
  contact_person text,
  contact_email text,
  status text NOT NULL DEFAULT 'pending',
  source text NOT NULL DEFAULT 'application',
  joined_at timestamptz,
  consent_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT members_status_check CHECK (status IN ('pending', 'approved', 'rejected'))
);

CREATE UNIQUE INDEX IF NOT EXISTS members_company_name_lower_unique
  ON members (lower(company_name));
