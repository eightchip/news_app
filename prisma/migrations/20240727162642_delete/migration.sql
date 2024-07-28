/*
  Warnings:

  - You are about to drop the `SavedArticle` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SavedArticle" DROP CONSTRAINT "SavedArticle_userId_fkey";

-- DropTable
DROP TABLE "SavedArticle";
