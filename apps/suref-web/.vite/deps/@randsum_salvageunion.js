import {
  Tt
} from "./chunk-TLPAMS3X.js";
import "./chunk-V4OQ3NZ2.js";

// ../../node_modules/.bun/@randsum+salvageunion@0.37.0/node_modules/@randsum/salvageunion/dist/index.js
import { SalvageUnionReference as o, resultForTable as p } from "salvageunion-reference";
function m(e) {
  let a = e === "Mechapult" ? o.Systems.find((l) => l.name === e) : o.RollTables.find((l) => l.name === e);
  if (!a) throw Error(`Invalid Salvage Union table name: "${e}"`);
  return a.table;
}
function S(e = "Core Mechanic") {
  let { total: a, rolls: l } = Tt({ sides: 20 }), r = m(e), { result: t, key: n } = p(r, a), [i, ...s] = t.split(":"), c = s.join(":").trim();
  return { rolls: l, result: { key: n, label: String(i).trim(), description: c, table: r, tableName: e, roll: a } };
}
var b = ["NPC Action", "Reaction Roll", "Morale", "Core Mechanic", "Group Initiative", "Retreat", "Critical Damage", "Critical Injury", "Reactor Overload", "Area Salvage", "Mech Salvage", "Crawler Deterioration", "Crawler Damage", "Crawler Destruction", "Keepsake", "Motto", "Pilot Appearance", "AI Personality", "Quirks", "Mech Appearance", "Mech Pattern Names", "Crawler Name", "Mechapult"];
export {
  b as SALVAGE_UNION_TABLE_NAMES,
  S as rollTable
};
//# sourceMappingURL=@randsum_salvageunion.js.map
