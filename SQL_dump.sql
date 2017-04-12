-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Apr 12, 2017 at 05:36 PM
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
(87, 'wdqd', 'wef', '2017-04-12T15:51:07Z', '2017-04-15T05:19:07Z', NULL, 'GTB Project', 'Hannah Simms'),
(88, 'Designer Booking', '', '2017-05-29T23:55:58Z', '2017-06-03T21:19:58Z', NULL, 'Ford Project', 'Damian Whyte'),
(89, 'Developer Booking', '', '2017-04-12T05:52:57Z', '2017-04-15T08:55:57Z', NULL, 'GTB Project', 'James Craft'),
(90, 'PM Booking', 'no notes', '2017-04-11T22:58:43Z', '2017-04-13T12:37:43Z', NULL, 'Project Damian', 'Hannah Simms'),
(91, 'Test Booking', '', '2017-04-12T04:04:14Z', '2017-04-13T02:00:14Z', NULL, 'Ford Project', 'James Craft'),
(92, 'fefrer', '', '2017-05-04T22:08:10Z', '2017-05-12T00:17:17Z', NULL, 'Ford Project', 'Damian Whyte'),
(95, 'fegerg', 'gtrgtrgr', '2017-04-11T23:14:31Z', '2017-04-16T21:21:31Z', NULL, 'NHS Project', 'Damian Whyte'),
(96, 'Test Booking Alpah', 'some', '2017-04-12T21:30:17Z', '2017-04-14T06:03:17Z', NULL, 'Ford Project', 'Hannah Simms'),
(102, 'd', '', '2017-04-13T09:54:21Z', '2017-04-15T09:54:21Z', NULL, 'Project Damian', 'Hannah Simms'),
(103, 'eff', '', '2017-04-12T01:08:27Z', '2017-04-14T01:08:27Z', NULL, 'Ford Project', 'Hannah Simms'),
(106, 'bgbg', '', '2017-04-15T04:59:14Z', '2017-04-18T01:27:14Z', NULL, 'Project Damian', 'James Craft');

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(7) NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `colour_code` varchar(255) NOT NULL,
  `notes` longtext
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `projects`
--

INSERT INTO `projects` (`id`, `name`, `created_by`, `colour_code`, `notes`) VALUES
(1, 'GTB Project', NULL, '#453653', NULL),
(2, 'Ford Project', NULL, 'blue', NULL),
(3, 'NHS Project', NULL, '#333611', NULL),
(5, 'Project Damian', NULL, '#66276d', 'Random stuff.');

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
(2, 'Hannah', 'Simms', 'Project Manager', '098f6bcd4621d373cade4e832627b4f6', 'hannah.simme@gtb.com', 0, '0'),
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
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=109;
--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `resource`
--
ALTER TABLE `resource`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;