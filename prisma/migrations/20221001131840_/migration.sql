-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_user_id_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_user_id_fkey";

-- DropForeignKey
ALTER TABLE "devicedata" DROP CONSTRAINT "devicedata_device_id_fkey";

-- AddForeignKey
ALTER TABLE "devicedata" ADD CONSTRAINT "devicedata_device_id_fkey" FOREIGN KEY ("device_id") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
