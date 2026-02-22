/**
 * Seed script: migrates data from the static PRD HTML to Supabase.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node src/scripts/seed.mjs
 *
 * Requirements:
 *   - Supabase project with `sections` and `features` tables created
 *   - Supabase Storage bucket `screenshots` (public) created
 *   - Service role key (not anon) for admin writes
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY env vars");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const sectionsData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "sections-data.json"), "utf8")
);

async function uploadImages() {
  const imagesDir = path.join(__dirname, "images");
  const files = fs.readdirSync(imagesDir).filter((f) => f.endsWith(".png"));
  console.log(`Uploading ${files.length} images to Supabase Storage...`);

  let uploaded = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(imagesDir, file);
    const fileBuffer = fs.readFileSync(filePath);
    const storagePath = `screenshots/${file}`;

    const { error } = await supabase.storage
      .from("screenshots")
      .upload(storagePath, fileBuffer, {
        contentType: "image/png",
        upsert: true,
      });

    if (error) {
      if (error.message?.includes("already exists")) {
        skipped++;
      } else {
        console.error(`  Failed: ${file} — ${error.message}`);
      }
    } else {
      uploaded++;
    }

    if ((uploaded + skipped) % 20 === 0) {
      console.log(`  Progress: ${uploaded + skipped}/${files.length}`);
    }
  }

  console.log(`  Done: ${uploaded} uploaded, ${skipped} skipped`);
}

async function seedSections() {
  console.log("Seeding sections...");

  for (const section of sectionsData) {
    const { error } = await supabase.from("sections").upsert(
      {
        id: section.id,
        title: section.title,
        description: section.desc,
        sort_order: section.id,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error(`  Section ${section.id} failed:`, error.message);
    }
  }

  console.log(`  Done: ${sectionsData.length} sections`);
}

async function seedFeatures() {
  console.log("Seeding features...");

  let total = 0;

  for (const section of sectionsData) {
    const features = section.features.map((f, i) => ({
      section_id: section.id,
      name: f[0],
      mvp: f[1],
      complete: f[2],
      route: f[3],
      image_key: f[4],
      sort_order: i,
    }));

    const { error } = await supabase.from("features").upsert(features, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (error) {
      // If upsert fails (no existing ids), do insert
      const { error: insertError } = await supabase
        .from("features")
        .insert(features);

      if (insertError) {
        console.error(
          `  Section ${section.id} features failed:`,
          insertError.message
        );
      } else {
        total += features.length;
      }
    } else {
      total += features.length;
    }
  }

  console.log(`  Done: ${total} features`);
}

async function main() {
  console.log("=== PRD Menlo Seed Script ===\n");

  await uploadImages();
  console.log();
  await seedSections();
  console.log();
  await seedFeatures();

  console.log("\n=== Seed complete ===");
}

main().catch(console.error);
