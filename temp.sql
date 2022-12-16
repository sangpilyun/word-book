CREATE TABLE `user` (
  `seq` int NOT NULL AUTO_INCREMENT,
  `id` varchar(16) NOT NULL,
  `password` varchar(72) NOT NULL,
  `name` varchar(40) NOT NULL,
  `email` varchar(45) NOT NULL,
  `gender` varchar(1) NOT NULL,
  `tel` varchar(13) NOT NULL,
  `createdDate` datetime NOT NULL,
  `deletedDate` datetime NULL,
  UNIQUE INDEX `IDX_cace4a159ff9f2512dd4237376` (`id`),
  UNIQUE INDEX `IDX_cace4a159ff9f2512dd4237376` (`id`),
  PRIMARY KEY (`seq`)
) ENGINE = InnoDB