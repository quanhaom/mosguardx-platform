"use client";

import { useEffect } from "react";
import type { LatLngExpression } from "leaflet";
import {
  Circle,
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import type {
  RiskLevel,
  Station,
} from "@/types";

export type GeographicMapProps = {
  stations: Station[];
  selectedId: string;
  multiplier: number;
  showDensity: boolean;
  onSelect: (stationId: string) => void;
};

const HANOI_CENTER: LatLngExpression = [
  21.0285,
  105.8542,
];

const riskColors: Record<
  RiskLevel,
  string
> = {
  critical: "#b91c1c",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#10b981",
};

const riskLabels: Record<
  RiskLevel,
  string
> = {
  critical: "Rất cao",
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

function MapFocus({
  station,
}: {
  station?: Station;
}) {
  const map = useMap();

  useEffect(() => {
    if (!station) {
      return;
    }

    map.flyTo(
      [
        station.latitude,
        station.longitude,
      ],
      Math.max(map.getZoom(), 13),
      {
        animate: true,
        duration: 0.8,
      },
    );
  }, [map, station]);

  return null;
}

export default function GeographicMap({
  stations,
  selectedId,
  multiplier,
  showDensity,
  onSelect,
}: GeographicMapProps) {
  const selected = stations.find(
    (station) =>
      station.id === selectedId,
  );

  return (
    <MapContainer
      center={HANOI_CENTER}
      zoom={12}
      minZoom={5}
      maxZoom={19}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <MapFocus station={selected} />

      {stations.map((station) => {
        const active =
          station.id === selectedId;

        const value = Math.round(
          station.mosquitoCount *
            multiplier,
        );

        const color =
          riskColors[station.risk];

        const markerRadius = Math.min(
          30,
          Math.max(
            11,
            10 + value / 8,
          ),
        );

        const densityRadius =
          Math.max(350, value * 12);

        return (
          <div key={station.id}>
            {showDensity && (
              <Circle
                center={[
                  station.latitude,
                  station.longitude,
                ]}
                radius={densityRadius}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: active
                    ? 0.22
                    : 0.12,
                  opacity: active
                    ? 0.55
                    : 0.25,
                  weight: active ? 2 : 1,
                }}
                eventHandlers={{
                  click: () =>
                    onSelect(
                      station.id,
                    ),
                }}
              />
            )}

            <CircleMarker
              center={[
                station.latitude,
                station.longitude,
              ]}
              radius={
                active
                  ? markerRadius + 4
                  : markerRadius
              }
              pathOptions={{
                color: active
                  ? "#10251f"
                  : "#ffffff",
                fillColor: color,
                fillOpacity: station.online
                  ? 0.92
                  : 0.45,
                opacity: 1,
                weight: active ? 4 : 3,
              }}
              eventHandlers={{
                click: () =>
                  onSelect(station.id),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -10]}
                opacity={0.96}
              >
                <strong>
                  {station.name}
                </strong>

                <br />

                {station.district} ·{" "}
                {value} lượt ghi nhận
              </Tooltip>

              <Popup>
                <div className="min-w-[190px]">
                  <strong>
                    {station.name}
                  </strong>

                  <p>
                    {station.district},
                    Hà Nội
                  </p>

                  <p>
                    Mật độ minh họa:{" "}
                    {value}
                  </p>

                  <p>
                    Mức nguy cơ:{" "}
                    {
                      riskLabels[
                        station.risk
                      ]
                    }
                  </p>

                  <p>
                    Trạng thái:{" "}
                    {station.online
                      ? "Trực tuyến"
                      : "Mất kết nối"}
                  </p>
                </div>
              </Popup>
            </CircleMarker>
          </div>
        );
      })}
    </MapContainer>
  );
}