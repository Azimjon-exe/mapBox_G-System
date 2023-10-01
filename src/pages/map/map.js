import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { BsFillTrashFill } from "react-icons/bs";
import { BiPlusCircle } from "react-icons/bi";
import { TbPolygon } from "react-icons/tb";
import { AiOutlineLine } from "react-icons/ai";
import {
  GlobalMapInstans,
  OloudedMap,
  PopupHoverInstans,
  PopupInstans,
} from "../../redux/actions";
import { useSelector } from "react-redux";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import {
  CircleMode,
  DragCircleMode,
  DirectMode,
  SimpleSelectMode,
} from "mapbox-gl-draw-circle";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppbWpvbm4iLCJhIjoiY2xtdTd2cXNuMGR2bjJqcWprNHJwaDJ0ZSJ9.S1qMws3nGfG-4Efs6DF9RQ";
function MapPage() {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [lng, setLng] = useState(69.2893);
  const [lat, setLat] = useState(41.32003);
  const [zoom, setZoom] = useState(12);
  const [drawType, setDrawType] = useState();
  const [drawState, set_drawState] = useState();

  const shapes = [
    {
      key: 2,
      icon: <BiPlusCircle color="white" size={22} />,
      mode: "drag_circle",
    },
    {
      key: 3,
      icon: <TbPolygon color="white" size={22} />,
      mode: "draw_polygon",
    },
    {
      key: 4,
      icon: <AiOutlineLine color="white" size={22} />,
      mode: "draw_line_string",
    },
  ];

  useEffect(() => {
    const initializeMap = () => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/azimjonn/clmu7yk2602ks01r78ak2dnjb",
        center: [69.279737, 41.311158],
        zoom: zoom,
        projection: "globe",
        pitch: 0,
        bearing: -30,
        maxBounds: [
          [69.115538, 41.153268],
          [69.354187, 41.426656],
        ],
      });

      mapRef.current = map;

      map.on("move", () => {
        setLng(map.getCenter().lng.toFixed(4));
        setLat(map.getCenter().lat.toFixed(4));
        setZoom(map.getZoom().toFixed(2));
      });

      map.on("load", () => {
        map.addLayer({
          id: "3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#0020FF",
            "fill-extrusion-height": {
              type: "identity",
              property: "height",
            },
            "fill-extrusion-base": {
              type: "identity",
              property: "min_height",
            },
            "fill-extrusion-opacity": 1,
          },
        });

        map.on("mousemove", "3d-buildings", (e) => {
          map.getCanvas().style.cursor = "pointer";
          var feature = e.features[0];
          var color = "#0000FF"; 

          map.setPaintProperty("3d-buildings", "fill-extrusion-color", [
            "case",
            ["==", ["id"], feature.id],
            color,
            "#0020FF",
          ]);

          map.on("mouseleave", "3d-buildings", () => {
            map.getCanvas().style.cursor = "";
            map.setPaintProperty(
              "3d-buildings",
              "fill-extrusion-color",
              "#0020FF"
            );
          });
        });

        map.on("click", "3d-buildings", (e) => {
          map.getCanvas().style.cursor = "pointer";
          var feature = e.features[0];
          var color = "yellow"; 

          map.setPaintProperty("3d-buildings", "fill-extrusion-color", [
            "case",
            ["==", ["id"], feature.id],
            color,
            "#0020FF",
          ]);

          map.on("mouseleave", "3d-buildings", () => {
            map.getCanvas().style.cursor = "";
            map.setPaintProperty(
              "3d-buildings",
              "fill-extrusion-color",
              "#0020FF",
            );
          });
        });

        map.on("mouseenter", "3d-buildings", () => {
          map.getCanvas().style.cursor = "pointer";
        });
        map.on("mouseleave", "3d-buildings", () => {
          map.getCanvas().style.cursor = "";
        });
        OloudedMap(true);
        const popup = new mapboxgl.Popup();
        PopupInstans(popup);
        const popupHover = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
        });
        PopupHoverInstans(popupHover);
        if (map) {
          const nav = new mapboxgl.NavigationControl({
            visualizePitch: true,
          });
          map.addControl(nav, "bottom-right");
          const navigationControlContainer = map
            .getContainer()
            .querySelector(".mapboxgl-ctrl-bottom-right");
          navigationControlContainer.querySelector(".mapboxgl-ctrl-zoom-in");
          navigationControlContainer.querySelector(".mapboxgl-ctrl-zoom-out");
        }

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
      map.on("mousedown", (e) => {
        console.log("click center cordinate", e);
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
    }; // Clean up on component unmount
    // eslint-disable-next-line
  }, [globalMapInstans]);

  useEffect(() => {
    if (mapRef.current && drawType) {
      let draw = new MapboxDraw({
        defaultMode: drawType,
        userProperties: true,
        modes: {
          ...MapboxDraw.modes,
          draw_circle: CircleMode,
          drag_circle: DragCircleMode,
          direct_select: DirectMode,
          simple_select: SimpleSelectMode,
        },
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
          circle: true,
        },
      });
      set_drawState(draw);
      mapRef.current.addControl(draw, "bottom-right");
    }
  }, [drawType]);

  return (
    <div className="App">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>

      <div ref={mapContainer} id="map" />
      <div className="drawBox">
        {shapes.map((shape) => (
          <div
            key={shape.key}
            className={`shape ${shape.mode === drawType ? "active" : ""}`}
            onClick={() => {
              if (shape.mode !== drawType) {
                setDrawType(shape.mode);
                console.log(drawState);
                if (drawType) mapRef.current.removeControl(drawState);
              }
            }}
          >
            {shape.icon}
          </div>
        ))}
        <div
          className="deleteShape"
          onClick={() => {
            setDrawType(null);
            if (drawType) mapRef.current.removeControl(drawState);
          }}
        >
          <BsFillTrashFill size={20} color="white" />
        </div>
      </div>
    </div>
  );
}

export default MapPage;
