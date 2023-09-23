import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppbWpvbm4iLCJhIjoiY2xtdTd2cXNuMGR2bjJqcWprNHJwaDJ0ZSJ9.S1qMws3nGfG-4Efs6DF9RQ";
function MapPage() {
  const mapContainer = useRef(null);
  const circle = useRef(null);
  // const map = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(69.2893);
  const [lat, setLat] = useState(41.32003);
  const [zoom, setZoom] = useState(11);
  const [radius, setRadius] = useState(100);
  const [markers, setMarkers] = useState([
    {
      id: 1,
      latitude: 41.311158,
      longitude: 69.279737,
      title: "Toshkent",
    },
    // Add more markers as needed
  ]);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/azimjonn/clmu7yk2602ks01r78ak2dnjb",
        center: [markers[0].longitude, markers[0].latitude],
        zoom: zoom,
      });

      mapInstance.on("zoom", () => {
        const newRadius = calculateRadius(mapInstance.getZoom());
        setRadius(newRadius);
        drawCircle(mapInstance, newRadius);
      });

      mapInstance.on("load", () => {
        // Add a source and layer for markers
        mapInstance.addSource("markers", {
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

        // mapInstance.addLayer({
        //   id: "markers",
        //   type: "symbol",
        //   source: "markers",
        //   layout: {
        //     "icon-image": "marker-15",
        //     "icon-allow-overlap": true,
        //   },
        // });

        mapInstance.addLayer({
          id: "circle-layer",
          type: "circle",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: [69.279737, 41.311158], // [longitude, latitude]
              },
            },
          },
          paint: {
            "circle-radius": radius, // Adjust the radius of the circle in meters
            "circle-color": " rgba(0,0,255,0.3533788515406162)",
            "circle-stroke-width": 2, // Adjust the border width
            "circle-stroke-color": "#0056ff",
          },
        });
      });

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });

      mapInstance.on("load", () => {
        mapInstance.addControl(draw);

        mapInstance.on("draw.create", (e) => {
          console.log("Shape created:", e.features);
        });

        mapInstance.on("draw.update", (e) => {
          console.log("Shape updated:", e.features);
        });

        mapInstance.on("draw.delete", (e) => {
          console.log("Shape deleted:", e.features);
        });
      });
      setMap(mapInstance);
    };

    if (!map) {
      initializeMap();
    }

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map, markers]);

  const calculateRadius = (zoom) => {
    // Adjust the formula based on your requirements to calculate the radius
    return 1000 / Math.pow(2, zoom - 9);
  };

  const drawCircle = (map, circleRadius) => {
    const sourceId = "circle-source";

    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    map.addSource(sourceId, {
      type: "geojson",
      data: {
        type: "Feature",
        properties: {},
        geometry: {
          type: "Point",
          coordinates: [69.279737, 41.311158],
        },
      },
    });
  };

  return (
    <div className="App">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  );
}

export default MapPage;
