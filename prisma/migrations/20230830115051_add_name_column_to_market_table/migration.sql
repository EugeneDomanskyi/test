-- CreateTable
CREATE TABLE "Market" (
    "id" SERIAL NOT NULL,
    "cgId" TEXT NOT NULL,
    "blockchain" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "tokenCount" TEXT NOT NULL,
    "discordUrl" TEXT NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "twitterUrl" TEXT NOT NULL,
    "openseaVerificationStatus" BOOLEAN NOT NULL DEFAULT false,
    "sampleImages" TEXT NOT NULL,
    "decimals" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Market_pkey" PRIMARY KEY ("id")
);
