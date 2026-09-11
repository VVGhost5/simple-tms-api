-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Editor', 'Admin');

-- CreateEnum
CREATE TYPE "LicenseCategory" AS ENUM ('B1', 'B', 'BE', 'C1', 'C', 'C1E', 'CE', 'D1', 'D', 'D1E', 'DE');

-- DropForeignKey
ALTER TABLE "Driver" DROP CONSTRAINT "Driver_currentVehicleId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Trip" DROP CONSTRAINT "Trip_vehicleId_fkey";

-- DropIndex
DROP INDEX "Driver_email_key";

-- DropIndex
DROP INDEX "Driver_licenseNumber_key";

-- DropIndex
DROP INDEX "Driver_phone_key";

-- DropIndex
DROP INDEX "Vehicle_licensePlate_key";

-- DropIndex
DROP INDEX "Vehicle_vin_key";

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Driver" ADD COLUMN "createdById" TEXT,
ADD COLUMN "tenantId" TEXT NOT NULL,
DROP COLUMN "categories",
ADD COLUMN "categories" "LicenseCategory"[];

-- AlterTable
ALTER TABLE "Trip" ADD COLUMN "createdById" TEXT,
ADD COLUMN "tenantId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "role" "Role" NOT NULL DEFAULT 'Editor',
ADD COLUMN "tenantId" TEXT NOT NULL,
ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vehicle" ADD COLUMN "createdById" TEXT,
ADD COLUMN "tenantId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Driver_tenantId_idx" ON "Driver"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_id_tenantId_key" ON "Driver"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_currentVehicleId_tenantId_key" ON "Driver"("currentVehicleId", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_tenantId_licenseNumber_key" ON "Driver"("tenantId", "licenseNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_tenantId_phone_key" ON "Driver"("tenantId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_tenantId_email_key" ON "Driver"("tenantId", "email");

-- CreateIndex
CREATE INDEX "Trip_tenantId_idx" ON "Trip"("tenantId");

-- CreateIndex
CREATE INDEX "User_tenantId_idx" ON "User"("tenantId");

-- CreateIndex
CREATE INDEX "Vehicle_tenantId_idx" ON "Vehicle"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_id_tenantId_key" ON "Vehicle"("id", "tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_tenantId_licensePlate_key" ON "Vehicle"("tenantId", "licensePlate");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_tenantId_vin_key" ON "Vehicle"("tenantId", "vin");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_currentVehicleId_tenantId_fkey" FOREIGN KEY ("currentVehicleId", "tenantId") REFERENCES "Vehicle"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Driver" ADD CONSTRAINT "Driver_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_driverId_tenantId_fkey" FOREIGN KEY ("driverId", "tenantId") REFERENCES "Driver"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicleId_tenantId_fkey" FOREIGN KEY ("vehicleId", "tenantId") REFERENCES "Vehicle"("id", "tenantId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
