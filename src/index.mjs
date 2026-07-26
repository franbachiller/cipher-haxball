import { launch } from './browser.mjs';

async function main() {
  const { browser } = await launch();

  // Keep process alive — Ctrl+C to close
  process.on('SIGINT', async () => {
    console.log('\n[+] Closing...');
    await browser.close();
    process.exit(0);
  });
}

main().catch(err => {
  console.error('[!] Fatal:', err);
  process.exit(1);
});
