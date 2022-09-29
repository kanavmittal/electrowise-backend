/*
  Warnings:

  - You are about to drop the column `created_at` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `expiration_time` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Otp` table. All the data in the column will be lost.
  - You are about to drop the column `verified` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `expiresAt` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "created_at",
DROP COLUMN "expiration_time",
DROP COLUMN "updated_at",
DROP COLUMN "verified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL;
