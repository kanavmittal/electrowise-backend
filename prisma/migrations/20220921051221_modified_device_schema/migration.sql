/*
  Warnings:

  - You are about to drop the column `communicate_to` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `head` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `secret` on the `Device` table. All the data in the column will be lost.
  - Added the required column `otp` to the `Device` table without a default value. This is not possible if the table is not empty.
  - Added the required column `otp_expiresAt` to the `Device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "communicate_to",
DROP COLUMN "head",
DROP COLUMN "secret",
ADD COLUMN     "otp" INTEGER NOT NULL,
ADD COLUMN     "otp_createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "otp_expiresAt" TIMESTAMP(3) NOT NULL;
