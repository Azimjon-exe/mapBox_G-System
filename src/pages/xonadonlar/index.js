import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import PopupComp from "../../components/popup/popup1/popup-comp";
import { useSelector } from "react-redux";
import mapboxgl from "mapbox-gl";

const html = ReactDOMServer.renderToString(<PopupComp />);

const Xonadonlar = () => {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const onloudedMap = useSelector((state) => state.onloudedMap);

  const generateRandomCoordinates = () => {
    var longitude = Math.random() * (69.294057 - 69.179273) + 69.179273;
    var latitude = Math.random() * (41.306813 - 41.351043) + 41.351043;
    return [longitude, latitude];
  };

  React.useEffect(() => {
    const sourceId = "earthquakesXonadon";
    const layerId = "clusters";
    const layerId1 = "unclustered-point";
    const layerId2 = "cluster-count";
    const imageId = "icon";

    if (globalMapInstans && onloudedMap) {
      if (globalMapInstans.getSource(sourceId))
        globalMapInstans.removeSource(sourceId);
      if (globalMapInstans.getLayer(layerId))
        globalMapInstans.removeLayer(layerId);
      if (globalMapInstans.getLayer(layerId1))
        globalMapInstans.removeLayer(layerId1);
      if (globalMapInstans.getLayer(layerId2))
        globalMapInstans.removeLayer(layerId2);
      if (globalMapInstans.hasImage(imageId))
        globalMapInstans.removeImage(imageId);

      const features = [];
      for (let i = 0; i < 15000; i++) {
        let coordinatesRan = generateRandomCoordinates();
        let obj = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [...coordinatesRan],
          },
        };

        features.push(obj);
      }
      if (!globalMapInstans.getSource(sourceId)) {
        globalMapInstans.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            features: features,
          },
          cluster: true,
          clusterMaxZoom: 14,
          clusterRadius: 50,
        });
      }
      globalMapInstans.addLayer({
        id: layerId,
        type: "circle",
        source: sourceId,
        filter: ["has", "point_count"],
        paint: {
          "circle-color": [
            "step",
            ["get", "point_count"],
            "#51bbd6",
            100,
            "#f1f075",
            750,
            "#f28cb1",
          ],
          "circle-radius": [
            "step",
            ["get", "point_count"],
            20,
            100,
            30,
            750,
            40,
          ],
        },
      });

      globalMapInstans.addLayer({
        id: layerId2,
        type: "symbol",
        source: sourceId,
        filter: ["has", "point_count"],
        layout: {
          "text-field": ["get", "point_count_abbreviated"],
          "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
          "text-size": 12,
        },
      });

      globalMapInstans.loadImage(
        "https://cdn-icons-png.flaticon.com/128/609/609803.png",
        (error, image) => {
          if (error) throw error;

          globalMapInstans.addImage(imageId, image);
          globalMapInstans.addLayer({
            id: layerId1,
            type: "symbol",
            source: sourceId,
            filter: ["!", ["has", "point_count"]],
            paint: {
              "icon-color": "blue",
            },
            layout: {
              "icon-image": imageId,
              "icon-size": 0.3,
              "icon-allow-overlap": true,
            },
          });
        }
      );

      // inspect a cluster on click
      globalMapInstans.on("click", layerId, (e) => {
        const features = globalMapInstans.queryRenderedFeatures(e.point, {
          layers: [layerId],
        });
        const clusterId = features[0].properties.cluster_id;
        globalMapInstans
          .getSource(sourceId)
          .getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;

            globalMapInstans.easeTo({
              center: features[0].geometry.coordinates,
              zoom: zoom,
            });
          });
      });

      globalMapInstans.on("click", layerId1, (e) => {
        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        new mapboxgl.Popup()
          .setLngLat(coordinates)
          .setHTML(html)
          .addTo(globalMapInstans);
      });

      globalMapInstans.on("mouseenter", layerId, () => {
        globalMapInstans.getCanvas().style.cursor = "pointer";
      });
      globalMapInstans.on("mouseleave", layerId, () => {
        globalMapInstans.getCanvas().style.cursor = "";
      });
    }
    // }
    // getStudent()
  }, [globalMapInstans, onloudedMap]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    ></div>
  );
};

export default Xonadonlar;
