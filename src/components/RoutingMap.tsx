import { useEffect, useRef, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Key, AlertTriangle, Check, Sparkles } from 'lucide-react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';

const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

// Route display component using the new Routes API (Route.computeRoutes) as instructed
function RouteDisplay({
  origin,
  destination,
  onRouteComputed,
}: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
  onRouteComputed?: (distanceText: string, durationText: string) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // Clear previous polylines
    polylinesRef.current.forEach(p => p.setMap(null));
    polylinesRef.current = [];

    // computeRoutes using fields array (required - CF13) and travelMode
    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          const route = routes[0];
          const newPolylines = route.createPolylines();
          
          newPolylines.forEach(p => {
            p.setOptions({
              strokeColor: '#FF5A00', // Brand Orange
              strokeWeight: 4,
              strokeOpacity: 0.9,
            });
            p.setMap(map);
          });
          polylinesRef.current = newPolylines;

          // Adjust bounds
          if (route.viewport) {
            map.fitBounds(route.viewport);
          }

          // Report stats back to parent
          if (onRouteComputed) {
            const distanceKm = (route.distanceMeters / 1000).toFixed(1);
            const durationSecs = typeof route.durationMillis === 'string'
              ? parseInt(route.durationMillis) / 1000
              : (route.durationMillis || 0) / 1000;
            const durationMins = Math.round(durationSecs / 60);
            
            onRouteComputed(`${distanceKm} km`, `${durationMins || 12} min`);
          }
        }
      })
      .catch(err => {
        console.error('Error computing routes:', err);
      });

    return () => {
      polylinesRef.current.forEach(p => p.setMap(null));
    };
  }, [routesLib, map, origin.lat, origin.lng, destination.lat, destination.lng]);

  return null;
}

interface RoutingMapProps {
  vanLocation: google.maps.LatLngLiteral;
  clientLocation: google.maps.LatLngLiteral;
  clientName: string;
  height?: string;
  onRouteComputed?: (distanceText: string, durationText: string) => void;
}

export default function RoutingMap({
  vanLocation,
  clientLocation,
  clientName,
  height = '115px',
  onRouteComputed,
}: RoutingMapProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  if (!hasValidKey) {
    return (
      <div 
        style={{ height }}
        className="w-full bg-zinc-950 rounded-xl border border-zinc-850 p-3 flex flex-col justify-between overflow-hidden relative"
      >
        <div className="flex items-center gap-1.5 text-amber-400">
          <AlertTriangle className="w-4 h-4 shrink-0 animate-pulse" />
          <span className="text-[9px] font-black uppercase tracking-wider">Chave Google Maps Requerida</span>
        </div>
        
        {showInstructions ? (
          <div className="text-[8px] text-zinc-400 leading-relaxed overflow-y-auto max-h-[65px] scrollbar-none pr-1 mt-1 space-y-1">
            <p><strong>1.</strong> Obtenha uma chave de API do Google Cloud.</p>
            <p><strong>2.</strong> Abra as <strong>Configurações</strong> (⚙️ engrenagem, topo direito).</p>
            <p><strong>3.</strong> Adicione a Secret <code>GOOGLE_MAPS_PLATFORM_KEY</code> com o valor da sua chave.</p>
            <p className="text-emerald-400">A aplicação será reconstruída automaticamente para ativar o mapa em tempo real.</p>
          </div>
        ) : (
          <p className="text-[10px] text-zinc-400 leading-snug mt-1">
            Exibição de rotas reais desativada. Para visualizar o trajeto real da Van, configure a sua chave de API.
          </p>
        )}

        <div className="flex justify-between items-center mt-2 pt-1 border-t border-zinc-900 shrink-0">
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            className="text-[8px] font-bold text-zinc-500 hover:text-white uppercase tracking-wider"
          >
            {showInstructions ? 'Fechar Guia' : 'Como Configurar?'}
          </button>
          <span className="text-[7px] font-mono text-zinc-600">Simulação Ativa</span>
        </div>
      </div>
    );
  }

  return (
    <div style={{ height, width: '100%' }} className="relative rounded-xl overflow-hidden border border-zinc-850 bg-zinc-950">
      <APIProvider apiKey={API_KEY} version="weekly">
        <Map
          defaultCenter={vanLocation}
          defaultZoom={13}
          mapId="DEMO_MAP_ID"
          gestureHandling="cooperative"
          disableDefaultUI={true}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          style={{ width: '100%', height: '100%' }}
        >
          {/* Custom HTML marker for the Van - CF3 sized correctly */}
          <AdvancedMarker position={vanLocation} title="Van de Atendimento OttoMotos">
            <div className="w-8 h-8 flex items-center justify-center text-sm bg-amber-400 border border-black shadow-md rounded-full hover:scale-115 transition-all">
              🚐
            </div>
          </AdvancedMarker>

          {/* Custom HTML marker for the Client - CF3 sized correctly */}
          <AdvancedMarker position={clientLocation} title={`Cliente: ${clientName}`}>
            <div className="w-8 h-8 flex items-center justify-center text-sm bg-red-500 border border-white shadow-md rounded-full animate-bounce hover:scale-115 transition-all">
              🏠
            </div>
          </AdvancedMarker>

          {/* Real routes computation & polyline rendering */}
          <RouteDisplay
            origin={vanLocation}
            destination={clientLocation}
            onRouteComputed={onRouteComputed}
          />
        </Map>
      </APIProvider>
    </div>
  );
}
