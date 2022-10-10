-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_room_id_fkey";

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "Room"("id") ON DELETE CASCADE ON UPDATE CASCADE;
