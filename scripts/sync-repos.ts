import { syncGitHubRepos } from '../lib/sync-repos';

async function main() {
  console.log('[sync:repos] Starting GitHub repository synchronization...');
  const result = await syncGitHubRepos({ forceFetch: true });

  console.log(`[sync:repos] Summary:`);
  console.log(`  - Newly Scaffolded (${result.scaffolded.length}):`, result.scaffolded.join(', ') || 'none');
  console.log(`  - Preserved/Skipped (${result.skipped.length}):`, result.skipped.join(', ') || 'none');

  if (result.errors.length > 0) {
    console.error(`  - Errors (${result.errors.length}):`, result.errors);
  }

  console.log('[sync:repos] Synchronization finished.');
}

main().catch((err) => {
  console.error('[sync:repos] Unexpected failure:', err);
  process.exit(1);
});
