-- AlterTable
ALTER TABLE "public"."Tenant" ADD COLUMN     "custom_domain" TEXT,
ADD COLUMN     "plan_id" TEXT,
ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "updated_at" SET DEFAULT CURRENT_TIMESTAMP;
