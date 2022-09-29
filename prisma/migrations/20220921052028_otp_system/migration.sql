/*
  Warnings:

  - You are about to drop the column `otp` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `otp_createdAt` on the `Device` table. All the data in the column will be lost.
  - You are about to drop the column `otp_expiresAt` on the `Device` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Device" DROP COLUMN "otp",
DROP COLUMN "otp_createdAt",
DROP COLUMN "otp_expiresAt";

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "otp" TEXT NOT NULL,
    "expiration_time" TIMESTAMP(3) NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);
