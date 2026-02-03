"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

// --- DATA ---
// Optimized local asset paths for better performance
const universities = [
  { 
    name: "UniMAP", 
    niche: "Electronic & Digital Tech",
    coords: [6.4604, 100.3477] as [number, number], 
    logo: "/images/logos/unimap.webp",
    image: "/images/universities/unimap.webp"
  },
  { 
    name: "UMPSA", 
    niche: "Chemical & Automotive",
    coords: [3.5435, 103.4287] as [number, number], 
    logo: "/images/logos/umpsa.webp",
    image: "/images/universities/umpsa.webp"
  },
  { 
    name: "UTeM", 
    niche: "Advanced Manufacturing",
    coords: [2.3138, 102.3180] as [number, number], 
    logo: "/images/logos/utem.webp",
    image: "/images/universities/utem.webp"
  },
  { 
    name: "UTHM", 
    niche: "Sustainable Tech & Rail",
    coords: [1.8596, 103.0858] as [number, number], 
    logo: "/images/logos/uthm.webp",
    image: "/images/universities/uthm.webp"
  }
];

const mtunHub = {
  name: "MTUN Hub",
  coords: [3.1390, 101.6869] as [number, number],
  logo: "/images/logos/mtun.webp"
};

// --- CUSTOM MARKER ICONS ---

const createUniIcon = (logoUrl: string) => {
  if (typeof window === 'undefined') return null;
  const size = 54;
  return L.divIcon({
    className: "custom-uni-marker",
    // Explicit width/height in style to prevent CLS
    html: `
      <div class="uni-marker-container" style="width: ${size}px; height: ${size + 20}px;">
        <div class="glass-card-wrapper">
          <div class="glass-card" style="width: ${size}px; height: ${size}px;">
            <div class="logo-frame" style="background-image: url('${logoUrl}')"></div>
          </div>
        </div>
        <div class="marker-anchor"></div>
      </div>
    `,
    iconSize: [size, size + 20],
    iconAnchor: [size / 2, size + 10],
    popupAnchor: [0, -size],
  });
};

const createHubIcon = (logoUrl: string) => {
  if (typeof window === 'undefined') return null;
  const size = 80;
  return L.divIcon({
    className: "custom-hub-marker",
    html: `
      <div class="hub-marker-container" style="width: ${size}px; height: ${size}px;">
        <div class="hub-radar-pulse"></div>
        <div class="hub-logo-circle" style="width: 64px; height: 64px;">
          <div class="logo-frame" style="background-image: url('${logoUrl}')"></div>
        </div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
};

export default function MtunMap() {
  const [mounted, setMounted] = useState(false);
  const [uniIcons, setUniIcons] = useState<L.DivIcon[]>([]);
  const [hubIcon, setHubIcon] = useState<L.DivIcon | null>(null);

  useEffect(() => {
    setMounted(true);
    setUniIcons(universities.map(uni => createUniIcon(uni.logo) as L.DivIcon));
    setHubIcon(createHubIcon(mtunHub.logo) as L.DivIcon);
  }, []);

  if (!mounted || uniIcons.length === 0 || !hubIcon) {
    return (
      <div className="w-full h-[600px] bg-slate-50 rounded-[3rem] flex items-center justify-center border border-slate-200 shadow-inner">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-[3rem] overflow-hidden border border-white/40 shadow-[0_30px_60px_rgba(0,0,0,0.12)] bg-white/30 backdrop-blur-md group">
      <MapContainer
        center={[4.2105, 101.9758]}
        zoom={7}
        scrollWheelZoom={false}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        {/* Central Hub Marker */}
        <Marker position={mtunHub.coords} icon={hubIcon}>
          <Popup className="premium-popup">
            <div className="overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl shadow-2xl border border-white/50 min-w-[260px]">
              <div className="h-24 bg-blue-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '12px 12px' }} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img src={mtunHub.logo} alt="MTUN Logo" className="h-12 brightness-0 invert" />
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-md">Network Hub</span>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" aria-hidden="true" />
                </div>
                <h3 className="text-blue-950 font-black text-xl mb-1">MTUN Central</h3>
                <p className="text-slate-500 text-xs font-bold mb-6 uppercase tracking-widest">Strategic Coordination Center</p>
                <Link 
                  href="/about" 
                  aria-label="Enter MTUN Hub Interface"
                  className="flex items-center justify-center w-full py-3 bg-blue-600 text-white text-xs font-black rounded-2xl hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-blue-200"
                >
                  ENTER HUB INTERFACE
                </Link>
              </div>
            </div>
          </Popup>
        </Marker>

        {/* University Markers & Connections */}
        {universities.map((uni, idx) => (
          <React.Fragment key={idx}>
            <Marker position={uni.coords} icon={uniIcons[idx]}>
              <Popup className="premium-popup">
                <div className="overflow-hidden rounded-3xl bg-white/90 backdrop-blur-2xl shadow-2xl border border-white/50 min-w-[260px]">
                  <div className="h-24 relative overflow-hidden">
                    <img src={uni.image} alt={`${uni.name} Campus`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black uppercase rounded-md shadow-lg">
                        {uni.niche}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-blue-950 font-black text-xl">{uni.name}</h3>
                      <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Strategic Node: Active</span>
                    </div>
                    <p className="text-slate-500 text-xs font-medium mb-6 leading-relaxed">
                      Leading excellence in {uni.niche.toLowerCase()} research and industrial application.
                    </p>
                    <Link 
                      href="/about" 
                      aria-label={`View node profile for ${uni.name}`}
                      className="flex items-center justify-center w-full py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-slate-200"
                    >
                      VIEW NODE PROFILE
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
            
            <Polyline
              positions={[uni.coords, mtunHub.coords]}
              pathOptions={{
                color: "#3b82f6",
                weight: 2,
                dashArray: "10, 20",
                opacity: 0.5,
                className: "cinematic-flow-line"
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      <style jsx global>{`
        .custom-uni-marker, .custom-hub-marker {
          background: none !important;
          border: none !important;
        }
        
        .uni-marker-container {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          perspective: 1000px;
          cursor: pointer;
        }

        .glass-card-wrapper {
          animation: cinematic-float 4s infinite ease-in-out;
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          z-index: 2;
        }

        .uni-marker-container:hover .glass-card-wrapper {
          transform: scale(1.2) rotateY(10deg) translateY(-10px);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1), 0 5px 15px rgba(59, 130, 246, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transform: rotateX(15deg);
        }

        .logo-frame {
          width: 80%;
          height: 80%;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .marker-anchor {
          width: 2px;
          height: 15px;
          background: linear-gradient(to bottom, #3b82f6, transparent);
          margin-top: -5px;
          z-index: 1;
        }

        .hub-marker-container {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .hub-logo-circle {
          background: white;
          border-radius: 50%;
          border: 3px solid #3b82f6;
          box-shadow: 0 0 30px rgba(59, 130, 246, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
          transition: transform 0.3s ease;
        }

        .hub-marker-container:hover .hub-logo-circle {
          transform: scale(1.1);
        }

        .hub-radar-pulse {
          position: absolute;
          width: 100px;
          height: 100px;
          border: 2px solid #3b82f6;
          border-radius: 50%;
          animation: hub-radar 2s infinite;
          pointer-events: none;
        }

        @keyframes hub-radar {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }

        @keyframes cinematic-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        .cinematic-flow-line {
          stroke-dasharray: 10, 20;
          animation: flow-to-center 2s linear infinite;
        }

        @keyframes flow-to-center {
          from { stroke-dashoffset: 30; }
          to { stroke-dashoffset: 0; }
        }

        .premium-popup .leaflet-popup-content-wrapper {
          background: transparent !important;
          box-shadow: none !important;
          padding: 0 !important;
        }

        .premium-popup .leaflet-popup-content {
          margin: 0 !important;
          width: auto !important;
        }

        .premium-popup .leaflet-popup-tip-container {
          display: none;
        }

        .leaflet-container {
          background: #f8fafc !important;
        }
      `}</style>
    </div>
  );
}
