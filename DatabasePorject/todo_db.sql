-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 28, 2025 at 04:18 PM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `todo_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `comments`
--

CREATE TABLE `comments` (
  `comment_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `comments`
--

INSERT INTO `comments` (`comment_id`, `task_id`, `user_id`, `comment`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 'commentss', '2025-02-28 04:41:33', '2025-02-28 04:41:33'),
(2, 1, 1, 'commentss xxxx edit 333', '2025-02-28 05:45:11', '2025-02-28 05:55:45'),
(3, 1, 1, 'commentss xxxx edit 4444', '2025-02-28 05:45:50', '2025-02-28 06:06:39'),
(5, 1, 1, 'commentss xxxx edit 5556', '2025-02-28 06:06:44', '2025-02-28 15:03:57'),
(7, 1, 1, 'commentss xxxx 2', '2025-02-28 07:04:25', '2025-02-28 07:04:25'),
(8, 1, 1, 'commentss xxxx 2', '2025-02-28 07:08:58', '2025-02-28 07:08:58'),
(9, 1, 1, 'commentss xxxx 2', '2025-02-28 07:10:09', '2025-02-28 07:10:09'),
(10, 1, 1, 'commentss xxxx 2', '2025-02-28 07:10:42', '2025-02-28 07:10:42'),
(12, 10, 1, 'commentss xxxx 2', '2025-02-28 07:12:13', '2025-02-28 07:12:13'),
(13, 10, 1, 'commentss xxxx 2', '2025-02-28 15:03:47', '2025-02-28 15:03:47');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `task_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `status` enum('pending','in_progress','completed','') NOT NULL,
  `priority` enum('low','medium','high','') NOT NULL,
  `due_date` date NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`task_id`, `user_id`, `title`, `description`, `status`, `priority`, `due_date`, `created_at`, `updated_at`) VALUES
(1, 1, 'title', 'xxxxx', 'in_progress', 'medium', '2025-03-03', '2025-02-28 04:24:53', '2025-02-28 04:24:53'),
(2, 1, 'title 2', 'xxxxx 2', 'in_progress', 'medium', '2025-03-04', '2025-02-28 06:43:31', '2025-02-28 06:43:31'),
(3, 1, 'title 3 new', 'xxxxx 3', 'completed', 'high', '2025-03-05', '2025-02-28 06:43:54', '2025-02-28 15:02:47'),
(5, 1, 'title 3', 'xxxxx 3', 'in_progress', 'medium', '2025-03-04', '2025-02-28 07:02:44', '2025-02-28 07:02:44'),
(6, 1, 'title 3', 'xxxxx 3', 'in_progress', 'medium', '2025-03-04', '2025-02-28 07:03:59', '2025-02-28 07:03:59'),
(7, 1, 'title 3', 'xxxxx 3', 'in_progress', 'medium', '2025-03-04', '2025-02-28 07:04:50', '2025-02-28 07:04:50'),
(8, 1, 'title 3', 'xxxxx 3', 'in_progress', 'medium', '2025-03-04', '2025-02-28 07:04:57', '2025-02-28 07:04:57'),
(9, 1, 'title 3', 'xxxxx 3', 'in_progress', 'medium', '2025-03-04', '2025-02-28 07:06:11', '2025-02-28 07:06:11'),
(10, 1, 'title 3', 'xxxxx 3', 'in_progress', 'medium', '2025-03-04', '2025-02-28 07:07:49', '2025-02-28 07:07:49'),
(11, 6, 'title 6', 'xxxxx 6', 'in_progress', 'medium', '2025-03-04', '2025-02-28 09:53:13', '2025-02-28 09:53:13'),
(12, 6, 'title 6', 'xxxxx 6', 'in_progress', 'medium', '2025-03-04', '2025-02-28 15:02:03', '2025-02-28 15:02:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `created_at`, `updated_at`) VALUES
(1, 'user8 new', 'email8new@gmail.com', '12333', '2025-02-28 01:02:26', '2025-02-28 09:27:39'),
(2, 'user2', 'email.com', '1234', '2025-02-28 08:57:19', '2025-02-28 08:57:19'),
(3, 'user2', 'email.com', '1234', '2025-02-28 08:58:12', '2025-02-28 08:58:12'),
(4, 'user2', 'email.com', '1234', '2025-02-28 08:58:31', '2025-02-28 08:58:31'),
(6, 'user2', 'email@gmail.com', '1234', '2025-02-28 09:03:22', '2025-02-28 09:03:22'),
(7, 'user7', 'email7@gmail.com', '$2b$10$BvQbe7feyLOd3uAMWg6S1OduZV16m563pPD7eQ2i2fnbHWm8M./5.', '2025-02-28 09:13:54', '2025-02-28 09:13:54'),
(8, 'user8 new', 'email8new@gmail.com', '$2b$10$YVCbJGeW8SyxD7twVbsmzePkDzGYG6ObkEy5oxRBvy5wmvOkmchrW', '2025-02-28 09:24:19', '2025-02-28 15:00:56'),
(9, 'user9', 'email8@gmail.com', '$2b$10$PBX4k86rn5u8yX4vX3m13ucjOrZzVl2Beg17aYC1IY9K/pMft62eW', '2025-02-28 10:51:54', '2025-02-28 10:51:54'),
(10, 'user10', 'email10@gmail.com', '$2b$10$p4ywKSZLzkGndJd5Jxia/uIsrIQjY.DmMOI8jHHiXlwq0DEMV7Agq', '2025-02-28 14:50:16', '2025-02-28 14:50:16'),
(11, 'user111', 'email111new@gmail.com', '$2b$10$cCQE4FcHHcTHMmOtshjM8ulk1ly1Y9YJvzDHfcfoFsvYbpAf6PBzu', '2025-02-28 14:54:59', '2025-02-28 14:59:38');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`comment_id`),
  ADD KEY `task_fk_key` (`task_id`),
  ADD KEY `user_fk_key` (`user_id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`task_id`),
  ADD KEY `user_task_fk_key` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `comments`
--
ALTER TABLE `comments`
  MODIFY `comment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `task_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `task_fk_key` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`task_id`),
  ADD CONSTRAINT `user_fk_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `user_task_fk_key` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
