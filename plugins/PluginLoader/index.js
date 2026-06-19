import { storage } from "@vendetta/plugin";
import { React } from "@vendetta/metro/common";
import patchSidebar from "./SidebarPatcher.js";
import PluginLoaderSettings from "./Settings.js";

if (!storage.settings) storage.settings = {};
if (storage.settings.addToSidebar === undefined) storage.settings.addToSidebar = true;

let unpatchSidebar = null;

export const settings = (props) => React.createElement(PluginLoaderSettings, { ...props, storage });

export function onLoad() {
  try { unpatchSidebar = patchSidebar(); } catch {}
}

export function onUnload() {
  try { unpatchSidebar?.(); } catch {}
}
