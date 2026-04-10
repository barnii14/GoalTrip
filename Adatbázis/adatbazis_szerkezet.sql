-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Ápr 10. 15:34
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `goaltrip`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `csapatok`
--

CREATE TABLE `csapatok` (
  `csapat_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `orszag` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `felhasznalok`
--

CREATE TABLE `felhasznalok` (
  `felhasznalo_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefonszam` varchar(20) DEFAULT NULL,
  `cim` varchar(255) DEFAULT NULL,
  `regisztracio_datuma` datetime DEFAULT current_timestamp(),
  `jogosultsag_id` int(11) NOT NULL DEFAULT 2
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `fizetes`
--

CREATE TABLE `fizetes` (
  `fizetes_id` int(11) NOT NULL,
  `rendeles_id` int(11) NOT NULL,
  `fizetes_modja` varchar(50) NOT NULL,
  `fizetes_allapot` varchar(50) NOT NULL DEFAULT 'pending',
  `fizetes_datuma` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalasok`
--

CREATE TABLE `foglalasok` (
  `foglalas_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `utazas_id` int(11) NOT NULL,
  `szallas_id` int(11) NOT NULL,
  `szallas_kezdo_datuma` date NOT NULL,
  `szallas_vege_datuma` date NOT NULL,
  `darabszam` int(11) NOT NULL DEFAULT 1,
  `fizetve` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `jogosultsagok`
--

CREATE TABLE `jogosultsagok` (
  `jogosultsag_id` int(11) NOT NULL,
  `jogosultsag_nev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `kategoria`
--

CREATE TABLE `kategoria` (
  `kategoria_id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meccsek`
--

CREATE TABLE `meccsek` (
  `meccs_id` int(11) NOT NULL,
  `hazai_csapat_id` int(11) NOT NULL,
  `vendeg_csapat_id` int(11) NOT NULL,
  `stadion_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `kezdesi_ido` time NOT NULL,
  `jegyar` decimal(10,2) NOT NULL
) ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `meretek`
--

CREATE TABLE `meretek` (
  `meret_id` int(11) NOT NULL,
  `meret_nev` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `raktar`
--

CREATE TABLE `raktar` (
  `raktar_id` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL,
  `meret_id` int(11) NOT NULL,
  `mennyiseg` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- A nézet helyettes szerkezete `raktar_attekinto`
-- (Lásd alább az aktuális nézetet)
--
CREATE TABLE `raktar_attekinto` (
`raktar_id` int(11)
,`termek_id` int(11)
,`csapatnev` varchar(150)
,`leiras` text
,`meret_nev` varchar(10)
,`mennyiseg` int(11)
,`alap_ar_ft` decimal(10,2)
,`kep_url` varchar(255)
);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendelesek`
--

CREATE TABLE `rendelesek` (
  `rendeles_id` int(11) NOT NULL,
  `felhasznalo_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `cim` varchar(255) NOT NULL,
  `szallitas_mod` varchar(50) NOT NULL,
  `fizetes_mod` varchar(50) NOT NULL,
  `datum` datetime NOT NULL DEFAULT current_timestamp(),
  `allapot` varchar(50) NOT NULL DEFAULT 'feldolgozas',
  `osszeg` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `rendeles_tetelek`
--

CREATE TABLE `rendeles_tetelek` (
  `rendeles_tetel_id` int(11) NOT NULL,
  `rendeles_id` int(11) NOT NULL,
  `termek_id` int(11) NOT NULL,
  `meret_id` int(11) NOT NULL,
  `darabszam` int(11) NOT NULL DEFAULT 1,
  `ar` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `stadionok`
--

CREATE TABLE `stadionok` (
  `stadion_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `varos` varchar(50) DEFAULT NULL,
  `orszag` varchar(50) DEFAULT NULL,
  `kapacitas` int(11) DEFAULT NULL,
  `csapat_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `szallasok`
--

CREATE TABLE `szallasok` (
  `szallas_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `varos` varchar(50) DEFAULT NULL,
  `cim` varchar(255) DEFAULT NULL,
  `kategoria` varchar(50) DEFAULT NULL,
  `ar_egy_ejszaka` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `termek_id` int(11) NOT NULL,
  `csapatnev` varchar(150) NOT NULL,
  `kategoria_id` int(11) NOT NULL,
  `leiras` text DEFAULT NULL,
  `alap_ar_ft` decimal(10,2) NOT NULL,
  `kep_url` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `utazasok`
--

CREATE TABLE `utazasok` (
  `utazas_id` int(11) NOT NULL,
  `meccs_id` int(11) NOT NULL,
  `indulas_varos` varchar(50) NOT NULL,
  `indulas_idopont` datetime NOT NULL,
  `erkezes_varos` varchar(50) NOT NULL,
  `erkezes_idopont` datetime NOT NULL,
  `ar` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Nézet szerkezete `raktar_attekinto`
--
DROP TABLE IF EXISTS `raktar_attekinto`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `raktar_attekinto`  AS SELECT `r`.`raktar_id` AS `raktar_id`, `r`.`termek_id` AS `termek_id`, `t`.`csapatnev` AS `csapatnev`, `t`.`leiras` AS `leiras`, `m`.`meret_nev` AS `meret_nev`, `r`.`mennyiseg` AS `mennyiseg`, `t`.`alap_ar_ft` AS `alap_ar_ft`, `t`.`kep_url` AS `kep_url` FROM ((`raktar` `r` join `termekek` `t` on(`r`.`termek_id` = `t`.`termek_id`)) join `meretek` `m` on(`r`.`meret_id` = `m`.`meret_id`)) ;

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `csapatok`
--
ALTER TABLE `csapatok`
  ADD PRIMARY KEY (`csapat_id`),
  ADD UNIQUE KEY `uq_csapatok_nev_orszag` (`nev`,`orszag`);

--
-- A tábla indexei `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD PRIMARY KEY (`felhasznalo_id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `fk_felhasznalok_jogosultsag` (`jogosultsag_id`);

--
-- A tábla indexei `fizetes`
--
ALTER TABLE `fizetes`
  ADD PRIMARY KEY (`fizetes_id`),
  ADD KEY `fk_fizetes_rendeles` (`rendeles_id`);

--
-- A tábla indexei `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD PRIMARY KEY (`foglalas_id`),
  ADD KEY `fk_foglalasok_felhasznalo` (`felhasznalo_id`),
  ADD KEY `fk_foglalasok_utazas` (`utazas_id`),
  ADD KEY `fk_foglalasok_szallas` (`szallas_id`);

--
-- A tábla indexei `jogosultsagok`
--
ALTER TABLE `jogosultsagok`
  ADD PRIMARY KEY (`jogosultsag_id`),
  ADD UNIQUE KEY `jogosultsag_nev` (`jogosultsag_nev`);

--
-- A tábla indexei `kategoria`
--
ALTER TABLE `kategoria`
  ADD PRIMARY KEY (`kategoria_id`),
  ADD UNIQUE KEY `nev` (`nev`);

--
-- A tábla indexei `meccsek`
--
ALTER TABLE `meccsek`
  ADD PRIMARY KEY (`meccs_id`),
  ADD KEY `fk_meccsek_hazai_csapat` (`hazai_csapat_id`),
  ADD KEY `fk_meccsek_vendeg_csapat` (`vendeg_csapat_id`),
  ADD KEY `fk_meccsek_stadion` (`stadion_id`);

--
-- A tábla indexei `meretek`
--
ALTER TABLE `meretek`
  ADD PRIMARY KEY (`meret_id`),
  ADD UNIQUE KEY `meret_nev` (`meret_nev`);

--
-- A tábla indexei `raktar`
--
ALTER TABLE `raktar`
  ADD PRIMARY KEY (`raktar_id`),
  ADD UNIQUE KEY `uq_raktar_termek_meret` (`termek_id`,`meret_id`),
  ADD KEY `fk_raktar_meret` (`meret_id`);

--
-- A tábla indexei `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD PRIMARY KEY (`rendeles_id`),
  ADD KEY `fk_rendelesek_felhasznalo` (`felhasznalo_id`);

--
-- A tábla indexei `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD PRIMARY KEY (`rendeles_tetel_id`),
  ADD KEY `fk_rendeles_tetelek_rendeles` (`rendeles_id`),
  ADD KEY `fk_rendeles_tetelek_termek` (`termek_id`),
  ADD KEY `fk_rendeles_tetelek_meret` (`meret_id`);

--
-- A tábla indexei `stadionok`
--
ALTER TABLE `stadionok`
  ADD PRIMARY KEY (`stadion_id`),
  ADD UNIQUE KEY `uq_stadionok_nev_varos` (`nev`,`varos`),
  ADD KEY `fk_stadionok_csapat` (`csapat_id`);

--
-- A tábla indexei `szallasok`
--
ALTER TABLE `szallasok`
  ADD PRIMARY KEY (`szallas_id`);

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`termek_id`),
  ADD KEY `idx_termekek_kategoria` (`kategoria_id`);

--
-- A tábla indexei `utazasok`
--
ALTER TABLE `utazasok`
  ADD PRIMARY KEY (`utazas_id`),
  ADD KEY `fk_utazasok_meccs` (`meccs_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `csapatok`
--
ALTER TABLE `csapatok`
  MODIFY `csapat_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  MODIFY `felhasznalo_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `fizetes`
--
ALTER TABLE `fizetes`
  MODIFY `fizetes_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  MODIFY `foglalas_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `jogosultsagok`
--
ALTER TABLE `jogosultsagok`
  MODIFY `jogosultsag_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `kategoria`
--
ALTER TABLE `kategoria`
  MODIFY `kategoria_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `meccsek`
--
ALTER TABLE `meccsek`
  MODIFY `meccs_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `meretek`
--
ALTER TABLE `meretek`
  MODIFY `meret_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `raktar`
--
ALTER TABLE `raktar`
  MODIFY `raktar_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  MODIFY `rendeles_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  MODIFY `rendeles_tetel_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `stadionok`
--
ALTER TABLE `stadionok`
  MODIFY `stadion_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `szallasok`
--
ALTER TABLE `szallasok`
  MODIFY `szallas_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `termek_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `utazasok`
--
ALTER TABLE `utazasok`
  MODIFY `utazas_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `felhasznalok`
--
ALTER TABLE `felhasznalok`
  ADD CONSTRAINT `fk_felhasznalok_jogosultsag` FOREIGN KEY (`jogosultsag_id`) REFERENCES `jogosultsagok` (`jogosultsag_id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `fizetes`
--
ALTER TABLE `fizetes`
  ADD CONSTRAINT `fk_fizetes_rendeles` FOREIGN KEY (`rendeles_id`) REFERENCES `rendelesek` (`rendeles_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `foglalasok`
--
ALTER TABLE `foglalasok`
  ADD CONSTRAINT `fk_foglalasok_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_foglalasok_szallas` FOREIGN KEY (`szallas_id`) REFERENCES `szallasok` (`szallas_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_foglalasok_utazas` FOREIGN KEY (`utazas_id`) REFERENCES `utazasok` (`utazas_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `meccsek`
--
ALTER TABLE `meccsek`
  ADD CONSTRAINT `fk_meccsek_hazai_csapat` FOREIGN KEY (`hazai_csapat_id`) REFERENCES `csapatok` (`csapat_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_meccsek_stadion` FOREIGN KEY (`stadion_id`) REFERENCES `stadionok` (`stadion_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_meccsek_vendeg_csapat` FOREIGN KEY (`vendeg_csapat_id`) REFERENCES `csapatok` (`csapat_id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `raktar`
--
ALTER TABLE `raktar`
  ADD CONSTRAINT `fk_raktar_meret` FOREIGN KEY (`meret_id`) REFERENCES `meretek` (`meret_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_raktar_termek` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`termek_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `rendelesek`
--
ALTER TABLE `rendelesek`
  ADD CONSTRAINT `fk_rendelesek_felhasznalo` FOREIGN KEY (`felhasznalo_id`) REFERENCES `felhasznalok` (`felhasznalo_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Megkötések a táblához `rendeles_tetelek`
--
ALTER TABLE `rendeles_tetelek`
  ADD CONSTRAINT `fk_rendeles_tetelek_meret` FOREIGN KEY (`meret_id`) REFERENCES `meretek` (`meret_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rendeles_tetelek_rendeles` FOREIGN KEY (`rendeles_id`) REFERENCES `rendelesek` (`rendeles_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_rendeles_tetelek_termek` FOREIGN KEY (`termek_id`) REFERENCES `termekek` (`termek_id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `stadionok`
--
ALTER TABLE `stadionok`
  ADD CONSTRAINT `fk_stadionok_csapat` FOREIGN KEY (`csapat_id`) REFERENCES `csapatok` (`csapat_id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Megkötések a táblához `termekek`
--
ALTER TABLE `termekek`
  ADD CONSTRAINT `fk_termekek_kategoria` FOREIGN KEY (`kategoria_id`) REFERENCES `kategoria` (`kategoria_id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `utazasok`
--
ALTER TABLE `utazasok`
  ADD CONSTRAINT `fk_utazasok_meccs` FOREIGN KEY (`meccs_id`) REFERENCES `meccsek` (`meccs_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
