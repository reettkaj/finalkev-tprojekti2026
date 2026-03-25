-- Poistetaan tietokanta, jos se on jo olemassa (estää virheet uudelleenajossa)
DROP DATABASE IF EXISTS Tietokanta;

-- Luodaan uusi tietokanta
CREATE DATABASE Tietokanta;

-- Valitaan juuri luotu tietokanta käyttöön
USE Tietokanta;


-- Taulu käyttäjille (potilaat, lääkärit, ylläpitäjät)
CREATE TABLE Kayttajat (
    user_id INT AUTO_INCREMENT PRIMARY KEY,      -- Yksilöllinen tunniste käyttäjälle
    role ENUM('potilas', 'laakari', 'yllapitaja'), -- Käyttäjän rooli järjestelmässä
    email VARCHAR(100) NOT NULL UNIQUE,          -- Sähköposti (uniikki)
    password VARCHAR(255) NOT NULL,              -- Salasana (tulisi tallentaa hashattuna)
    name VARCHAR(100),                           -- Käyttäjän nimi
    age INT                                      -- Käyttäjän ikä
);

-- Taulu hengitysharjoituksille, joita käyttäjät tekevät
CREATE TABLE Hengitysharjoitukset (
    harjoitus_id INT AUTO_INCREMENT PRIMARY KEY, -- Yksilöllinen tunniste harjoitukselle
    user_id INT,                                 -- Viittaus käyttäjään, joka teki harjoituksen
    harjoitus VARCHAR(100) NOT NULL,             -- Harjoituksen nimi tai kuvaus
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- Aikaleima milloin harjoitus luotiin
    FOREIGN KEY (user_id) REFERENCES Kayttajat(user_id) -- Viite käyttäjätauluun
);

-- Taulu HRV-mittauksille (sykevälivaihtelu)
CREATE TABLE HRV_mittaukset (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- Yksilöllinen tunniste mittaukselle
    user_id INT NOT NULL,                        -- Viittaus käyttäjään, jolta mittaus on
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Mittauksen aikaleima
    rmssd FLOAT,                                 -- RMSSD-arvo (HRV:n mittari)
    hf_hrv FLOAT,                                -- High Frequency HRV
    pns_index FLOAT,                             -- Parasympaattisen hermoston indeksi
    sns_index FLOAT,                             -- Sympaattisen hermoston indeksi
    FOREIGN KEY (user_id) REFERENCES Kayttajat(user_id) -- Viite käyttäjätauluun
);


-- Taulu kyselyvastauksille (itsearviointi)
CREATE TABLE Kyselyt (
    kysely_id INT AUTO_INCREMENT PRIMARY KEY,    -- Yksilöllinen tunniste kyselylle
    user_id INT NOT NULL,                        -- Viittaus käyttäjään
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Vastausaika
    stressi INT,                                 -- Stressitaso
    energia INT,                                 -- Energiataso
    unenlaatu INT,                               -- Unen laatu
    mieliala INT,                                -- Mieliala
    vapaamuotoinen_vastaus VARCHAR(255),         -- Avoin tekstivastaus
    mittaus_id INT,                              -- Viittaus HRV-mittaukseen (jos liittyy siihen)
    FOREIGN KEY (user_id) REFERENCES Kayttajat(user_id),
    FOREIGN KEY (mittaus_id) REFERENCES HRV_mittaukset(id)
);


-- Taulu seulontakyselyille (esim. PTSD tai muut mittarit)
CREATE TABLE Seulontakysely (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- Yksilöllinen tunniste
    user_id INT NOT NULL,                        -- Viittaus käyttäjään
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Aikaleima
    tsq INT,                                     -- Trauma Screening Questionnaire -pisteet
    dsm5 INT,                                    -- DSM-5 mukaiset pisteet
    FOREIGN KEY (user_id) REFERENCES Kayttajat(user_id)
);


-- Taulu ammattilaisten ja potilaiden välisille suhteille
CREATE TABLE Ammattilainen_potilas (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- Yksilöllinen tunniste
    ammattilainen_id INT NOT NULL,               -- Viittaus lääkäriin/ammattilaiseen
    potilas_id INT NOT NULL,                     -- Viittaus potilaaseen
    FOREIGN KEY (ammattilainen_id) REFERENCES Kayttajat(user_id),
    FOREIGN KEY (potilas_id) REFERENCES Kayttajat(user_id)
);


-- =========================
-- TESTIDATA
-- =========================

-- Lisätään esimerkkikäyttäjä (potilas)
INSERT INTO Kayttajat (role, email, password)
VALUES ('potilas', 'test@test.com', '123');

-- Lisätään esimerkkimittaus käyttäjälle (user_id = 1)
INSERT INTO HRV_mittaukset (user_id, rmssd, hf_hrv)
VALUES (1, 45.2, 120.5);