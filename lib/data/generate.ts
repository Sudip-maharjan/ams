import * as fs from "fs";
import { fileURLToPath } from "url";
import * as path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface Province {
  province_id: number;
  name: string;
  nepali_name: string;
}

interface District {
  district_id: number;
  name: string;
  nepali_name: string;
  province_id: number;
}

interface LocalLevelType {
  local_level_type_id: number;
  name: string;
  nepali_name: string;
}

interface Municipality {
  municipality_id: number;
  name: string;
  nepali_name: string;
  district_id: number;
  local_level_type_id: number;
}

function readJson<T>(filename: string): T[] {
  const filePath = path.join(__dirname, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw) as T[];
}

const provinces = readJson<Province>("provinces.json");
const districts = readJson<District>("districts.json");
const localLevTypes = readJson<LocalLevelType>("local_level_type.json");
const municipalities = readJson<Municipality>("local_levels.json");

const localLevelTypeMap = new Map<number, string>(
  localLevTypes.map((t) => [t.local_level_type_id, t.name]),
);

export const PROVINCES: string[] = provinces.map((p) => p.name);

export const DISTRICTS_BY_PROVINCE: Record<string, string[]> = {};
for (const province of provinces) {
  DISTRICTS_BY_PROVINCE[province.name] = districts
    .filter((d) => d.province_id === province.province_id)
    .map((d) => d.name);
}

export const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> = {};
for (const district of districts) {
  const munis = municipalities
    .filter((m) => m.district_id === district.district_id)
    .map((m) =>
      `${m.name} ${localLevelTypeMap.get(m.local_level_type_id) ?? ""}`.trim(),
    );

  if (munis.length > 0) {
    MUNICIPALITIES_BY_DISTRICT[district.name] = munis;
  }
}

console.log(
  "export const PROVINCES =",
  JSON.stringify(PROVINCES, null, 2),
  ";\n",
);
console.log(
  "export const DISTRICTS_BY_PROVINCE: Record<string, string[]> =",
  JSON.stringify(DISTRICTS_BY_PROVINCE, null, 2),
  ";\n",
);
console.log(
  "export const MUNICIPALITIES_BY_DISTRICT: Record<string, string[]> =",
  JSON.stringify(MUNICIPALITIES_BY_DISTRICT, null, 2),
  ";",
);
