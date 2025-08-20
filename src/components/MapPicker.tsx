import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

type Props = {
  apiKey: string;
  value: { lat: number; lng: number } | null;
  onChange: (coords: { lat: number; lng: number }) => void;
  height?: string;
};

const containerStyle = { width: "100%", height: "100%" } as const;

const MapPicker: React.FC<Props> = ({ apiKey, value, onChange, height = "300px" }) => {
  const { isLoaded } = useLoadScript({ googleMapsApiKey: apiKey });

  const center = value || { lat: 37.7749, lng: -122.4194 }; // default SF

  if (!isLoaded) return <div className="text-sm text-gray-500">Loading map…</div>;

  return (
    <div style={{ width: "100%", height }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onClick={(e) => {
          if (e.latLng) onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }}
      >
        {value && <Marker position={value} draggable onDragEnd={(e) => {
          if (e.latLng) onChange({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }} />}
      </GoogleMap>
    </div>
  );
};

export default MapPicker;


