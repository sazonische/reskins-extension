import { defineContentScript } from 'wxt/utils/define-content-script';
import { inventoryPageAdapter } from '../src/steam/inventory/inventoryPageAdapter';
import { mountOpenIn3dActions } from '../src/ui/mountOpenIn3dActions';

export default defineContentScript({
  matches: ['https://steamcommunity.com/id/*/inventory*', 'https://steamcommunity.com/profiles/*/inventory*'],
  main(contentScriptContext) {
    contentScriptContext.onInvalidated(mountOpenIn3dActions(inventoryPageAdapter));
  },
});
