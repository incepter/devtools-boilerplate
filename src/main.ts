import {libDisplayName} from "./shared";

window.chrome.devtools.panels.create(libDisplayName, "", "index.html");
