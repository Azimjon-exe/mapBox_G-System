import React, { useRef, useEffect, useState } from "react";
import ReactDOMServer from "react-dom/server";
import mapboxgl from "mapbox-gl";
import { BsFillTrashFill, BsQuestionCircle } from "react-icons/bs";
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
// mapboxgl.config.API_URL = "http://192.168.102.19:7800/";
function MapPage() {
  console.log(mapboxgl);
  const globalMapInstans = useSelector((state) => state.globalMapInstans);

  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const contextmenuRef = useRef(null);
  const clickTimeRef = useRef(null);
  const mode3dRef = useRef(null);

  const [lng, setLng] = useState(69.2893);
  const [lat, setLat] = useState(41.32003);
  const [zoom, setZoom] = useState(11);
  const [drawType, setDrawType] = useState();
  const [drawState, set_drawState] = useState();
  const [mode3d, set_mode3d] = useState(false);
  // const [pitchWithRotate, set_pitchWithRotate] = useState(false);

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
  // https://api.mapbox.com/styles/v1/davron97/clm4vi04n00vi01pb4eq69cks/sprite@3x?access_token=pk.eyJ1IjoiZGF2cm9uOTciLCJhIjoiY2xtajN2ZWp4MDA1cTJpcHc4MGVhYmVtNSJ9.HiDv-acCv1IW42mcTKGFWw
  const initializeMap = () => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "http://localhost:3001/stylemap/style.json",
      center: [69.279737, 41.311158],
      zoom: zoom,
      projection: "globe",
      pitch: 0,
      // pitchWithRotate,/
      bearing: -30,
      maxBounds: [
        [68.95545871131318, 41.173689928648514], // Southwest coordinates [longitude, latitude]
        [69.6039219548966, 41.44612025632972], // Northeast coordinates [longitude, latitude]
      ],
    });
  };
  // $$dE0055721$$eE0100410$$fN0472433$$gN0454904
  useEffect(() => {
    if (!globalMapInstans) {
      initializeMap();
    }
  }, []);

  useEffect(() => {
    // mapRef.current = map;

    mapRef.current?.on("move", () => {
      setLng(mapRef.current?.getCenter().lng.toFixed(4));
      setLat(mapRef.current?.getCenter().lat.toFixed(4));
      setZoom(mapRef.current?.getZoom().toFixed(2));
    });

    //SERVER CONFIG
    // var vectorSource = "ne-source";
    // var vectorId = "ne-layer";

    // Build the tile URL
    // var vectorServer = "http://192.168.102.19:7800/";
    // var vectorSourceLayer = "public.ne_50m_admin_0_countries";
    // // The data table has a lot of columns, we retrieve just three
    // var vectorProps = "?properties=name,type,pop_est";
    // var vectorUrl =
    //   vectorServer + vectorSourceLayer + "/{z}/{x}/{y}.pbf" + vectorProps;

    mapRef.current?.on("load", () => {
      //SERVER CONFIG

      // Layers read from sources
      // mapRef.current?.addSource(vectorSource, {
      //   type: "vector",
      //   tiles: [vectorUrl],
      //   minzoom: 0,
      //   maxzoom: 22,
      // });
      // // To get wide rendered boundaries we
      // // need two layers, one for the boundaries
      // // and one for the fill
      // var vectorLayerColor = "blue";
      // var vectorLayerOutline = {
      //   id: vectorId + "-outline",
      //   source: vectorSource,
      //   "source-layer": vectorSourceLayer,
      //   type: "line",
      //   paint: {
      //     "line-width": 1.5,
      //     "line-color": vectorLayerColor,
      //   },
      // };
      // mapRef.current?.addLayer(vectorLayerOutline);

      //********** terrain **************/

      // mapRef.current?.addSource("mapbox-terrain", {
      //   type: "vector",
      //   // Use any Mapbox-hosted tileset using its tileset id.
      //   // Learn more about where to find a tileset id:
      //   // https://docs.mapbox.com/help/glossary/tileset-id/
      //   url: "mapbox://mapbox.mapbox-terrain-v2",
      // });
      // mapRef.current?.addLayer(
      //   {
      //     id: "terrain-data",
      //     type: "line",
      //     source: "mapbox-terrain",
      //     "source-layer": "contour",
      //     layout: {
      //       "line-join": "round",
      //       "line-cap": "round",
      //     },
      //     paint: {
      //       "line-color": "#ff69b4",
      //       "line-width": 1,
      //     },
      //   },
      //   "road-label-simple" // Add layer below labels
      // );

      //********** Hover **************/

      mapRef.current?.addLayer({
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

      mapRef.current?.on("mouseenter", "3d-buildings", (e) => {
        mapRef.current.getCanvas().style.cursor = "pointer";
        var feature = e.features[0];
        var color = "#07257F";
        mapRef.current.setPaintProperty(
          "3d-buildings",
          "fill-extrusion-color",
          ["case", ["==", ["id"], feature.id], color, "#3750AB"]
        );
      });

      let clickedLocation = null;
      mapRef.current?.on("mousedown", (e) => {
        clickedLocation = e.lngLat;
      });
      const marker3D = new mapboxgl.Marker();
      const popup3DIcon = new mapboxgl.Popup();
      document.getElementById("btnId").addEventListener("click", () => {
        if (clickedLocation) {
          console.log("bajarildi");
          popup3DIcon.setHTML(
            ReactDOMServer.renderToString(<Popup3D lngLat={clickedLocation} />)
          );

          marker3D
            .setLngLat([clickedLocation.lng, clickedLocation.lat])
            .setPopup(popup3DIcon)
            .addTo(mapRef.current);
        }

        if (contextmenuRef.current) {
          contextmenuRef.current.style.display = "none";
        }
      });

      mapRef.current?.on("click", "3d-buildings", (e) => {
        mapRef.current.getCanvas().style.cursor = "pointer";
        var feature = e.features[0];
        var color = "yellow";
        console.log(feature);
        mapRef.current?.setPaintProperty(
          "3d-buildings",
          "fill-extrusion-color",
          ["case", ["==", ["id"], feature.id], color, "#3750AB"]
        );
      });

      mapRef.current?.on("mouseout", "3d-buildings", () => {
        mapRef.current.getCanvas().style.cursor = "";
        mapRef.current?.setPaintProperty(
          "3d-buildings",
          "fill-extrusion-color",
          "#3750AB"
        );
      });

      //********** Hover end **************/

      OloudedMap(true);

      const popup = new mapboxgl.Popup();
      PopupInstans(popup);
      const popupHover = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });
      PopupHoverInstans(popupHover);
      if (mapRef.current) {
        const nav = new mapboxgl.NavigationControl({
          visualizePitch: true,
        });
        mapRef.current?.addControl(nav, "bottom-right");
        const navigationControlContainer = mapRef.current
          .getContainer()
          .querySelector(".mapboxgl-ctrl-bottom-right");
      }

      mapRef.current?.on("draw.create", (e) => {
        console.log("Shape created:", e.features);
      });

      mapRef.current?.on("draw.update", (e) => {
        console.log("Shape updated:", e.features);
      });

      mapRef.current?.on("draw.delete", (e) => {
        console.log("Shape deleted:", e.features);
      });
    });

    mapRef.current?.on("mousedown", (event) => {
      if (contextmenuRef.current) {
        contextmenuRef.current.style.display = "none";
      }

      if (event.originalEvent.button === 2) {
        // Right mouse button was clicked
        clickTimeRef.current = Date.now();
      }
      console.log("click center cordinate", event.lngLat.lng, event.lngLat.lat);
    });

    mapRef.current?.on("contextmenu", (event) => {
      const windowCoordinates = [event.point.x, event.point.y];

      // Update styles using useRef

      if (clickTimeRef.current) {
        const releaseTime = Date.now();
        const timeDifference = releaseTime - clickTimeRef.current;
        if (contextmenuRef.current && timeDifference < 200) {
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
    GlobalMapInstans(mapRef.current);

    return () => {
      if (globalMapInstans) {
        globalMapInstans.remove();
      }
    }; // Clean up on component unmount
    // eslint-disable-next-line
  }, []);

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

  // useEffect(() => {
  //   // if (zoom > 14 && globalMapInstans?.getPitch() !== 60 && mode3d) {
  //   //   globalMapInstans?.setPitch(60, { duration: 0 });
  //   // } else if (zoom < 14 && globalMapInstans?.getPitch() === 60 && !mode3d) {
  //   //   globalMapInstans?.setPitch(0, { duration: 0 });
  //   // }
  //   if (zoom < 15) {
  //     // mode3dRef.current.style.display = "block";
  //     // mapRef.current?.dragRotate.disable();
  //   }
  //   else if (zoom >= 15) {
  //     // mode3dRef.current.style.display = "none";
  //     // mapRef.current?.dragRotate.enable();
  //   }

  //   // eslint-disable-next-line
  // }, [zoom, mode3d]);

  useEffect(() => {
    if (mode3d) {
      mapRef.current?.dragRotate.enable();
      globalMapInstans?.setPitch(60, { duration: 0 });
      // set_pitchWithRotate(true);
      // mapRef.current.dragRotate._pitchWithRotate = true;
    } else {
      mapRef.current?.dragRotate.disable();
      globalMapInstans?.setPitch(0, { duration: 0 });
      // set_pitchWithRotate(false);
      // mapRef.current.dragRotate._pitchWithRotate = false;
    }
    // eslint-disable-next-line
  }, [mode3d]);

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
        <div id="btnId">
          <BsQuestionCircle
            style={{
              paddingRight: 10,
              paddingLeft: 2,
              color: "#fff",
              fontSize: "30px",
            }}
          />
          <p style={{ margin: 0, color: "#fff", fontWeight: "bold" }}>
            Bu yir nima...
          </p>
        </div>
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
      <div className="mode3d2d" ref={mode3dRef}>
        {mode3d ? (
          <div
            className="button-2d3d"
            alt="3d"
            // width={"100%"}
            onClick={() => set_mode3d(false)}
          >
            <p>3D</p>
          </div>
        ) : (
          <div
            className="button-2d3d"
            alt="3d"
            // width={"90%"}
            onClick={() => set_mode3d(true)}
          >
            <p>2D</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;
