CREATE DATABASE DinBanDon
ON(
NAME = 'DinBanDon',
FILENAME = 'C:\JspSpace\dinbandon.mdf',
SIZE = 10MB,
MAXSIZE=20MB,
FILEGROWTH=10%
)
GO

USE DinBanDon
GO

CREATE TABLE Profile(
  userId varchar(50) NOT NULL PRIMARY KEY,
  userName nvarchar(50) NOT NULL,
  userPwd varchar(50) NOT NULL,
)
GO

CREATE TABLE MealList(
  mealId VARCHAR(10) NOT NULL,
  mealContent NVARCHAR(MAX) NOT NULL,
  mealPrice INT NOT NULL,
  mealDate DATE NOT NULL,
)
GO

CREATE TABLE OrderList(
  orderId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
  userId VARCHAR(50) NOT NULL FOREIGN KEY REFERENCES Profile(userId),
  mealId VARCHAR(10) NOT NULL,
  orderDate DATETIME NOT NULL,
  orderPayFlag BIT DEFAULT(0),
  orderNote NVARCHAR(MAX)
)
GO

CREATE TABLE RandomSalt(
  userId varchar(50) NOT NULL FOREIGN KEY REFERENCES Profile(userId),
  salt int 
)
GO

INSERT INTO MealList(mealId,mealContent,mealPrice,mealDate)
VALUES('A','½Þ¦×',70,'20200229'),
			('B','Âû¦×',75,'20200229'),
			('C','¤û¦×',80,'20200229'),
			('D','³½¦×',85,'20200229')
GO

INSERT INTO Profile (userId,userName,userPwd)VALUES('eeit11200',N'­È¤é¥Í','-1029513973')
INSERT INTO RandomSalt(userId,salt)VALUES('eeit11200','93')
GO
--DELETE FROM MealList
--DROP TABLE OrderList
--DROP TABLE MealList