-- Demo dataset for local development.
-- Run with: npx wrangler d1 execute DB --file=db/seeds/demo.sql --local

INSERT OR IGNORE INTO trails (id, name, path_data) VALUES
    (1, 'Arena Innovationsrunde (Loop)', NULL),
    (2, 'Höttinger Alm Panorama-Runde', NULL),
    (3, 'Gaistal Almenweg zur Tillfussalm', NULL),
    (4, 'Zittauer Hütte Zustieg ab Finkau', NULL);

INSERT OR REPLACE INTO nodes (id, trail_id, status) VALUES
    (127, 1, 'healthy');
