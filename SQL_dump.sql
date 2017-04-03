-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 03, 2017 at 05:54 PM
-- Server version: 5.6.35
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `resources`
--

-- --------------------------------------------------------

--
-- Table structure for table `bookings`
--

CREATE TABLE `bookings` (
  `id` int(7) NOT NULL,
  `title` varchar(255) NOT NULL,
  `notes` text NOT NULL,
  `start_date` varchar(255) NOT NULL,
  `end_date` varchar(255) NOT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `project_name` varchar(255) NOT NULL,
  `resource_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `bookings`
--

INSERT INTO `bookings` (`id`, `title`, `notes`, `start_date`, `end_date`, `created_by`, `project_name`, `resource_name`) VALUES
(1, 'jbdiwhred', 'tester', '2017-04-04', '2017-04-06', NULL, 'GTB Project', 'James Craft'),
(2, 'test2', 'tester', '2017-04-12', '2017-04-13', NULL, 'NHS Project', 'Hannah Simms'),
(3, 'test3', 'tester', '2017-04-11', '2017-04-16', NULL, 'NHS Project', 'Damian Whyte'),
(4, 'frer', 'ree', '2017-03-28', '2017-03-29', NULL, 'Ford Project', 'Hannah Simms');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(7) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` varchar(255) DEFAULT NULL,
  `due_date` varchar(255) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `colour_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `start_date`, `due_date`, `created_by`, `colour_code`) VALUES
(1, 'GTB Project', '2017-04-10', '2017-08-23', NULL, '#453653'),
(2, 'Ford Project', '2017-04-10', '2017-18-23', NULL, 'blue'),
(3, 'NHS Project', '2017-04-30', '2017-10-23', NULL, '#333611');

-- --------------------------------------------------------

--
-- Table structure for table `resource`
--

CREATE TABLE `resource` (
  `id` int(7) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `resource_type` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `admin` tinyint(1) NOT NULL,
  `bookable` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `resource`
--

INSERT INTO `resource` (`id`, `first_name`, `last_name`, `resource_type`, `password`, `email`, `admin`, `bookable`) VALUES
(1, 'Damian', 'Whyte', 'Developer', '5f4dcc3b5aa765d61d8327deb882cf99', 'damian.whyte@gtb.com', 1, '1'),
(2, 'Hannah', 'Simms', 'Project Manager', '098f6bcd4621d373cade4e832627b4f6', 'hannah.simme@gtb.com', 0, '1'),
(3, 'James', 'Craft', 'Project Manager', 'd941191e51e81390343e12b159bb123f', 'hannah.simme@gtb.com', 0, '1');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `resource`
--
ALTER TABLE `resource`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
--
-- AUTO_INCREMENT for table `resource`
--
ALTER TABLE `resource`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;