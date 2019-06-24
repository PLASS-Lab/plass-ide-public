CREATE TABLE `problems` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text COLLATE utf8_bin,
  `content` text COLLATE utf8_bin,
  `rank` int(11) DEFAULT NULL,
  `created` timestamp NULL DEFAULT NULL,
  `category` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `input` text COLLATE utf8_bin,
  `output` text COLLATE utf8_bin,
  `remarks` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `category` varchar(45) DEFAULT NULL,
  `created` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `user` int(11) NOT NULL,
  `path` text NOT NULL,
  `enabled` tinyint(4) DEFAULT '1',
  `problem` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=latin1;

CREATE TABLE `submitResult` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `problem` int(11) DEFAULT NULL,
  `createDate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `is_success` tinyint(4) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `testCases` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `input` varchar(45) DEFAULT NULL,
  `output` varchar(45) DEFAULT NULL,
  `problem` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `password` text COLLATE utf8_bin,
  `name` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `student_id` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `email` text COLLATE utf8_bin,
  `birth` date DEFAULT NULL,
  `grade` int(11) DEFAULT NULL,
  `school` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

