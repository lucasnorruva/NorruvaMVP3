
"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import type { GlobeMethods } from 'react-globe.gl';
import type { Feature as GeoJsonFeature, FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';
import { MeshPhongMaterial } from 'three';
import { Loader2, Info, X, Package, Truck, Ship, Plane, CalendarDays, AlertTriangle, BarChart3 } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { MOCK_DPPS } from '@/data'; 
import { MOCK_TRANSIT_PRODUCTS, MOCK_CUSTOMS_ALERTS, type TransitProduct, type CustomsAlert } from '@/data'; 
import SelectedProductCustomsInfoCard from '@/components/dpp-tracker/SelectedProductCustomsInfoCard'; 

// Dynamically import Globe for client-side rendering
const Globe = dynamic(() => import('react-globe.gl'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-white">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="ml-4 text-lg text-muted-foreground">Loading Globe...</p>
    </div>
  )
});

// Accurate list of EU member state ISO A3 codes
const EU_COUNTRY_CODES = new Set([
  'AUT', 'BEL', 'BGR', 'HRV', 'CYP', 'CZE', 'DNK', 'EST', 'FIN', 'FRA', 'DEU', 
  'GRC', 'HUN', 'IRL', 'ITA', 'LVA', 'LTU', 'LUX', 'MLT', 'NLD', 'POL', 
  'PRT', 'ROU', 'SVK', 'SVN', 'ESP', 'SWE'
]);

interface CountryProperties extends GeoJsonProperties {
  ADMIN: string; 
  ADM0_A3: string; 
  NAME_LONG?: string; 
  ISO_A3?: string; 
}

type CountryFeature = GeoJsonFeature<Geometry, CountryProperties>;

interface CountryStat {
  countryCode: string;
  count: number;
}

export default function GlobeV2Page() {
  const globeEl = useRef<GlobeMethods | undefined>(undefined);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [landPolygons, setLandPolygons] = useState<CountryFeature[]>([]);
  const [hoverD, setHoverD] = useState<CountryFeature | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [globeReady, setGlobeReady] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [highlightedCountries, setHighlightedCountries] = useState<string[]>([]);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [arcsData, setArcsData] = useState<any[]>([]);
  
  const productIdFromQuery = searchParams.get('productId');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(productIdFromQuery); 

  const [selectedProductTransitInfo, setSelectedProductTransitInfo] = useState<TransitProduct | null>(null);
  const [selectedProductAlerts, setSelectedProductAlerts] = useState<CustomsAlert[]>([]);

  const [countryFilter, setCountryFilter] = useState<'all' | 'eu' | 'productFocusArea'>('all');
  const [clickedCountryInfo, setClickedCountryInfo] = useState<CountryProperties | null>(null); 
  const [countryStatsData, setCountryStatsData] = useState<CountryStat[]>([]);
  const [maxDppCount, setMaxDppCount] = useState(1); // For scaling altitude

  const HEADER_HEIGHT = 64; 

  useEffect(() => {
    if (productIdFromQuery) {
      setSelectedProduct(productIdFromQuery);
    }
  }, [productIdFromQuery]);

  useEffect(() => {
    const updateDimensions = () => {
      if (typeof window !== 'undefined') {
        setDimensions({
          width: window.innerWidth, 
          height: window.innerHeight - HEADER_HEIGHT, 
        });
      }
    };
    updateDimensions(); 
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const handlePolygonClick = useCallback((feat: object) => { 
    setClickedCountryInfo((feat as CountryFeature).properties);
  }, []);

  const mockCountryCoordinates: { [key: string]: { lat: number; lng: number } } = useMemo(() => ({
    'Germany': { lat: 51.1657, lng: 10.4515 }, 'France': { lat: 46.6034, lng: 1.8883 },
    'Italy': { lat: 41.8719, lng: 12.5674 }, 'Spain': { lat: 40.4637, lng: -3.7492 },
    'Poland': { lat: 51.9194, lng: 19.1451 }, 'United States': { lat: 37.0902, lng: -95.7129 },
    'China': { lat: 35.8617, lng: 104.1954 }, 'Japan': { lat: 36.2048, lng: 138.2529 },
    'United Kingdom': { lat: 55.3781, lng: -3.4360 }, 'Canada': { lat: 56.1304, lng: -106.3468 },
    'India': { lat: 20.5937, lng: 78.9629 }, 'Netherlands': { lat: 52.1326, lng: 5.2913 },
    'Czechia': { lat: 49.8175, lng: 15.4730 }, 'Belgium': { lat: 50.5039, lng: 4.4699 },
    'Switzerland': { lat: 46.8182, lng: 8.2275}, 'Kenya': {lat: -0.0236, lng: 37.9062},
    'Vietnam': { lat: 14.0583, lng: 108.2772 }, 
    'Hong Kong': { lat: 22.3193, lng: 114.1694 }, 
    'Australia': { lat: -25.2744, lng: 133.7751 },
    'South Korea': { lat: 35.9078, lng: 127.7669 },
    'Shanghai': { lat: 31.2304, lng: 121.4737 }, 
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Shenzhen': { lat: 22.5431, lng: 114.0579 },
    'Ho Chi Minh City': { lat: 10.8231, lng: 106.6297 },
    'Newark': { lat: 40.7357, lng: -74.1724 },
    'Gdansk': { lat: 54.372158, lng: 18.638306 },
    'Milan': { lat: 45.4642, lng: 9.1900 },
    'Zurich': { lat: 47.3769, lng: 8.5417 },
    'Prague': { lat: 50.0755, lng: 14.4378 },
    'Nairobi': { lat: -1.2921, lng: 36.8219 },
    'DEU': { lat: 51.1657, lng: 10.4515 }, 'FRA': { lat: 46.6034, lng: 1.8883 },
    'POL': { lat: 51.9194, lng: 19.1451 }, 'CHN': { lat: 35.8617, lng: 104.1954 },
    'USA': { lat: 37.0902, lng: -95.7129 }, 'IND': { lat: 20.5937, lng: 78.9629 },
    'BEL': { lat: 50.5039, lng: 4.4699 }, 'NLD': { lat: 52.1326, lng: 5.2913 },
    'SWE': { lat: 60.1282, lng: 18.6435 },
    'UNKNOWN': { lat: 0, lng: 0}, 
  }), []);

  const getCountryFromLocationString = (locationString?: string): string | null => {
      if (!locationString) return null;
      const parts = locationString.split(',').map(p => p.trim());
      const country = parts.pop(); 
      // Check by full name or ISO A3 code
      if (country && (mockCountryCoordinates[country] || EU_COUNTRY_CODES.has(country.toUpperCase()) || mockCountryCoordinates[country.toUpperCase()])) {
          return country;
      }
      // If country not found, check if last part was a city we have coords for
      if (parts.length > 0) { 
          const city = parts.pop() || country; // Use original country if parts is empty after pop
          if (city && mockCountryCoordinates[city]) return city; 
      }
      return country || null; 
  };

  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson'
    )
      .then((res) => res.json())
      .then((geoJson: FeatureCollection<Geometry, CountryProperties>) => {
        setLandPolygons(geoJson.features);
      })
      .catch((err) => {
        console.error('Error fetching country polygons:', err);
      })
      .finally(() => {
        setDataLoaded(true);
      });

    fetch('/api/v1/dpp/country-stats')
      .then(res => res.json())
      .then((stats: CountryStat[]) => {
        setCountryStatsData(stats);
        const max = Math.max(1, ...stats.map(s => s.count)); 
        setMaxDppCount(max);
      })
      .catch(err => console.error("Error fetching country stats:", err));
  }, []);

  useEffect(() => {
    setHighlightedCountries([]); setArcsData([]); setSelectedProductTransitInfo(null);
    setSelectedProductAlerts([]); setClickedCountryInfo(null);

    if (!selectedProduct) {
      if (globeEl.current) globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.5 }, 1000);
      return;
    }

    const transitInfo = MOCK_TRANSIT_PRODUCTS.find(p => p.id === selectedProduct);
    if (transitInfo) {
        setSelectedProductTransitInfo(transitInfo);
        setSelectedProductAlerts(MOCK_CUSTOMS_ALERTS.filter(a => a.productId === selectedProduct));

        const originCountryName = getCountryFromLocationString(transitInfo.origin);
        const destinationCountryName = getCountryFromLocationString(transitInfo.destination);
        
        const originCoords = originCountryName ? (mockCountryCoordinates[originCountryName] || mockCountryCoordinates[originCountryName.toUpperCase()]) : null;
        const destinationCoords = destinationCountryName ? (mockCountryCoordinates[destinationCountryName] || mockCountryCoordinates[destinationCountryName.toUpperCase()]) : null;

        const newHighlights: string[] = [];
        if (originCountryName) newHighlights.push(originCountryName);
        if (destinationCountryName && destinationCountryName !== originCountryName) newHighlights.push(destinationCountryName);
        setHighlightedCountries(newHighlights);
        
        if (originCoords && destinationCoords) {
            setArcsData([{
            startLat: originCoords.lat, startLng: originCoords.lng,
            endLat: destinationCoords.lat, endLng: destinationCoords.lng,
            color: '#3B82F6', label: `${transitInfo.name} Transit`
            }]);
            if (globeEl.current) { 
                const midLat = (originCoords.lat + destinationCoords.lat) / 2;
                const midLng = (originCoords.lng + destinationCoords.lng) / 2;
                globeEl.current.pointOfView({ lat: midLat, lng: midLng, altitude: 2.0 }, 1000);
            }
        } else {
            setArcsData([]);
            if (globeEl.current) globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
        }
    } else { // Handle as a standard DPP for supply chain visualization
        fetch(`/api/v1/dpp/graph/${selectedProduct}`)
        .then(res => {
            if (!res.ok) throw new Error(`Failed to fetch graph data for ${selectedProduct}`);
            return res.json();
        })
        .then(graphData => {
            const countries = new Set<string>();
            let manufacturerCountry: string | null = null;
            const dpp = MOCK_DPPS.find(d => d.id === selectedProduct); // Get main DPP for manufacturer info

            if(dpp?.manufacturer?.address){
                const country = getCountryFromLocationString(dpp.manufacturer.address);
                if(country) {countries.add(country); manufacturerCountry = country;}
            } else if (dpp?.traceability?.originCountry) {
                 const country = getCountryFromLocationString(dpp.traceability.originCountry);
                 if(country) {countries.add(country); manufacturerCountry = country;}
            }

            graphData.nodes.forEach((node: any) => {
              if (node.type === 'supplier' && node.data?.location) {
                const country = getCountryFromLocationString(node.data.location);
                if (country) countries.add(country);
              }
            });
            const supplyChainCountries = Array.from(countries);
            setHighlightedCountries(supplyChainCountries);

            const newSupplyArcs = [];
            if (manufacturerCountry && supplyChainCountries.length > 0) {
                const manuCoords = mockCountryCoordinates[manufacturerCountry] || mockCountryCoordinates[manufacturerCountry.toUpperCase()];
                if (manuCoords) {
                    supplyChainCountries.forEach(countryName => {
                        if(countryName !== manufacturerCountry) {
                            const supplierCoords = mockCountryCoordinates[countryName] || mockCountryCoordinates[countryName.toUpperCase()];
                            if(supplierCoords) {
                                newSupplyArcs.push({
                                    startLat: manuCoords.lat, startLng: manuCoords.lng,
                                    endLat: supplierCoords.lat, endLng: supplierCoords.lng,
                                    color: '#F59E0B', label: `Supply: ${countryName}`
                                });
                            }
                        }
                    });
                }
            }
            setArcsData(newSupplyArcs as any[]);

            if (globeEl.current) { 
                if (countries.has('CHN') || countries.has('JPN') || countries.has('IND')) globeEl.current.pointOfView({ lat: 20, lng: 90, altitude: 2.5 }, 1000);
                else if (countries.has('USA') || countries.has('CAN')) globeEl.current.pointOfView({ lat: 45, lng: -90, altitude: 2.5 }, 1000);
                else globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
            }
        })
        .catch(err => {
            console.error("Error fetching graph for standard DPP:", err);
            setHighlightedCountries([]);
            setArcsData([]);
        });
    }
  }, [selectedProduct, mockCountryCoordinates]); 

  const isEU = useCallback((isoA3: string | undefined) => !!isoA3 && EU_COUNTRY_CODES.has(isoA3.toUpperCase()), []);
  
  useEffect(() => {
    if (!landPolygons.length) return;
    let filtered = landPolygons;
    if (countryFilter === 'eu') {
      filtered = landPolygons.filter(feat => isEU(feat.properties?.ADM0_A3 || feat.properties?.ISO_A3));
    } else if (countryFilter === 'productFocusArea' && selectedProduct && highlightedCountries.length > 0) { 
      filtered = landPolygons.filter(feat => {
        const adminName = feat.properties?.ADMIN || feat.properties?.NAME_LONG || '';
        const adm0_a3 = feat.properties?.ADM0_A3 || feat.properties?.ISO_A3 || '';
        return highlightedCountries.some(hc => adminName.toLowerCase().includes(hc.toLowerCase()) || (adm0_a3 && adm0_a3.toLowerCase() === hc.toLowerCase()));
      });
    }
    setFilteredLandPolygons(filtered);
  }, [countryFilter, landPolygons, highlightedCountries, isEU, selectedProduct]);

  const globeMaterial = useMemo(() => new MeshPhongMaterial({ color: '#a9d5e5', transparent: true, opacity: 1 }), []);

  useEffect(() => {
    if (globeEl.current && globeReady) {
      const controls = globeEl.current.controls();
      if (controls) {
        controls.autoRotate = isAutoRotating; controls.autoRotateSpeed = 0.3; 
        controls.enableZoom = true; controls.minDistance = 150; controls.maxDistance = 1000;  
      }
      if (!selectedProduct) globeEl.current.pointOfView({ lat: 50, lng: 15, altitude: 2.0 }, 1000);
    }
  }, [globeReady, isAutoRotating, selectedProduct]);
  
  const getPolygonCapColor = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    const iso = properties?.ADM0_A3 || properties?.ISO_A3;
    const name = properties?.ADMIN || properties?.NAME_LONG || '';

    if (clickedCountryInfo && (clickedCountryInfo.ADM0_A3 === iso || clickedCountryInfo.ADMIN === name) ) return '#ff4500';
    if (hoverD && (hoverD.properties.ADM0_A3 === iso || hoverD.properties.ADMIN === name)) return '#ffa500';
    
    const isHighlighted = highlightedCountries.some(hc => 
        name.toLowerCase().includes(hc.toLowerCase()) || 
        (iso && iso.toLowerCase() === hc.toLowerCase())
    );

    if (isHighlighted) {
        return isEU(iso) ? '#FFBF00' : '#f97316'; // Amber for EU supply, Orange for non-EU supply
    }
    return isEU(iso) ? '#002D62' : '#CCCCCC'; // Dark blue for EU, Grey for non-EU
  }, [isEU, highlightedCountries, clickedCountryInfo, hoverD]);

  const getPolygonAltitude = useCallback((feat: object) => {
    const properties = (feat as CountryFeature).properties;
    const iso = properties?.ADM0_A3 || properties?.ISO_A3;
    const countryStat = countryStatsData.find(stat => stat.countryCode === iso);
    const baseAltitude = 0.008;
    const maxAltitudeScale = 0.05; 
    if (countryStat && maxDppCount > 0) {
        return baseAltitude + (countryStat.count / maxDppCount) * maxAltitudeScale;
    }
    return baseAltitude;
  }, [countryStatsData, maxDppCount]);


  const handleDismissProductInfo = () => {
    setSelectedProduct(null);
    router.push(`/dpp-global-tracker-v2`, { scroll: false });
  };

  if (dimensions.width === 0 || dimensions.height === 0 || !dataLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-var(--header-height,4rem))] w-full bg-white">
        <Loader2 className="h-12 w-12 animate-spin text-primary" /><p className="ml-4 text-lg text-muted-foreground">Preparing Global Tracker...</p>
      </div>
    );
  }

  return (
    <>
      <div style={{ width: '100%', height: `calc(100vh - ${HEADER_HEIGHT}px)`, position: 'relative', background: 'white' }}>
        {typeof window !== 'undefined' && dimensions.width > 0 && dimensions.height > 0 && (
          <Globe
            ref={globeEl} globeImageUrl={null} globeMaterial={globeMaterial} backgroundColor="rgba(255, 255, 255, 1)"
            arcsData={arcsData} arcColor={'color'} arcDashLength={0.4} arcDashGap={0.1} arcDashAnimateTime={2000} arcStroke={0.5}
            showAtmosphere={false} polygonsData={filteredLandPolygons} polygonCapColor={getPolygonCapColor}
            polygonSideColor={() => 'rgba(0, 0, 0, 0.05)'} polygonStrokeColor={() => '#000000'} 
            polygonAltitude={getPolygonAltitude} 
            onPolygonHover={setHoverD as (feature: GeoJsonFeature | null) => void} onPolygonClick={handlePolygonClick} 
            polygonLabel={({ properties }: object) => {
              const p = properties as CountryProperties; const iso = p?.ADM0_A3 || p?.ISO_A3; const name = p?.ADMIN || p?.NAME_LONG || 'Country';
              const isEUCountry = isEU(iso); 
              const isHighlighted = highlightedCountries.some(hc => name.toLowerCase().includes(hc.toLowerCase()) || (iso && iso.toLowerCase() === hc.toLowerCase()));
              const stat = countryStatsData.find(s => s.countryCode === iso);
              const dppCount = stat ? stat.count : 0;
              let roleInContext = "";
              if (isHighlighted && selectedProductTransitInfo) {
                  if (getCountryFromLocationString(selectedProductTransitInfo.origin) === name) roleInContext += "Transit Origin. ";
                  if (getCountryFromLocationString(selectedProductTransitInfo.destination) === name) roleInContext += "Transit Destination. ";
              } else if (isHighlighted && selectedProduct) { // Standard DPP
                  const dpp = MOCK_DPPS.find(d => d.id === selectedProduct);
                  if (dpp?.manufacturer?.address && getCountryFromLocationString(dpp.manufacturer.address) === name) roleInContext += "Manufacturer Origin. ";
                  else if (dpp?.traceability?.originCountry && getCountryFromLocationString(dpp.traceability.originCountry) === name) roleInContext += "Product Origin. ";
                  else roleInContext = "Supply Chain Node.";
              }
              return `<div style="background: rgba(40,40,40,0.8); color: white; padding: 5px 8px; border-radius: 4px; font-size: 12px;"><b>${name}</b>${iso ? ` (${iso})` : ''}<br/>${isEUCountry ? 'EU Member' : 'Non-EU Member'}<br/>DPPs: ${dppCount.toLocaleString()}<br/>${roleInContext.trim()}</div>`;
            }}
            polygonsTransitionDuration={100} width={dimensions.width} height={dimensions.height}
            onGlobeReady={() => setGlobeReady(true)} enablePointerInteraction={true}
          />
        )}

        {dimensions.width > 0 && dimensions.height > 0 && (
          <Button className="absolute top-4 right-[170px] z-10" size="sm" onClick={() => setIsAutoRotating(!isAutoRotating)}>
            {isAutoRotating ? 'Stop Auto-Rotate' : 'Start Auto-Rotate'}
          </Button>
        )}

        <div className="absolute top-4 right-4 z-10">
         <Select onValueChange={(value) => setCountryFilter(value as 'all' | 'eu' | 'productFocusArea') } value={countryFilter}>
          <SelectTrigger className="w-[170px]"><SelectValue placeholder="Filter Countries" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem><SelectItem value="eu">EU Countries</SelectItem>
            <SelectItem value="productFocusArea" disabled={!selectedProduct}>Product Focus Area</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="absolute top-4 left-4 z-10">
       <Select
         onValueChange={(value) => {
            const newProductId = value === 'select-placeholder' ? null : value;
            setSelectedProduct(newProductId);
            if (newProductId) router.push(`/dpp-global-tracker-v2?productId=${newProductId}`, { scroll: false });
            else router.push(`/dpp-global-tracker-v2`, { scroll: false });
         }}
         value={selectedProduct || 'select-placeholder'}
       >
        <SelectTrigger className="w-[250px] sm:w-[300px]"><SelectValue placeholder="Select a Product" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="select-placeholder">Select a Product to Track</SelectItem>
          {MOCK_DPPS.map(dpp => ( 
            <SelectItem key={dpp.id} value={dpp.id}>{dpp.productName} ({dpp.id})</SelectItem>
          ))}
          {MOCK_TRANSIT_PRODUCTS.map(tp => (
             <SelectItem key={tp.id} value={tp.id}>{tp.name} (Transit ID: {tp.id})</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
        
      {clickedCountryInfo && (
        <Card className="absolute top-16 right-4 z-20 w-72 shadow-xl bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-semibold">{clickedCountryInfo.ADMIN || 'Selected Country'}</CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setClickedCountryInfo(null)}><X className="h-4 w-4" /></Button>
          </CardHeader>
          <CardContent className="text-xs space-y-1">
            <p><strong className="text-muted-foreground">ISO A3:</strong> {clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3 || 'N/A'}</p>
            <p><strong className="text-muted-foreground">DPPs Originating:</strong> {(countryStatsData.find(s => s.countryCode === (clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3))?.count || 0).toLocaleString()} </p>
            <p><strong className="text-muted-foreground">DPPs Transiting (Mock):</strong> {Math.floor(Math.random() * 20)} </p>
            {isEU(clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3) && <p className="text-green-600 font-medium">EU Member State</p>}
            {highlightedCountries.some(hc => (clickedCountryInfo.ADMIN || '').toLowerCase().includes(hc.toLowerCase()) || ((clickedCountryInfo.ADM0_A3 || clickedCountryInfo.ISO_A3 || '').toLowerCase() === hc.toLowerCase())) && <p className="text-orange-600 font-medium">Part of Focus Area</p>}
            <Button variant="link" size="sm" className="p-0 h-auto text-primary mt-2" disabled>View DPPs for {clickedCountryInfo.ADMIN?.substring(0,15) || 'Country'}... (Conceptual)</Button>
          </CardContent>
        </Card>
      )}

      {selectedProductTransitInfo && (
        <SelectedProductCustomsInfoCard 
            productTransitInfo={selectedProductTransitInfo}
            alerts={selectedProductAlerts}
            onDismiss={handleDismissProductInfo}
        />
      )}

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs p-2 rounded-md shadow-lg pointer-events-none flex items-center gap-2">
        <Info className="inline h-3 w-3" />
        <span>
            {countryFilter === 'all' ? 'EU: Dark Blue | Non-EU: Grey.' : 
            countryFilter === 'eu' ? 'Displaying EU Countries.' : 
            countryFilter === 'productFocusArea' && selectedProduct ? `Displaying Focus Area for ${MOCK_DPPS.find(p=>p.id===selectedProduct)?.productName || MOCK_TRANSIT_PRODUCTS.find(p=>p.id===selectedProduct)?.name || selectedProduct}.` :
            'Select a product to view its focus area.'
            }
            {selectedProduct && highlightedCountries.length > 0 && ` Focus Area: Amber/Orange.`}
        </span>
        <BarChart3 className="inline h-3 w-3" />
        <span>Altitude indicates DPP count.</span>
      </div>
    </div>
  </>
  );
}

    
    