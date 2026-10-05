# reskins.gg browser extension

Adds an **Open in 3D** button next to Steam's **Inspect in Game** for CS2 items. The button opens
the same item, with its pattern, wear, stickers and charms, on [reskins.gg](https://reskins.gg) in a
new tab.

Works in Chrome, Edge, Opera, Brave and Firefox.

## Where the button shows up

- Steam Community Market listing pages for CS2: in every listing row of the classic market and in
  the listing dialog of the new market.
- Steam inventories (`/id/…/inventory`, `/profiles/…/inventory`): in the panel of the selected item.

Items whose Steam link does not carry the item itself (old `S…A…D…` and `M…A…D…` links) get no
button.

## Privacy and permissions

- The extension asks for no permissions. It only runs content scripts on the market listing and
  inventory pages of `steamcommunity.com`.
- It reads one thing: the `href` of Steam's Inspect in Game link. The item data in that link is
  passed to reskins.gg as is, in the address of the page that opens when you click the button.
  Nothing leaves the browser before that click. The stores list this as "website content".
- It does not read cookies, session data, trade offers or profile data, makes no network requests
  of its own and has no analytics.
- The new tab is opened with `noreferrer`, so reskins.gg does not learn which Steam page you came
  from.

## Development

Requires Node.js 22 or newer.

```sh
npm install
npm run dev            # Chromium with live reload
npm run dev:firefox    # Firefox with live reload
npm run build          # .output/chrome-mv3
npm run build:firefox  # .output/firefox-mv3
npm run zip            # store archives
npm run zip:firefox
npm run compile        # type check
npm run lint
npm test
```

### Reproducing the store build

The store packages were built on Windows 11 with Node.js 24.12.0 and npm 11.6.2. Any OS with Node.js 22
or newer works.

```sh
npm ci
npm run build:firefox  # output: .output/firefox-mv3
npm run build          # output: .output/chrome-mv3
```

To load a build by hand: open `chrome://extensions`, enable developer mode and choose
**Load unpacked** with `.output/chrome-mv3`. In Firefox, open `about:debugging#/runtime/this-firefox`
and choose **Load Temporary Add-on** with `.output/firefox-mv3/manifest.json`.

## License

[MIT](LICENSE)
