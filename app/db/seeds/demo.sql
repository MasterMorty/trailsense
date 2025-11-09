-- Demo dataset for local development.
-- Run with: npx wrangler d1 execute DB --file=db/seeds/demo.sql --local

INSERT OR IGNORE INTO locations (id, name, address) VALUES
    (1, 'Tourism Technology Hackathon 2025', 'Salzburg Arena, Messezentrum 1, 5020 Salzburg'),
    (2, 'Startpunkt Höttinger Alm', 'Hungerburgbahn Parkplatz, Höhenstraße 145, 6020 Innsbruck, Tirol'),
    (3, 'Einstieg Gaistalrunde', 'Parkplatz Salzbach, 6105 Leutasch, Tirol'),
    (4, 'Talstation Finkau', 'Alpengasthof Finkau, Gerlostal Landesstraße, 5742 Gerlos, Tirol');

INSERT OR IGNORE INTO trails (id, name, location_id, path_data) VALUES
    (1, 'Arena Innovationsrunde (Loop)', 1, NULL),
    (2, 'Höttinger Alm Panorama-Runde', 2, NULL),
    (3, 'Gaistal Almenweg zur Tillfussalm', 3, NULL),
    (4, 'Zittauer Hütte Zustieg ab Finkau', 4, NULL);

INSERT OR REPLACE INTO nodes (id, location_id, status) VALUES
    (127, 1, 'healthy');
