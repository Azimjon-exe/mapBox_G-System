import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { GlobalMapInstans, OloudedMap } from "../../redux/actions";
import { useSelector } from "react-redux";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppbWpvbm4iLCJhIjoiY2xtdTd2cXNuMGR2bjJqcWprNHJwaDJ0ZSJ9.S1qMws3nGfG-4Efs6DF9RQ";
function MapPage() {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const mapContainer = useRef(null);
  // const map = useRef(null);
  const [map, setMap] = useState(null);
  const [lng, setLng] = useState(69.2893);
  const [lat, setLat] = useState(41.32003);
  const [zoom, setZoom] = useState(13);
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
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/azimjonn/clmu7yk2602ks01r78ak2dnjb",
        center: [markers[0].longitude, markers[0].latitude],
        zoom: zoom,
        projection: "globe",
        pitch: 0,
        maxBounds: [
          [69.115538, 41.153268], // Southwest coordinates [longitude, latitude]
          [69.354187, 41.426656], // Northeast coordinates [longitude, latitude]
        ],
      });

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
      });

      mapContainer.current.addEventListener("contextmenu", handleContextMenu);

      map.on("zoom", () => {
        const newRadius = calculateRadius(map.getZoom());
        setRadius(newRadius);
        drawCircle(map, newRadius);
      });

      map.on("move", () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });
      map.on("load", () => {
        OloudedMap(true);
        if (map) {
          const nav = new mapboxgl.NavigationControl({
            visualizePitch: true,
          });
          map.addControl(nav, "bottom-right");
        }
        // Add a source and layer for markers
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

        map.addLayer({
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
        map.addControl(draw, "bottom-right");

        map.on("draw.create", (e) => {
          console.log("Shape created:", e.features);
        });

        map.on("draw.update", (e) => {
          console.log("Shape updated:", e.features);
        });

        map.on("draw.delete", (e) => {
          console.log("Shape deleted:", e.features);
        });
      });

      // setMap(map);
      GlobalMapInstans(map);
    };

    // if (!map) {
    //   initializeMap();
    // }
    if (!globalMapInstans) {
      initializeMap();
    }

    return () => {
      if (globalMapInstans) {
        globalMapInstans.remove();
      }
      mapContainer.current.removeEventListener(
        "contextmenu",
        handleContextMenu
      );
    }; // Clean up on component unmount
  }, [globalMapInstans, markers]);

  const handleContextMenu = (event) => {
    event.preventDefault(); // Prevent the default context menu
    // Add your custom logic for right-click here
    console.log("Right mouse button clicked!");
  };

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
