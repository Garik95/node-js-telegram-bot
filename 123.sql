-- --------------------------------------------------------
-- Хост:                         192.168.79.128
-- Версия сервера:               5.5.44-0ubuntu0.14.04.1 - (Ubuntu)
-- Операционная система:         debian-linux-gnu
-- HeidiSQL Версия:              9.4.0.5125
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Дамп структуры базы данных admin_nova
DROP DATABASE IF EXISTS `admin_nova`;
CREATE DATABASE IF NOT EXISTS `admin_nova` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `admin_nova`;

-- Дамп структуры для таблица admin_nova.action
DROP TABLE IF EXISTS `action`;
CREATE TABLE IF NOT EXISTS `action` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `url` varchar(255) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.auth_assignment
DROP TABLE IF EXISTS `auth_assignment`;
CREATE TABLE IF NOT EXISTS `auth_assignment` (
  `item_name` varchar(64) NOT NULL,
  `user_id` varchar(64) NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`item_name`,`user_id`),
  CONSTRAINT `auth_assignment_ibfk_1` FOREIGN KEY (`item_name`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.auth_item
DROP TABLE IF EXISTS `auth_item`;
CREATE TABLE IF NOT EXISTS `auth_item` (
  `name` varchar(64) NOT NULL,
  `type` int(11) NOT NULL,
  `description` text,
  `rule_name` varchar(64) DEFAULT NULL,
  `data` text,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `rule_name` (`rule_name`),
  KEY `type` (`type`),
  CONSTRAINT `auth_item_ibfk_1` FOREIGN KEY (`rule_name`) REFERENCES `auth_rule` (`name`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.auth_item_child
DROP TABLE IF EXISTS `auth_item_child`;
CREATE TABLE IF NOT EXISTS `auth_item_child` (
  `parent` varchar(64) NOT NULL,
  `child` varchar(64) NOT NULL,
  PRIMARY KEY (`parent`,`child`),
  KEY `child` (`child`),
  CONSTRAINT `auth_item_child_ibfk_1` FOREIGN KEY (`parent`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `auth_item_child_ibfk_2` FOREIGN KEY (`child`) REFERENCES `auth_item` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.auth_rule
DROP TABLE IF EXISTS `auth_rule`;
CREATE TABLE IF NOT EXISTS `auth_rule` (
  `name` varchar(64) NOT NULL,
  `data` text,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.billing_info
DROP TABLE IF EXISTS `billing_info`;
CREATE TABLE IF NOT EXISTS `billing_info` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `contact_name` varchar(255) NOT NULL,
  `contact_phone` varchar(255) NOT NULL,
  `receipt_id` varchar(255) NOT NULL,
  `per_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `txt` text NOT NULL,
  `payment_method` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для представление admin_nova.command_list
DROP VIEW IF EXISTS `command_list`;
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `command_list` (
	`name` VARCHAR(255) NULL COLLATE 'utf8mb4_unicode_ci',
	`category` VARCHAR(45) NULL COLLATE 'utf8mb4_unicode_ci',
	`product_name` VARCHAR(255) NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Дамп структуры для таблица admin_nova.dispatch
DROP TABLE IF EXISTS `dispatch`;
CREATE TABLE IF NOT EXISTS `dispatch` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `text` text NOT NULL,
  `data` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.migration
DROP TABLE IF EXISTS `migration`;
CREATE TABLE IF NOT EXISTS `migration` (
  `version` varchar(180) NOT NULL,
  `apply_time` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.payment_method
DROP TABLE IF EXISTS `payment_method`;
CREATE TABLE IF NOT EXISTS `payment_method` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.receipt_id
DROP TABLE IF EXISTS `receipt_id`;
CREATE TABLE IF NOT EXISTS `receipt_id` (
  `id` varchar(255) NOT NULL,
  `transaction_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.sp_answers
DROP TABLE IF EXISTS `sp_answers`;
CREATE TABLE IF NOT EXISTS `sp_answers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_id` int(11) NOT NULL,
  `question_id` int(11) NOT NULL,
  `answer` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.sp_commands
DROP TABLE IF EXISTS `sp_commands`;
CREATE TABLE IF NOT EXISTS `sp_commands` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `sp_category_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для представление admin_nova.sp_menu
DROP VIEW IF EXISTS `sp_menu`;
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `sp_menu` (
	`id` INT(11) NOT NULL,
	`category` VARCHAR(45) NULL COLLATE 'utf8mb4_unicode_ci',
	`emoji` TEXT NOT NULL COLLATE 'utf8_general_ci',
	`name` VARCHAR(45) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`product_name` VARCHAR(255) NULL COLLATE 'utf8_general_ci',
	`sort_id` INT(11) NOT NULL,
	`command` VARCHAR(255) NULL COLLATE 'utf8_general_ci'
) ENGINE=MyISAM;

-- Дамп структуры для таблица admin_nova.sp_price
DROP TABLE IF EXISTS `sp_price`;
CREATE TABLE IF NOT EXISTS `sp_price` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Price_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `Price` float NOT NULL,
  `State` int(11) DEFAULT NULL,
  `v_date` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.sp_product
DROP TABLE IF EXISTS `sp_product`;
CREATE TABLE IF NOT EXISTS `sp_product` (
  `product_id` int(11) NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) NOT NULL,
  `product_Description` text,
  `Product_calorie` float DEFAULT NULL,
  `product_Photo` text,
  `product_Video` text,
  `sp_category_id` int(11) NOT NULL,
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=113 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.sp_questions
DROP TABLE IF EXISTS `sp_questions`;
CREATE TABLE IF NOT EXISTS `sp_questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `message_id` int(11) NOT NULL,
  `target_message_id` text,
  `category` int(11) NOT NULL,
  `question` text NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.sp_transactions
DROP TABLE IF EXISTS `sp_transactions`;
CREATE TABLE IF NOT EXISTS `sp_transactions` (
  `transaction_id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `price_id` float NOT NULL,
  `v_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `quantity` int(11) DEFAULT NULL,
  `state_id` int(11) DEFAULT '1',
  PRIMARY KEY (`transaction_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.sp_transaction_state
DROP TABLE IF EXISTS `sp_transaction_state`;
CREATE TABLE IF NOT EXISTS `sp_transaction_state` (
  `state_id` int(11) NOT NULL AUTO_INCREMENT,
  `name_state` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`state_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.sp_users
DROP TABLE IF EXISTS `sp_users`;
CREATE TABLE IF NOT EXISTS `sp_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `language_code` varchar(5) NOT NULL,
  `username` varchar(50) NOT NULL,
  `status` int(11) NOT NULL,
  `cat` text,
  `sub_cat` text,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=35 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для таблица admin_nova.staff
DROP TABLE IF EXISTS `staff`;
CREATE TABLE IF NOT EXISTS `staff` (
  `staff_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) NOT NULL,
  `last_name` varchar(255) NOT NULL,
  `language_code` varchar(5) NOT NULL,
  `username` varchar(50) NOT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`staff_id`)
) ENGINE=MyISAM AUTO_INCREMENT=2147483648 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для представление admin_nova.v_bot_inline
DROP VIEW IF EXISTS `v_bot_inline`;
-- Создание временной таблицы для обработки ошибок зависимостей представлений
CREATE TABLE `v_bot_inline` (
	`category` VARCHAR(45) NULL COLLATE 'utf8mb4_unicode_ci',
	`name` VARCHAR(45) NOT NULL COLLATE 'utf8mb4_unicode_ci',
	`id` INT(11) NOT NULL,
	`product_name` VARCHAR(255) NULL COLLATE 'utf8_general_ci',
	`ph` TEXT NULL COLLATE 'utf8_general_ci',
	`Price` FLOAT NOT NULL
) ENGINE=MyISAM;

-- Дамп структуры для таблица admin_nova.ymd_categories
DROP TABLE IF EXISTS `ymd_categories`;
CREATE TABLE IF NOT EXISTS `ymd_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) unsigned DEFAULT NULL,
  `indx` int(11) NOT NULL DEFAULT '0',
  `sort_id` int(11) NOT NULL,
  `emoji` text NOT NULL,
  `name` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `slug` varchar(45) NOT NULL,
  `description` mediumtext,
  `image` varchar(80) DEFAULT NULL,
  `meta_title` varchar(80) DEFAULT NULL,
  `meta_keywords` varchar(150) DEFAULT NULL,
  `meta_description` varchar(255) DEFAULT NULL,
  `position` smallint(10) unsigned DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;

-- Экспортируемые данные не выделены.
-- Дамп структуры для представление admin_nova.command_list
DROP VIEW IF EXISTS `command_list`;
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `command_list`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`%` SQL SECURITY DEFINER VIEW `command_list` AS select distinct `sp_menu`.`name` AS `name`,`sp_menu`.`category` AS `category`,`sp_menu`.`product_name` AS `product_name` from `sp_menu` where (`sp_menu`.`name` is not null) union select distinct `sp_menu`.`command` AS `command`,`sp_menu`.`category` AS `category`,`sp_menu`.`product_name` AS `product_name` from `sp_menu` where (`sp_menu`.`command` is not null);

-- Дамп структуры для представление admin_nova.sp_menu
DROP VIEW IF EXISTS `sp_menu`;
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `sp_menu`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `sp_menu` AS select `c`.`id` AS `id`,(select `ymd_categories`.`name` from `ymd_categories` where (`ymd_categories`.`id` = `c`.`parent_id`)) AS `category`,`c`.`emoji` AS `emoji`,`c`.`name` AS `name`,`p`.`product_name` AS `product_name`,`c`.`sort_id` AS `sort_id`,`cc`.`name` AS `command` from ((`ymd_categories` `c` left join `sp_product` `p` on((`c`.`id` = `p`.`sp_category_id`))) left join `sp_commands` `cc` on((`c`.`id` = `cc`.`sp_category_id`)));

-- Дамп структуры для представление admin_nova.v_bot_inline
DROP VIEW IF EXISTS `v_bot_inline`;
-- Удаление временной таблицы и создание окончательной структуры представления
DROP TABLE IF EXISTS `v_bot_inline`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `v_bot_inline` AS select `m`.`category` AS `category`,`m`.`name` AS `name`,`p`.`product_id` AS `id`,`m`.`product_name` AS `product_name`,`p`.`product_Photo` AS `ph`,`c`.`Price` AS `Price` from ((`sp_menu` `m` join `sp_product` `p` on((`m`.`product_name` = `p`.`product_name`))) join `sp_price` `c` on((`p`.`product_id` = `c`.`product_id`)));

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
