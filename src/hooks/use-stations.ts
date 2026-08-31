"use client";

import { useCallback, useEffect, useState } from "react";

import { stations as fallbackStations } from "@/data/mock-data";
import type { Station, StationsResponse } from "@/types";

export function useStations(refreshInterval = 30_000) {
  const [stations, setStations] = useState<Station[]>(fallbackStations);
  const [source, setSource] = useState<StationsResponse["source"]>("fallback");
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/stations", { cache: "no-store" });
      if (!response.ok) throw new Error(`Station API returned ${response.status}`);
      const body = (await response.json()) as StationsResponse;
      setStations(body.stations);
      setSource(body.source);
    } catch (error) {
      console.error("Unable to refresh stations:", error);
      setSource("fallback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initialTimer = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => void refresh(), refreshInterval);
    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [refresh, refreshInterval]);

  return { stations, source, loading, refresh };
}
