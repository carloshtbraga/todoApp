/*
  Warnings:

  - The primary key for the `Tasks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `completed` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Tasks` table. All the data in the column will be lost.
  - Added the required column `task_name` to the `Tasks` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Tasks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tasks" DROP CONSTRAINT "Tasks_pkey",
DROP COLUMN "completed",
DROP COLUMN "description",
DROP COLUMN "id",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "task_completed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "task_description" TEXT,
ADD COLUMN     "task_id" SERIAL NOT NULL,
ADD COLUMN     "task_name" TEXT NOT NULL,
ADD COLUMN     "user_id" INTEGER NOT NULL,
ADD CONSTRAINT "Tasks_pkey" PRIMARY KEY ("task_id");

-- CreateTable
CREATE TABLE "Users" (
    "user_id" SERIAL NOT NULL,
    "password" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- AddForeignKey
ALTER TABLE "Tasks" ADD CONSTRAINT "Tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
