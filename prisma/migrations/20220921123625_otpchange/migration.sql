/*
  Warnings:

  - Changed the type of `otp` on the `Otp` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_device_id_fkey";

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "otp",
ADD COLUMN     "otp" INTEGER NOT NULL;
