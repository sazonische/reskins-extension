import { defineConfig } from 'wxt';

export default defineConfig({
  // WXT builds Firefox as MV2 by default; both stores get the same MV3 extension.
  manifestVersion: 3,
  manifest: ({ browser }) => ({
    name: '__MSG_extensionName__',
    description: '__MSG_extensionDescription__',
    default_locale: 'en',
    ...(browser === 'firefox' && {
      browser_specific_settings: {
        gecko: {
          id: 'extension@reskins.gg',
          // data_collection_permissions is understood from Firefox 140 on
          strict_min_version: '140.0',
          // the Inspect in Game link of the page goes to reskins.gg in the address the user opens
          data_collection_permissions: { required: ['websiteContent'] },
        },
        // Firefox for Android reads data_collection_permissions from 142 on
        gecko_android: { strict_min_version: '142.0' },
      },
    }),
  }),
  zip: {
    // The sources archive goes to Firefox reviewers: only what the build needs, nothing else from the folder.
    includeSources: [
      'entrypoints/**',
      'src/**',
      'public/**',
      'package.json',
      'package-lock.json',
      'tsconfig.json',
      'wxt.config.ts',
      'README.md',
      'LICENSE',
    ],
  },
});
