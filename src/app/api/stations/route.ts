import { NextResponse } from "next/server";

import { stations as stationMetadata } from "@/data/mock-data";
import type { RiskLevel, Station } from "@/types";

export const dynamic = "force-dynamic";

type UnknownRecord = Record<string, unknown>;

function record(value: unknown): UnknownRecord {
  return value && typeof value === "object" ? (value as UnknownRecord) : {};
}

function numberOrNull(...values: unknown[]) {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function stringOrNull(...values: unknown[]) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function listFromPayload(payload: unknown, keys: string[]) {
  if (Array.isArray(payload)) return payload;
  const source = record(payload);
  for (const key of keys) {
    if (Array.isArray(source[key])) return source[key] as unknown[];
  }
  return [];
}

function stationId(value: UnknownRecord) {
  return stringOrNull(value.id, value.station_id, value.stationId, value.code);
}

function observationStationId(value: UnknownRecord) {
  const nestedStation = record(value.station);
  return stringOrNull(
    value.station_id,
    value.stationId,
    nestedStation.id,
    typeof value.station === "string" ? value.station : null,
  );
}

function risk(value: unknown, fallback: RiskLevel): RiskLevel {
  return value === "low" || value === "medium" || value === "high" || value === "critical"
    ? value
    : fallback;
}

function asTimestamp(value: UnknownRecord) {
  return stringOrNull(
    value.captured_at,
    value.received_at,
    value.created_at,
    value.updated_at,
  );
}

function isNewer(candidate: UnknownRecord, current?: UnknownRecord) {
  if (!current) return true;
  const candidateTime = Date.parse(asTimestamp(candidate) ?? "");
  const currentTime = Date.parse(asTimestamp(current) ?? "");
  if (Number.isNaN(candidateTime)) return false;
  return Number.isNaN(currentTime) || candidateTime > currentTime;
}

async function getJson(url: string) {
  const response = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json() as Promise<unknown>;
}

export async function GET() {
  const apiUrl = process.env.AI_API_URL?.replace(/\/+$/, "");
  if (!apiUrl) {
    return NextResponse.json({
      stations: stationMetadata,
      source: "fallback",
      updatedAt: new Date().toISOString(),
    });
  }

  try {
    const [stationResult, observationResult, alertResult] = await Promise.allSettled([
      getJson(`${apiUrl}/v1/stations`),
      getJson(`${apiUrl}/v1/observations?limit=200`),
      getJson(`${apiUrl}/v1/alerts?limit=200`),
    ]);

    if (stationResult.status === "rejected") throw stationResult.reason;

    const rawStations = listFromPayload(stationResult.value, ["stations", "items", "data"]);
    const rawObservations = observationResult.status === "fulfilled"
      ? listFromPayload(observationResult.value, ["observations", "items", "data"])
      : [];
    const rawAlerts = alertResult.status === "fulfilled"
      ? listFromPayload(alertResult.value, ["alerts", "items", "data"])
      : [];

    const latestByStation = new Map<string, UnknownRecord>();
    for (const item of rawObservations) {
      const observation = record(item);
      const id = observationStationId(observation);
      if (id && isNewer(observation, latestByStation.get(id))) {
        latestByStation.set(id, observation);
      }
    }

    const latestAlertByStation = new Map<string, UnknownRecord>();
    for (const item of rawAlerts) {
      const alert = record(item);
      if (alert.status === "resolved") continue;
      const id = observationStationId(alert);
      if (id && isNewer(alert, latestAlertByStation.get(id))) {
        latestAlertByStation.set(id, alert);
      }
    }

    const metadataById = new Map(stationMetadata.map((item) => [item.id, item]));
    const stations: Station[] = rawStations.flatMap((item) => {
      const rawStation = record(item);
      const id = stationId(rawStation);
      if (!id) return [];

      const metadata = metadataById.get(id);
      const nestedLatest = record(rawStation.latest_observation ?? rawStation.latestObservation);
      const latest = Object.keys(nestedLatest).length ? nestedLatest : (latestByStation.get(id) ?? {});
      const latestAlert = latestAlertByStation.get(id) ?? {};
      const location = record(rawStation.location);
      const mosquitoCount = numberOrNull(
        rawStation.mosquito_count,
        rawStation.total_detected,
        latest.mosquito_count,
        latest.total_detected,
        metadata?.mosquitoCount,
      ) ?? 0;
      const stationStatus = stringOrNull(rawStation.status);

      return [{
        id,
        name: stringOrNull(rawStation.name, metadata?.name) ?? id,
        district: stringOrNull(rawStation.district, location.district, rawStation.address, metadata?.district) ?? "Chưa cập nhật",
        latitude: numberOrNull(rawStation.latitude, rawStation.lat, location.latitude, metadata?.latitude) ?? 21.0285,
        longitude: numberOrNull(rawStation.longitude, rawStation.lng, location.longitude, metadata?.longitude) ?? 105.8542,
        mosquitoCount,
        risk: risk(
          rawStation.risk
            ?? rawStation.risk_level
            ?? latest.risk
            ?? latest.risk_level
            ?? latestAlert.level,
          metadata?.risk ?? "low",
        ),
        online: typeof rawStation.online === "boolean"
          ? rawStation.online
          : stationStatus
            ? stationStatus === "online"
            : (metadata?.online ?? false),
        battery: numberOrNull(rawStation.battery, rawStation.battery_percent, latest.battery, metadata?.battery) ?? 0,
        lastSeen: stringOrNull(rawStation.last_seen_at, rawStation.last_seen, latest.received_at, latest.captured_at, metadata?.lastSeen) ?? "Chưa cập nhật",
        temperature: numberOrNull(rawStation.temperature, latest.temperature),
        humidity: numberOrNull(rawStation.humidity, latest.humidity),
        environmentUpdatedAt: stringOrNull(
          rawStation.environment_updated_at,
          latest.captured_at,
          latest.received_at,
          latest.created_at,
        ),
      }];
    });

    return NextResponse.json({
      stations: stations.length ? stations : stationMetadata,
      source: stations.length ? "live" : "fallback",
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Station API proxy error:", error);
    return NextResponse.json({
      stations: stationMetadata,
      source: "fallback",
      updatedAt: new Date().toISOString(),
    });
  }
}
