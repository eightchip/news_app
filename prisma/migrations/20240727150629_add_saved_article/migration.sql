/*
  Warnings:

  - You are about to drop the column `content` on the `Article` table. All the data in the column will be lost.
  - Made the column `description` on table `Article` required. This step will fail if there are existing NULL values in that column.
  - Made the column `description` on table `SavedArticle` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Article" DROP COLUMN "content",
ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "SavedArticle" ALTER COLUMN "description" SET NOT NULL;
