-- Poistetaan tietokanta, jos se on jo olemassa (estää virheet uudelleenajossa)
DROP DATABASE IF EXISTS Tietokanta;

-- Luodaan uusi tietokanta
CREATE DATABASE Tietokanta;

-- Valitaan juuri luotu tietokanta käyttöön
USE Tietokanta;

-- ROLES
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

-- Taulu käyttäjille
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255),
    name VARCHAR(100),
    auth_provider ENUM('local', 'kubios') NOT NULL,
    role_id INT NOT NULL,
    isNew BOOLEAN NOT NULL DEFAULT TRUE,
    doctor_id INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_users_role
    FOREIGN KEY (role_id) REFERENCES Roles(role_id),

    CONSTRAINT fk_users_doctor
    FOREIGN KEY (doctor_id) REFERENCES Users(user_id)
    ON DELETE SET NULL
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
    FOREIGN KEY (user_id) REFERENCES Users(user_id) -- Viite käyttäjätauluun
    ON DELETE CASCADE
);

CREATE TABLE kubios_results (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  date DATE,
  readiness FLOAT,
  stress_index FLOAT
);


-- Taulu kyselyvastauksille (itsearviointi)
CREATE TABLE Kyselyt (
    kysely_id INT AUTO_INCREMENT PRIMARY KEY,    -- Yksilöllinen tunniste kyselylle
    user_id INT NOT NULL,                        -- Viittaus käyttäjään
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Vastausaika
    mood VARCHAR (50),                               -- mieliala
    weight INT,                                 -- paino
    sleep INT,                                  -- uni
    energy INT,                                 -- energia
    water FLOAT,                                -- vesi
    stress INT,                                 -- Stressitaso
    exercise VARCHAR (100),                           -- harjoitus
    meal VARCHAR (100),                               -- ruoka
    symptoms VARCHAR (255),                           -- oireet
    medication VARCHAR (255),                         -- lääkkeet
    notes TEXT,                                 -- Avoin tekstivastaus
    mittaus_id INT,                              -- Viittaus HRV-mittaukseen (jos liittyy siihen)
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (mittaus_id) REFERENCES HRV_mittaukset(id)
    ON DELETE SET NULL
);


-- Taulu seulontakyselyille (esim. PTSD tai muut mittarit)
CREATE TABLE TraumaScreeningQuestionnaire (
    id INT AUTO_INCREMENT PRIMARY KEY,           -- Yksilöllinen tunniste
    user_id INT NOT NULL,                        -- Viittaus käyttäjään
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, -- Aikaleima
    points INT,                                     -- Trauma Screening Questionnaire -pisteet
    q1 BOOLEAN,                                 -- TSQ kysymykset 0=ei 1=kyllä
    q2 BOOLEAN,
    q3 BOOLEAN,
    q4 BOOLEAN,
    q5 BOOLEAN,
    q6 BOOLEAN,
    q7 BOOLEAN,
    q8 BOOLEAN,
    q9 BOOLEAN,
    q10 BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
    ON DELETE CASCADE
);

INSERT INTO Roles (name)
VALUES 
  ('ylläpitäjä'),
  ('ammattilainen'),
  ('potilas');

  -- Ylläpitäjä
INSERT INTO Users (email, password, name, auth_provider, role_id, isNew)
VALUES 
('admin@testi.fi', '$2b$10$/BTSzCvPEXl3M73cFwfBfuP5trd/vRmXqVBE7uecnfDnxIhZffWIq', 'Admin Käyttäjä', 'local', 1, FALSE);

-- Ammattilainen (lääkäri)
INSERT INTO Users (email, password, name, auth_provider, role_id, isNew)
VALUES 
('laakari@testi.fi', '$2b$10$/BTSzCvPEXl3M73cFwfBfuP5trd/vRmXqVBE7uecnfDnxIhZffWIq', 'Tohtori Testi', 'local', 2, FALSE);

-- =========================
-- TESTIDATA
-- =========================
-- Potilaat (viittaus doctor_id = 2)
INSERT INTO Users (email, password, name, auth_provider, role_id, doctor_id)
VALUES 
('potilas1@testi.fi', 'hashed_password_3', 'Matti Meikäläinen', 'local', 3, 2),
('potilas2@testi.fi', 'hashed_password_4', 'Maija Meikäläinen', 'kubios', 3, 2);

