CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_type" text NOT NULL,
	"source_name" text NOT NULL,
	"category" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"author" text,
	"duration" integer,
	"embed_html" text,
	"published_at" timestamp with time zone NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "content_items_url_unique" UNIQUE("url")
);
--> statement-breakpoint
CREATE TABLE "cron_runs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finished_at" timestamp with time zone,
	"items_added" integer DEFAULT 0,
	"items_skipped" integer DEFAULT 0,
	"errors" jsonb
);
--> statement-breakpoint
CREATE INDEX "idx_content_published_at" ON "content_items" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "idx_content_category" ON "content_items" USING btree ("category","published_at");--> statement-breakpoint
CREATE INDEX "idx_content_source_type" ON "content_items" USING btree ("source_type");