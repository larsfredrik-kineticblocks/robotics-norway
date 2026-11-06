import { applySchema, seed } from "./seed";

async function main() {
  await applySchema();
  await seed();
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
