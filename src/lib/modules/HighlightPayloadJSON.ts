import type { payload } from "./Payloads";

enum entity_map {
  "&" = "&amp;",
  "<" = "&lt;",
  ">" = "&gt;",
  '"' = "&quot;",
  "'" = "&#39;",
  "`" = "&#x60;",
  "=" = "&#x3D;"
}

export default function HighlightPayloadJSON(json: payload | string){
  json = JSON.stringify(json, null, 2).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+]?\d+)?)/g, (match) => {
    let cls = "number";
    if(/^"/.test(match)){
      if(/:$/.test(match)) cls = "key";
      else cls = "string";
    } else if(/true|false/.test(match)){
      cls = "boolean";
    } else if(/null/.test(match)){
      cls = "null";
    }
    return `<span class=${cls}>${match}</span>`;
  });
}