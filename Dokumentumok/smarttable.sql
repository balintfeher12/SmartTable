-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: localhost:8889
-- Létrehozás ideje: 2026. Feb 09. 12:04
-- Kiszolgáló verziója: 8.0.40
-- PHP verzió: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `smarttable`
--

DELIMITER $$
--
-- Eljárások
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `insertVendeg` (IN `nev` VARCHAR(100), IN `email` VARCHAR(100), IN `jelszo` VARCHAR(255), IN `telefon` VARCHAR(20))  DETERMINISTIC INSERT INTO vendeg(nev, email, jelszo, telefon)
VALUES (nev, email, jelszo, telefon)$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admin`
--

CREATE TABLE `admin` (
  `admin_id` int NOT NULL,
  `felhasznalonev` varchar(50) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `admin`
--

INSERT INTO `admin` (`admin_id`, `felhasznalonev`, `jelszo`, `email`) VALUES
(2, 'admin', '$2y$10$TvgLDnnow8IEtk6qVFhAguoagdND9Y3N153BvZvbRsex.5RBho3VO', 'admin@gmail.com');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `asztal`
--

CREATE TABLE `asztal` (
  `asztal_id` int NOT NULL,
  `asztal_szam` int NOT NULL,
  `ferohely` int NOT NULL DEFAULT '2',
  `hely` varchar(100) DEFAULT 'belt\0e9r',
  `statusz` enum('szabad','foglalt','karbantartas') NOT NULL DEFAULT 'szabad'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `asztal`
--

INSERT INTO `asztal` (`asztal_id`, `asztal_szam`, `ferohely`, `hely`, `statusz`) VALUES
(1, 1, 2, 'belt\0e9r', 'szabad'),
(2, 2, 2, 'belt\0e9r', 'szabad'),
(3, 12, 5, 'belt�e9r', 'szabad'),
(4, 4, 4, 'belt\0e9r', 'szabad'),
(5, 5, 6, 'belt\0e9r', 'szabad'),
(6, 6, 6, 'belt\0e9r', 'szabad'),
(7, 7, 8, 'belt\0e9r', 'szabad'),
(8, 3, 4, 'belt\0e9r', 'szabad');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `bejelentkezes_naplo`
--

CREATE TABLE `bejelentkezes_naplo` (
  `naplo_id` int NOT NULL,
  `vendeg_id` int DEFAULT NULL,
  `bejelentkezes_ideje` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `bejelentkezes_naplo`
--

INSERT INTO `bejelentkezes_naplo` (`naplo_id`, `vendeg_id`, `bejelentkezes_ideje`) VALUES
(1, 3, '2026-01-13 11:00:37'),
(2, 4, '2026-01-13 20:31:52'),
(3, 4, '2026-01-13 20:50:16'),
(4, 4, '2026-01-14 09:36:54'),
(5, 4, '2026-01-14 09:37:32'),
(6, 4, '2026-01-14 17:51:01'),
(7, 4, '2026-01-18 19:42:25'),
(8, 6, '2026-01-18 19:43:27'),
(9, 6, '2026-01-18 19:43:36'),
(10, 4, '2026-01-18 19:47:50'),
(11, 4, '2026-01-19 10:05:19'),
(12, 4, '2026-01-19 11:23:01'),
(13, 4, '2026-01-19 11:24:54'),
(14, 4, '2026-01-19 11:27:45'),
(15, 4, '2026-01-19 11:40:23'),
(16, 4, '2026-01-20 09:10:34'),
(17, 4, '2026-01-20 12:31:13'),
(18, 4, '2026-01-20 12:41:26'),
(19, 4, '2026-01-20 12:44:36'),
(20, 5, '2026-01-20 12:46:21'),
(21, 4, '2026-01-20 12:48:47'),
(22, 4, '2026-01-20 12:49:41'),
(23, 4, '2026-01-20 12:51:34'),
(24, 4, '2026-01-20 13:07:05'),
(25, 4, '2026-01-20 13:13:20'),
(26, 4, '2026-01-20 13:21:09'),
(27, 4, '2026-01-26 12:06:15'),
(28, 6, '2026-01-26 12:06:48'),
(29, 6, '2026-01-26 12:07:12'),
(30, 4, '2026-01-26 12:09:25'),
(31, 4, '2026-01-26 12:10:23'),
(32, 4, '2026-01-26 12:10:39'),
(33, 4, '2026-01-26 12:11:58'),
(34, 4, '2026-01-26 12:21:06'),
(35, 4, '2026-01-26 12:21:45'),
(36, 4, '2026-01-26 12:24:09'),
(37, 4, '2026-01-26 12:33:43'),
(38, 4, '2026-01-26 12:34:18'),
(39, 4, '2026-01-26 12:34:18'),
(40, 4, '2026-01-26 12:34:18'),
(41, 4, '2026-01-26 12:34:19'),
(42, 4, '2026-01-26 12:35:33'),
(43, 4, '2026-01-26 12:35:34'),
(44, 4, '2026-01-26 12:35:34'),
(45, 4, '2026-01-26 12:35:34'),
(46, 4, '2026-01-26 12:35:34'),
(47, 4, '2026-01-26 12:35:38'),
(48, 4, '2026-01-26 12:35:38'),
(49, 4, '2026-01-26 12:35:38'),
(50, 4, '2026-01-26 12:35:38'),
(51, 4, '2026-01-26 12:35:38'),
(52, 4, '2026-01-26 12:35:42'),
(53, 4, '2026-01-26 12:35:42'),
(54, 4, '2026-01-26 12:35:42'),
(55, 4, '2026-01-26 12:36:40'),
(56, 4, '2026-01-26 12:37:52'),
(57, 5, '2026-01-26 13:24:49'),
(58, 4, '2026-01-26 13:31:21'),
(59, 3, '2026-01-27 09:49:39'),
(60, 2, '2026-01-27 09:51:15'),
(61, 3, '2026-01-27 10:55:09'),
(62, 5, '2026-01-27 13:08:08'),
(63, 4, '2026-01-27 13:23:19'),
(64, 6, '2026-01-28 10:04:19'),
(65, 4, '2026-01-30 09:12:41'),
(66, 4, '2026-01-30 09:31:08'),
(67, 4, '2026-02-03 09:23:51'),
(68, 4, '2026-02-09 12:59:00');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `foglalas`
--

CREATE TABLE `foglalas` (
  `foglalas_id` int NOT NULL,
  `vendeg_id` int DEFAULT NULL,
  `asztal_id` int DEFAULT NULL,
  `datum` date NOT NULL,
  `idopont` time NOT NULL,
  `letszam` int NOT NULL,
  `statusz` enum('aktiv','lemondva','befejezve') NOT NULL DEFAULT 'aktiv',
  `foglalas_ideje` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `foglalas`
--

INSERT INTO `foglalas` (`foglalas_id`, `vendeg_id`, `asztal_id`, `datum`, `idopont`, `letszam`, `statusz`, `foglalas_ideje`) VALUES
(17, 4, 2, '2026-01-12', '10:20:00', 2, 'aktiv', '2026-01-27 13:02:34'),
(18, 5, 4, '2028-02-12', '13:00:00', 4, 'aktiv', '2026-01-27 13:08:26'),
(19, 4, 1, '2026-01-12', '10:20:00', 2, 'aktiv', '2026-01-27 13:38:58'),
(20, 6, 5, '2027-01-02', '12:30:00', 5, 'aktiv', '2026-01-28 10:04:36'),
(21, 4, 2, '2027-01-02', '12:30:00', 3, 'aktiv', '2026-02-03 09:24:52');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `vendeg`
--

CREATE TABLE `vendeg` (
  `vendeg_id` int NOT NULL,
  `nev` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `jelszo` varchar(255) NOT NULL,
  `telefon` varchar(20) DEFAULT NULL,
  `regisztracio_datum` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- A tábla adatainak kiíratása `vendeg`
--

INSERT INTO `vendeg` (`vendeg_id`, `nev`, `email`, `jelszo`, `telefon`, `regisztracio_datum`) VALUES
(2, 'Teszt Bela', 'tesztbela@gmail.com', '$2y$10$TRP4fT6MCT67wzRfns8LX.l1KomUwlAlkDUXDkUvLMrQXGyOShHjG', NULL, '2026-01-13 10:32:51'),
(3, 'Teszt User', 'tesztuser@gmail.com', '$2y$10$Wwq33SP.XOdaAsoIba6.VOr9k4AWlBcy1EzbK6fdMWQk/elx7JcXa', NULL, '2026-01-13 10:54:59'),
(4, 'Fehér Bálint', 'balintfeher607@gmail.com', '$2y$10$YMMQhu97WYCx2LBdlhKHdO.KOroFM.1YciqI7YQ0omrUKbBgP1tlO', '06202452306', '2026-01-13 20:31:34'),
(5, 'Balogh Barna', 'kiskiraly@gmail.com', '$2y$10$pt9iyoqkp5clDlr5ac3R5.sgx4BZHryWQyukwylQNvxkNWtxFFfkW', '1223467', '2026-01-13 20:49:30'),
(6, 'Nagy Bence', 'egyvalaki@gmail.com', '$2y$10$Rd3fod9jWwLu0D0otmNd0eX4rtec9mTbA83c/CmhBfPtGpS.EpJxS', '0630234567', '2026-01-13 20:49:56'),
(7, 'Valaki', 'balint@gmail.com', '$2y$10$FknZ3Z1eI4bBCpXSUNlasOTVq9c8H8QcRYiA4QfHOzzhKcHHEHmaa', NULL, '2026-01-14 09:25:26'),
(10, 'pista', 'pista@gmail.com', '123', '06201343456', '2026-01-20 10:27:57'),
(13, 'Teszt User', 'tesztuserr@gmail.com', '$2y$10$DY18uzDgh8GucJP3j.WndO42/SnRKB12R9b2uZv0XnwmBHm5Wr3em', NULL, '2026-01-27 10:55:52');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD UNIQUE KEY `admin_felhasznalonev_unique` (`felhasznalonev`);

--
-- A tábla indexei `asztal`
--
ALTER TABLE `asztal`
  ADD PRIMARY KEY (`asztal_id`),
  ADD UNIQUE KEY `asztal_asztal_szam_unique` (`asztal_szam`),
  ADD KEY `asztal_statusz_index` (`statusz`);

--
-- A tábla indexei `bejelentkezes_naplo`
--
ALTER TABLE `bejelentkezes_naplo`
  ADD PRIMARY KEY (`naplo_id`),
  ADD KEY `bejelentkezes_naplo_vendeg_id_foreign` (`vendeg_id`);

--
-- A tábla indexei `foglalas`
--
ALTER TABLE `foglalas`
  ADD PRIMARY KEY (`foglalas_id`),
  ADD KEY `foglalas_asztal_id_foreign` (`asztal_id`),
  ADD KEY `foglalas_vendeg_id_foreign` (`vendeg_id`);

--
-- A tábla indexei `vendeg`
--
ALTER TABLE `vendeg`
  ADD PRIMARY KEY (`vendeg_id`),
  ADD UNIQUE KEY `vendeg_email_unique` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admin`
--
ALTER TABLE `admin`
  MODIFY `admin_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `asztal`
--
ALTER TABLE `asztal`
  MODIFY `asztal_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT a táblához `bejelentkezes_naplo`
--
ALTER TABLE `bejelentkezes_naplo`
  MODIFY `naplo_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT a táblához `foglalas`
--
ALTER TABLE `foglalas`
  MODIFY `foglalas_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT a táblához `vendeg`
--
ALTER TABLE `vendeg`
  MODIFY `vendeg_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `bejelentkezes_naplo`
--
ALTER TABLE `bejelentkezes_naplo`
  ADD CONSTRAINT `bejelentkezes_naplo_vendeg_id_foreign` FOREIGN KEY (`vendeg_id`) REFERENCES `vendeg` (`vendeg_id`);

--
-- Megkötések a táblához `foglalas`
--
ALTER TABLE `foglalas`
  ADD CONSTRAINT `foglalas_asztal_id_foreign` FOREIGN KEY (`asztal_id`) REFERENCES `asztal` (`asztal_id`),
  ADD CONSTRAINT `foglalas_vendeg_id_foreign` FOREIGN KEY (`vendeg_id`) REFERENCES `vendeg` (`vendeg_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
