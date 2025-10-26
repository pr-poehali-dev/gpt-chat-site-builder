ALTER TABLE websites ADD COLUMN owner_key TEXT;
ALTER TABLE websites ADD COLUMN custom_domain TEXT;
ALTER TABLE websites ADD COLUMN pages JSONB DEFAULT '[]';

CREATE INDEX idx_websites_owner_key ON websites(owner_key);
CREATE INDEX idx_websites_custom_domain ON websites(custom_domain);
