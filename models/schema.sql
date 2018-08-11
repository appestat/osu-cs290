-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: classmysql.engr.oregonstate.edu:3306
-- Generation Time: Aug 11, 2018 at 04:33 PM
-- Server version: 10.1.22-MariaDB
-- PHP Version: 7.0.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs290_gayk`
--

-- --------------------------------------------------------

--
-- Table structure for table `boards`
--

CREATE TABLE `boards` (
  `board_id` int(10) NOT NULL,
  `name` varchar(30) DEFAULT NULL,
  `defaultElo` float DEFAULT NULL,
  `defaultRD` float DEFAULT NULL,
  `defaultVol` float DEFAULT NULL,
  `tau` float DEFAULT NULL,
  `games` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `boards`
--

INSERT INTO `boards` (`board_id`, `name`, `defaultElo`, `defaultRD`, `defaultVol`, `tau`, `games`) VALUES
(1, 'Test Board', 1500, 300, 300, 0.2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `games`
--

CREATE TABLE `games` (
  `match_id` int(10) NOT NULL,
  `create_time` datetime DEFAULT NULL,
  `info` varchar(300) DEFAULT NULL,
  `winner` int(10) DEFAULT NULL,
  `loser` int(10) DEFAULT NULL,
  `board` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `games`
--

INSERT INTO `games` (`match_id`, `create_time`, `info`, `winner`, `loser`, `board`) VALUES
(1, '2018-08-10 00:00:00', 'Test game', 1, 2, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(10) NOT NULL,
  `elo` float DEFAULT NULL,
  `RD` float DEFAULT NULL,
  `VOL` float DEFAULT NULL,
  `board` int(10) DEFAULT NULL,
  `user_profile` int(10) DEFAULT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `elo`, `RD`, `VOL`, `board`, `user_profile`, `name`) VALUES
(1, 1500, 200, 200, 1, 1, 'User 1'),
(2, 1500, 200, 300, 1, 2, 'User 2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `boards`
--
ALTER TABLE `boards`
  ADD PRIMARY KEY (`board_id`);

--
-- Indexes for table `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`match_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `boards`
--
ALTER TABLE `boards`
  MODIFY `board_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `games`
--
ALTER TABLE `games`
  MODIFY `match_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
