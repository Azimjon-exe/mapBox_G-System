import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { GlobalMapInstans, OloudedMap } from "../../redux/actions";
import { useSelector } from "react-redux";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
const { turf } = require("@turf/turf");

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppbWpvbm4iLCJhIjoiY2xtdTd2cXNuMGR2bjJqcWprNHJwaDJ0ZSJ9.S1qMws3nGfG-4Efs6DF9RQ";
function MapPage() {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const mapContainer = useRef(null);
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

      // const distanceContainer = document.getElementById("distance");
      // const geojson = {
      //   type: "FeatureCollection",
      //   features: [],
      // };
      // const linestring = {
      //   type: "Feature",
      //   geometry: {
      //     type: "LineString",
      //     coordinates: [],
      //   },
      // };
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



        // map.addSource("geojson", {
        //   type: "geojson",
        //   data: geojson,
        // });

        // // Add styles to the map
        // map.addLayer({
        //   id: "measure-points",
        //   type: "circle",
        //   source: "geojson",
        //   paint: {
        //     "circle-radius": 5,
        //     "circle-color": "#000",
        //   },
        //   filter: ["in", "$type", "Point"],
        // });
        // map.addLayer({
        //   id: "measure-lines",
        //   type: "line",
        //   source: "geojson",
        //   layout: {
        //     "line-cap": "round",
        //     "line-join": "round",
        //   },
        //   paint: {
        //     "line-color": "#000",
        //     "line-width": 2.5,
        //   },
        //   filter: ["in", "$type", "LineString"],
        // });

        // map.on("click", (e) => {
        //   const features = map.queryRenderedFeatures(e.point, {
        //     layers: ["measure-points"],
        //   });

        //   // Remove the linestring from the group
        //   // so we can redraw it based on the points collection.
        //   if (geojson.features.length > 1) geojson.features.pop();

        //   // Clear the distance container to populate it with a new value.
        //   if(distanceContainer){
        //     distanceContainer.innerHTML = "";
        //   }

        //   // If a feature was clicked, remove it from the map.
        //   if (features.length) {
        //     const id = features[0].properties.id;
        //     geojson.features = geojson.features.filter(
        //       (point) => point.properties.id !== id
        //     );
        //   } else {
        //     const point = {
        //       type: "Feature",
        //       geometry: {
        //         type: "Point",
        //         coordinates: [e.lngLat.lng, e.lngLat.lat],
        //       },
        //       properties: {
        //         id: String(new Date().getTime()),
        //       },
        //     };

        //     geojson.features.push(point);
        //   }

        //   if (geojson.features.length > 1) {
        //     linestring.geometry.coordinates = geojson.features.map(
        //       (point) => point.geometry.coordinates
        //     );

        //     geojson.features.push(linestring);

        //     // Populate the distanceContainer with total distance
        //     const value = document.createElement("pre");
        //     const distance = turf.length(linestring);
        //     value.textContent = `Total distance: ${distance.toLocaleString()}km`;
        //     distanceContainer.appendChild(value);
        //   }

        //   map.getSource("geojson").setData(geojson);
        // });
        
      });
      
      // map.on("mousemove", (e) => {
      //   const features = map.queryRenderedFeatures(e.point, {
      //     layers: ["measure-points"],
      //   });
      //   // Change the cursor to a pointer when hovering over a point on the map.
      //   // Otherwise cursor is a crosshair.
      //   map.getCanvas().style.cursor = features.length
      //     ? "pointer"
      //     : "crosshair";
      // });

      GlobalMapInstans(map);
    };

   
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
