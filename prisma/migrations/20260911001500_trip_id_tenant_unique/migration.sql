-- CreateIndex
CREATE UNIQUE INDEX "Trip_id_tenantId_key" ON "Trip"("id", "tenantId");
