import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { GlobalMapInstans, OloudedMap } from "../../redux/actions";
import { useSelector } from "react-redux";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppbWpvbm4iLCJhIjoiY2xtdTd2cXNuMGR2bjJqcWprNHJwaDJ0ZSJ9.S1qMws3nGfG-4Efs6DF9RQ";
function MapPage() {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const mapContainer = useRef(null);
  const [zoom, setZoom] = useState(11);
  const [markers, setMarkers] = useState([
    {
      id: 1,
      latitude: 41.311158,
      longitude: 69.279737,
      title: "Toshkent",
    },
  ]);

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/azimjonn/clmu7yk2602ks01r78ak2dnjb",
        center: [markers[0].longitude, markers[0].latitude],
        zoom: 12,
        projection: "globe",
        pitch: 0,
      });
      
      map.on("load", () => {  
        OloudedMap(true)
        if (map) {
          const nav = new mapboxgl.NavigationControl({
            visualizePitch: true,
          });
          map.addControl(nav, "bottom-right");
        }
        map.addSource("markers", {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: markers.map((marker) => ({
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [marker.longitude, marker.latitude],
              },
              properties: {
                title: marker.title,
                id: marker.id,
              },
            })),
          },
        });

        
      });

      GlobalMapInstans(map);
    };

    if (!globalMapInstans) {
      initializeMap();
    }

    return () => {
      if (globalMapInstans) {
        globalMapInstans.remove();
      }
    };
  }, [globalMapInstans, markers]);

  return (
    <>
      <div className="sidebar">
        Longitude: {markers[0].longitude} | Latitude: {markers[0].latitude} |
        Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </>
  );
}

export default MapPage;
