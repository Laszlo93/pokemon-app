/*
  Warnings:

  - Added the required column `name` to the `caught_pokemon` table without a default value. This is not possible if the table is not empty.
  - Added the required column `types` to the `caught_pokemon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `caught_pokemon` ADD COLUMN `name` VARCHAR(64) NOT NULL,
    ADD COLUMN `types` JSON NOT NULL;
