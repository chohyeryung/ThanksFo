CREATE TABLE `user` (
  `idx` int(40) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(20) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`idx`)
);
  
INSERT INTO `user` VALUES (1,'엉','developer@naver.com', '@1234');

  
CREATE TABLE `thdiary` (
  `idx` int(40) NOT NULL AUTO_INCREMENT,
  `description1` varchar(100) NOT NULL,
  `description2` varchar(100) NOT NULL,
  `description3` varchar(100) NOT NULL,
  `created` datetime NOT NULL,
  `user_id` int(40) DEFAULT NULL,
  PRIMARY KEY (`idx`)
);

  
INSERT INTO `thdiary` VALUES (1,'다치지 않은 것','좋은 부모님이 계신 것','우엉이가 있는 것', now(), 1);
