ALTER TABLE members ADD COLUMN IF NOT EXISTS membership_type text NOT NULL DEFAULT 'organisation';
ALTER TABLE members ADD COLUMN IF NOT EXISTS affiliation text;

DO $$
BEGIN
  ALTER TABLE members
    ADD CONSTRAINT members_membership_type_check
    CHECK (membership_type IN ('organisation', 'individual'));
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
