/*
  Warnings:

  - You are about to drop the column `emptyWeight` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `fullWeight` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `vin` on the `Vehicle` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[semiTrailerId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[tenantId,vinCode]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[semiTrailerId,tenantId]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "EmissionStandard" AS ENUM ('Євро-1', 'Євро-2', 'Євро-3', 'Євро-4', 'Євро-5', 'Євро-6', 'Євро-7');

-- CreateEnum
CREATE TYPE "OwnershipType" AS ENUM ('Є власником', 'Не є власником', 'special');

-- CreateEnum
CREATE TYPE "VehicleCategory" AS ENUM ('N2', 'N3', 'O3', 'O4');

-- DropIndex
DROP INDEX "Vehicle_tenantId_vin_key";

-- AlterTable
ALTER TABLE "TripLoad" ADD COLUMN     "goodsId" TEXT;

-- AlterTable
ALTER TABLE "TripUnload" ADD COLUMN     "goodsId" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "emptyWeight",
DROP COLUMN "fullWeight",
DROP COLUMN "vin",
DROP COLUMN "year",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "bodyType" TEXT,
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "chassisNumber" TEXT,
ADD COLUMN     "color" TEXT,
ADD COLUMN     "commercialDescription" TEXT,
ADD COLUMN     "emissionStandart" "EmissionStandard",
ADD COLUMN     "emptyMass" INTEGER,
ADD COLUMN     "firstRegistrationDate" TIMESTAMP(3),
ADD COLUMN     "givenNames" TEXT,
ADD COLUMN     "manufacturingYear" INTEGER,
ADD COLUMN     "maximumMass" INTEGER,
ADD COLUMN     "maximumPower" INTEGER,
ADD COLUMN     "numberOfSeats" INTEGER,
ADD COLUMN     "ownership" "OwnershipType",
ADD COLUMN     "periodOfValidity" TIMESTAMP(3),
ADD COLUMN     "registrationDate" TIMESTAMP(3),
ADD COLUMN     "semiTrailerId" TEXT,
ADD COLUMN     "specialMarks" TEXT,
ADD COLUMN     "surnameOrCompany" TEXT,
ADD COLUMN     "tsc" INTEGER,
ADD COLUMN     "vehicleCategory" "VehicleCategory",
ADD COLUMN     "vinCode" TEXT,
ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "fuelType" DROP NOT NULL,
ALTER COLUMN "registrationCode" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SemiTrailer" (
    "id" TEXT NOT NULL,
    "licensePlate" TEXT NOT NULL,
    "make" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "type" TEXT,
    "commercialDescription" TEXT,
    "vinCode" TEXT,
    "chassisNumber" TEXT,
    "maximumMass" INTEGER,
    "emptyMass" INTEGER,
    "vehicleCategory" "VehicleCategory",
    "capacity" INTEGER,
    "bodyType" TEXT,
    "fuelType" TEXT,
    "maximumPower" INTEGER,
    "emissionStandart" "EmissionStandard",
    "color" TEXT,
    "numberOfSeats" INTEGER,
    "specialMarks" TEXT,
    "firstRegistrationDate" TIMESTAMP(3),
    "registrationDate" TIMESTAMP(3),
    "surnameOrCompany" TEXT,
    "givenNames" TEXT,
    "manufacturingYear" INTEGER,
    "address" TEXT,
    "ownership" "OwnershipType",
    "registrationCode" TEXT,
    "periodOfValidity" TIMESTAMP(3),
    "tsc" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tenantId" TEXT NOT NULL,
    "createdById" TEXT,

    CONSTRAINT "SemiTrailer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goods" (
    "id" TEXT NOT NULL,
    "descrpiption" TEXT NOT NULL,
    "volume" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "isADR" BOOLEAN NOT NULL,

    CONSTRAINT "Goods_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SemiTrailer_tenantId_idx" ON "SemiTrailer"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SemiTrailer_id_tenantId_key" ON "SemiTrailer"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "SemiTrailer_tenantId_licensePlate_key" ON "SemiTrailer"("tenantId", "licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "SemiTrailer_tenantId_vinCode_key" ON "SemiTrailer"("tenantId", "vinCode");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_semiTrailerId_key" ON "Vehicle"("semiTrailerId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_tenantId_vinCode_key" ON "Vehicle"("tenantId", "vinCode");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_semiTrailerId_tenantId_key" ON "Vehicle"("semiTrailerId", "tenantId");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_semiTrailerId_tenantId_fkey" FOREIGN KEY ("semiTrailerId", "tenantId") REFERENCES "SemiTrailer"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemiTrailer" ADD CONSTRAINT "SemiTrailer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SemiTrailer" ADD CONSTRAINT "SemiTrailer_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripLoad" ADD CONSTRAINT "TripLoad_goodsId_fkey" FOREIGN KEY ("goodsId") REFERENCES "Goods"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripUnload" ADD CONSTRAINT "TripUnload_goodsId_fkey" FOREIGN KEY ("goodsId") REFERENCES "Goods"("id") ON DELETE SET NULL ON UPDATE CASCADE;
