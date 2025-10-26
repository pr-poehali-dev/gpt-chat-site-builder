CREATE TABLE websites (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    html_content TEXT NOT NULL,
    css_content TEXT NOT NULL,
    js_content TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published BOOLEAN DEFAULT true
);

CREATE INDEX idx_websites_slug ON websites(slug);
CREATE INDEX idx_websites_created_at ON websites(created_at DESC);
