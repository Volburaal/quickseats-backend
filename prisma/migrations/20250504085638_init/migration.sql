/*
  Warnings:

  - You are about to drop the `Entry` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('CHINIOT', 'FAISALABAD', 'SHUTTLE', 'ADMIN');

-- DropTable
DROP TABLE "Entry";

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "cnic" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AvailableRide" (
    "id" SERIAL NOT NULL,
    "destination" TEXT NOT NULL,
    "at" TEXT NOT NULL,
    "vacancy" INTEGER NOT NULL,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "AvailableRide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomingRide" (
    "id" SERIAL NOT NULL,
    "destination" TEXT NOT NULL,
    "departedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "driverId" INTEGER NOT NULL,

    CONSTRAINT "IncomingRide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_cnic_key" ON "User"("cnic");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "AvailableRide" ADD CONSTRAINT "AvailableRide_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomingRide" ADD CONSTRAINT "IncomingRide_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
