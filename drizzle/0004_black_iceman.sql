CREATE TABLE "experience" (
	"id" serial PRIMARY KEY NOT NULL,
	"logo" text DEFAULT '/placeholder.png' NOT NULL,
	"company" text NOT NULL,
	"position" text NOT NULL,
	"type" text NOT NULL,
	"startDate" text NOT NULL,
	"endDate" text NOT NULL,
	"description" text NOT NULL,
	"skills" text[] DEFAULT '{}' NOT NULL,
	"isRemote" boolean DEFAULT false NOT NULL
);
