import React, { useRef, useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
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
import Popup3D from "../../components/popup/popup3d";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYXppbWpvbm4iLCJhIjoiY2xtdTd2cXNuMGR2bjJqcWprNHJwaDJ0ZSJ9.S1qMws3nGfG-4Efs6DF9RQ";
function MapPage() {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const contextmenuRef = useRef(null);
  const clickTimeRef = useRef(null);
  const [lng, setLng] = useState(69.2893);
  const [lat, setLat] = useState(41.32003);
  const [zoom, setZoom] = useState(11);
  const [drawType, setDrawType] = useState();
  const [drawState, set_drawState] = useState();
  const shapes = [
    {
      key: 2,
      icon: <BiPlusCircle color="white" size={22} />,
      mode: "drag_circle",
      name: "Drag Circle",
    },
    {
      key: 3,
      icon: <TbPolygon color="white" size={22} />,
      mode: "draw_polygon",
      name: "Draw Polygon",
    },
    {
      key: 4,
      icon: <AiOutlineLine color="white" size={22} />,
      mode: "draw_line_string",
      name: "Draw Line String",
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
          [69.15538, 41.253268], // Southwest coordinates [longitude, latitude]
          [69.454187, 41.526656], // Northeast coordinates [longitude, latitude]
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
            "fill-extrusion-color": "#3750AB",
            "fill-extrusion-height": {
              type: "identity",
              property: "height",
            },
            "fill-extrusion-base": {
              type: "identity",
              property: "min_height",
            },
            "fill-extrusion-opacity": 0.6,
          },
        });

        map.on("mouseenter", "3d-buildings", (e) => {
          map.getCanvas().style.cursor = "pointer";
          var feature = e.features[0];
          var color = "#07257F";

          map.setPaintProperty("3d-buildings", "fill-extrusion-color", [
            "case",
            ["==", ["id"], feature.id],
            color,
            "#3750AB",
          ]);
        });
        const marker3D = new mapboxgl.Marker();
        const popup3DIcon = new mapboxgl.Popup();
        const markers3D = [];
        let featureId = 0;
        map.on("click", "3d-buildings", (e) => {
          map.getCanvas().style.cursor = "pointer";
          var feature = e.features[0];
          var color = "yellow";

          map.setPaintProperty("3d-buildings", "fill-extrusion-color", [
            "case",
            ["==", ["id"], feature.id],
            color,
            "#3750AB",
          ]);

          popup3DIcon.setHTML(
            ReactDOMServer.renderToString(<Popup3D lngLat={e.lngLat} />)
          );

          if (featureId !== feature.id) {
            console.log(feature.id);
            marker3D.remove();
            marker3D
              .setLngLat([e.lngLat.lng, e.lngLat.lat])
              .setPopup(popup3DIcon)
              .addTo(map);
            markers3D.push(marker3D);
          }

          featureId = feature.id;
        });
        if (markers3D.length !== 1) {
          setInterval(() => {
            marker3D.remove();
            featureId = 0;
          }, 20000);
        }

        map.on("mouseout", "3d-buildings", () => {
          map.getCanvas().style.cursor = "";
          map.setPaintProperty(
            "3d-buildings",
            "fill-extrusion-color",
            "#3750AB"
          );
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

      map.on("mousedown", (event) => {
        if (contextmenuRef.current) {
          contextmenuRef.current.style.display = "none";
        }

        if (event.originalEvent.button === 2) {
          // Right mouse button was clicked
          clickTimeRef.current = Date.now();
        }
        console.log(
          "click center cordinate",
          event.lngLat.lng,
          event.lngLat.lat
        );
      });
      map.on("contextmenu", (event) => {
        const windowCoordinates = [event.point.x, event.point.y];

        // Update styles using useRef

        if (clickTimeRef.current) {
          const releaseTime = Date.now();
          const timeDifference = releaseTime - clickTimeRef.current;
          if (contextmenuRef.current && timeDifference < 500) {
            contextmenuRef.current.style.left = `${windowCoordinates[0]}px`;
            contextmenuRef.current.style.top = `${windowCoordinates[1]}px`;
            contextmenuRef.current.style.display = "block";
          }
          // console.log(
          //   "Time between click and release (ms):",
          //   timeDifference,
          //   releaseTime
          // );
        }
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

  useEffect(() => {
    if (zoom > 15 && globalMapInstans?.getPitch() === 0) {
      globalMapInstans?.setPitch(60, { duration: 0 });
    } else if (zoom < 15 && globalMapInstans?.getPitch() === 60) {
      globalMapInstans?.setPitch(0, { duration: 0 });
    }
  }, [zoom]);

  return (
    <div className="App">
      <div className="sidebar">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>

      <div ref={mapContainer} id="map" />
      <div className="drawBox">
        {shapes?.map((shape) => (
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
      <div ref={contextmenuRef} className="contextmenu">
        {shapes?.map((shape) => (
          <div
            key={shape.key}
            className={`shape ${shape.mode === drawType ? "active" : ""}`}
            onClick={() => {
              if (shape.mode !== drawType) {
                setDrawType(shape.mode);
                console.log(drawState);
                if (drawType) mapRef.current.removeControl(drawState);
              }
              if (contextmenuRef.current) {
                contextmenuRef.current.style.display = "none";
              }
            }}
          >
            {shape.icon}
            <span>{shape.name}</span>
          </div>
        ))}
        <div
          className="deleteShape"
          onClick={() => {
            setDrawType(null);
            if (drawType) mapRef.current.removeControl(drawState);
            if (contextmenuRef.current) {
              contextmenuRef.current.style.display = "none";
            }
          }}
        >
          <BsFillTrashFill size={20} color="rgb(252, 69, 56)" />{" "}
          <span style={{ color: "rgb(252, 69, 56)" }}>Delete</span>
        </div>
      </div>
    </div>
  );
}

export default MapPage;
