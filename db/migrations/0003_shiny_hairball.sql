CREATE TYPE "public"."template" AS ENUM('classic', 'modern', 'minimal');--> statement-breakpoint
ALTER TABLE "newsletters" ADD COLUMN "template_style" "template" DEFAULT 'classic' NOT NULL;