"use client";

import { Fragment, useEffect, useRef } from "react";
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

import type { RiskLevel, Station } from "@/types";

export type GeographicMapProps = {
  stations: Station[];
  selectedId: string;
  multiplier: number;
  showDensity: boolean;
  onSelect: (stationId: string) => void;
};

const VIETNAM_CENTER: LatLngExpression = [14.5, 109.5];

const riskColors: Record<RiskLevel, string> = {
  critical: "#b91c1c",
  high: "#f97316",
  medium: "#f59e0b",
  low: "#10b981",
};

const riskLabels: Record<RiskLevel, string> = {
  critical: "Rất cao",
  high: "Cao",
  medium: "Trung bình",
  low: "Thấp",
};

const archipelagos = [
  {
    id: "hoang-sa",
    name: "Quần đảo Hoàng Sa",
    position: [16.5, 112] as LatLngExpression,
  },
  {
    id: "truong-sa",
    name: "Quần đảo Trường Sa",
    position: [9.42, 114.42] as LatLngExpression,
  },
];

function MapResizeFix() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const updateSize = () => map.invalidateSize({ animate: false });
    const firstTimer = window.setTimeout(updateSize, 0);
    const secondTimer = window.setTimeout(updateSize, 350);
    const observer = new ResizeObserver(updateSize);

    observer.observe(container);
    window.addEventListener("resize", updateSize);

    return () => {
      window.clearTimeout(firstTimer);
      window.clearTimeout(secondTimer);
      observer.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [map]);

  return null;
}

function MapFocus({ station }: { station?: Station }) {
  const map = useMap();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (!station) {
      return;
    }

    map.flyTo([station.latitude, station.longitude], Math.max(map.getZoom(), 13), {
      animate: true,
      duration: 0.8,
    });
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
  const selected = stations.find((station) => station.id === selectedId);

  return (
    <div className="relative h-full min-h-[420px] w-full overflow-hidden bg-[#0b2942]">
      <MapContainer
        center={VIETNAM_CENTER}
        zoom={5}
        minZoom={4}
        maxZoom={19}
        scrollWheelZoom
        zoomControl
        className="h-full min-h-[420px] w-full"
      >
        <TileLayer
          attribution="Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          crossOrigin="anonymous"
        />

        <TileLayer
          attribution="Labels &copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          minZoom={4}
          maxZoom={19}
          opacity={0.95}
          zIndex={250}
          crossOrigin="anonymous"
        />

        <MapResizeFix />
        <MapFocus station={selected} />

        {archipelagos.map((archipelago) => (
          <CircleMarker
            key={archipelago.id}
            center={archipelago.position}
            radius={8}
            pathOptions={{
              color: "#ffffff",
              fillColor: "#dc2626",
              fillOpacity: 1,
              opacity: 1,
              weight: 3,
            }}
          >
            <Tooltip permanent direction="top" offset={[0, -9]} opacity={1}>
              <span className="block whitespace-nowrap text-center font-black text-red-700">
                {archipelago.name}
              </span>
              <span className="block text-center text-[10px] font-black uppercase tracking-[0.14em] text-red-600">
                Việt Nam
              </span>
            </Tooltip>

            <Popup>
              <div className="min-w-[220px] text-center">
                <strong className="text-red-700">{archipelago.name}</strong>
                <p className="mt-1 text-xs font-extrabold tracking-wider text-red-600">
                  VIỆT NAM
                </p>
                <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                  Nhãn địa danh tiếng Việt do MosGuardX chủ động hiển thị. Điểm
                  đánh dấu mang tính đại diện, không thể hiện ranh giới pháp lý.
                </p>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {stations.map((station) => {
          const active = station.id === selectedId;
          const value = Math.round(station.mosquitoCount * multiplier);
          const color = riskColors[station.risk];
          const markerRadius = Math.min(30, Math.max(11, 10 + value / 8));
          const densityRadius = Math.max(350, value * 12);

          return (
            <Fragment key={station.id}>
              {showDensity && (
                <Circle
                  center={[station.latitude, station.longitude]}
                  radius={densityRadius}
                  pathOptions={{
                    color,
                    fillColor: color,
                    fillOpacity: active ? 0.25 : 0.15,
                    opacity: active ? 0.65 : 0.35,
                    weight: active ? 2 : 1,
                  }}
                  eventHandlers={{ click: () => onSelect(station.id) }}
                />
              )}

              <CircleMarker
                center={[station.latitude, station.longitude]}
                radius={active ? markerRadius + 4 : markerRadius}
                pathOptions={{
                  color: active ? "#10251f" : "#ffffff",
                  fillColor: color,
                  fillOpacity: station.online ? 0.94 : 0.5,
                  opacity: 1,
                  weight: active ? 4 : 3,
                }}
                eventHandlers={{ click: () => onSelect(station.id) }}
              >
                <Tooltip direction="top" offset={[0, -8]} opacity={1}>
                  <div className="min-w-[170px]">
                    <strong className="text-[#16352a]">{station.name}</strong>
                    <div className="mt-1 text-xs text-slate-500">
                      {station.district}
                    </div>
                    <div className="mt-2 text-xs font-semibold" style={{ color }}>
                      {value} muỗi · Nguy cơ {riskLabels[station.risk]}
                    </div>
                  </div>
                </Tooltip>

                <Popup>
                  <div className="min-w-[190px]">
                    <strong className="text-[#16352a]">{station.name}</strong>
                    <div className="mt-1 text-xs text-slate-500">
                      {station.district}
                    </div>
                    <div className="mt-2 text-xs font-semibold" style={{ color }}>
                      {value} muỗi · Nguy cơ {riskLabels[station.risk]}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {station.online ? "Đang kết nối" : "Mất kết nối"}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          );
        })}
      </MapContainer>

    </div>
  );
}