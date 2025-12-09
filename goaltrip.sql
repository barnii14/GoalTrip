-- ========================
-- FELHASZNÁLÓK ÉS JOGOSULTSÁGOK
-- ========================

CREATE TABLE jogosultsagok (
    jogosultsag_id INT AUTO_INCREMENT PRIMARY KEY,
    jogosultsag_nev VARCHAR(50) NOT NULL
);

CREATE TABLE felhasznalok (
    felhasznalo_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    jelszo VARCHAR(255) NOT NULL,
    telefonszam VARCHAR(20),
    cim VARCHAR(255),
    regisztracio_datuma DATETIME DEFAULT CURRENT_TIMESTAMP,
    jogosultsag_id INT,
    FOREIGN KEY (jogosultsag_id) REFERENCES jogosultsagok(jogosultsag_id)
);

-- ========================
-- WEBSHOP (FOCI MEZEK)
-- ========================

CREATE TABLE kategoria (
    kategoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(50) NOT NULL
);

CREATE TABLE termekek (
    termek_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL,
    kategoria_id INT,
    leiras TEXT,
    ar DECIMAL(10,2),
    kep_url VARCHAR(255),
    FOREIGN KEY (kategoria_id) REFERENCES kategoria(kategoria_id)
);

CREATE TABLE meretek (
    meret_id INT AUTO_INCREMENT PRIMARY KEY,
    meret_nev VARCHAR(10) NOT NULL
);

CREATE TABLE raktar (
    raktar_id INT AUTO_INCREMENT PRIMARY KEY,
    termek_id INT,
    meret_id INT,
    mennyiseg INT DEFAULT 0,
    FOREIGN KEY (termek_id) REFERENCES termekek(termek_id),
    FOREIGN KEY (meret_id) REFERENCES meretek(meret_id)
);

CREATE TABLE rendelesek (
    rendeles_id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id INT,
    datum DATETIME DEFAULT CURRENT_TIMESTAMP,
    allapot VARCHAR(50),
    osszeg DECIMAL(10,2),
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(felhasznalo_id)
);

CREATE TABLE rendeles_tetelek (
    rendeles_tetel_id INT AUTO_INCREMENT PRIMARY KEY,
    rendeles_id INT,
    termek_id INT,
    meret_id INT,
    darabszam INT DEFAULT 1,
    ar DECIMAL(10,2),
    FOREIGN KEY (rendeles_id) REFERENCES rendelesek(rendeles_id),
    FOREIGN KEY (termek_id) REFERENCES termekek(termek_id),
    FOREIGN KEY (meret_id) REFERENCES meretek(meret_id)
);

CREATE TABLE fizetes (
    fizetes_id INT AUTO_INCREMENT PRIMARY KEY,
    rendeles_id INT,
    fizetes_modja VARCHAR(50),
    fizetes_allapot VARCHAR(50),
    fizetes_datuma DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (rendeles_id) REFERENCES rendelesek(rendeles_id)
);

-- ========================
-- UTAZÁSOK ÉS MECCSEK
-- ========================

CREATE TABLE csapatok (
    csapat_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL,
    orszag VARCHAR(50)
);

CREATE TABLE stadionok (
    stadion_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100) NOT NULL,
    varos VARCHAR(50),
    orszag VARCHAR(50),
    kapacitas INT
);

CREATE TABLE meccsek (
    meccs_id INT AUTO_INCREMENT PRIMARY KEY,
    hazai_csapat_id INT,
    vendeg_csapat_id INT,
    stadion_id INT,
    datum DATE,
    kezdesi_ido TIME,
    jegyar DECIMAL(10,2),
    FOREIGN KEY (hazai_csapat_id) REFERENCES csapatok(csapat_id),
    FOREIGN KEY (vendeg_csapat_id) REFERENCES csapatok(csapat_id),
    FOREIGN KEY (stadion_id) REFERENCES stadionok(stadion_id)
);

CREATE TABLE utazasok (
    utazas_id INT AUTO_INCREMENT PRIMARY KEY,
    meccs_id INT,
    indulas_varos VARCHAR(50),
    indulas_idopont DATETIME,
    erkezes_varos VARCHAR(50),
    erkezes_idopont DATETIME,
    ar DECIMAL(10,2),
    FOREIGN KEY (meccs_id) REFERENCES meccsek(meccs_id)
);

CREATE TABLE szallasok (
    szallas_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(100),
    varos VARCHAR(50),
    cim VARCHAR(255),
    kategoria VARCHAR(50),
    ar_egy_ejszaka DECIMAL(10,2)
);

CREATE TABLE foglalasok (
    foglalas_id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id INT,
    utazas_id INT,
    szallas_id INT,
    szallas_kezdo_datuma DATE,
    szallas_vege_datuma DATE,
    darabszam INT DEFAULT 1,
    fizetve BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(felhasznalo_id),
    FOREIGN KEY (utazas_id) REFERENCES utazasok(utazas_id),
    FOREIGN KEY (szallas_id) REFERENCES szallasok(szallas_id)
);

CREATE TABLE utazas_tetelek (
    utazas_tetel_id INT AUTO_INCREMENT PRIMARY KEY,
    utazas_id INT,
    tipus VARCHAR(50),
    ar DECIMAL(10,2),
    FOREIGN KEY (utazas_id) REFERENCES utazasok(utazas_id)
);

-- ========================
-- SAJÁT MEZ KÉSZÍTÉS
-- ========================

CREATE TABLE mez_tipusok (
    mez_tipus_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(50)
);

CREATE TABLE szinek (
    szin_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(50),
    hex_kod VARCHAR(7)
);

CREATE TABLE mintak (
    minta_id INT AUTO_INCREMENT PRIMARY KEY,
    nev VARCHAR(50),
    kep_url VARCHAR(255)
);

CREATE TABLE sajat_mezek (
    sajat_mez_id INT AUTO_INCREMENT PRIMARY KEY,
    felhasznalo_id INT,
    mez_tipus_id INT,
    alap_ar DECIMAL(10,2),
    datum_megrendeles DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (felhasznalo_id) REFERENCES felhasznalok(felhasznalo_id),
    FOREIGN KEY (mez_tipus_id) REFERENCES mez_tipusok(mez_tipus_id)
);

CREATE TABLE sajat_mez_tetelek (
    sajat_mez_tetel_id INT AUTO_INCREMENT PRIMARY KEY,
    sajat_mez_id INT,
    szin_id INT,
    minta_id INT,
    felirat VARCHAR(50),
    szam VARCHAR(5),
    darabszam INT DEFAULT 1,
    FOREIGN KEY (sajat_mez_id) REFERENCES sajat_mezek(sajat_mez_id),
    FOREIGN KEY (szin_id) REFERENCES szinek(szin_id),
    FOREIGN KEY (minta_id) REFERENCES mintak(minta_id)
);
