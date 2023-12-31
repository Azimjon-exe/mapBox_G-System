import React, { useEffect } from "react";
import ReactDOMServer from "react-dom/server";
import PopupComp from "../../components/popup/popup1/popup-comp";
import { useSelector } from "react-redux";
import home from './photo/house.png'


const Xonadonlar = () => {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const onloudedMap = useSelector((state) => state.onloudedMap);
  const popupInstans = useSelector((state) => state.popupInstans);
  const popupHoverInstans = useSelector((state) => state.popupHoverInstans);

  const generateRandomCoordinates = () => {
    let longitude = 69.2401 + (Math.random() - 0.5) * 0.2;
    let latitude = 41.3111 + (Math.random() - 0.5) * 0.2;
    return [longitude, latitude];
  };

  useEffect(() => {
    const sourceId = "earthquakesXonadon";
    const layerId = "clusters";
    const layerId1 = "unclustered-point";
    const layerId2 = "cluster-count";
    const imageId = "icon";

    if (globalMapInstans && onloudedMap) {
      if (globalMapInstans.getLayer(layerId))
        globalMapInstans.removeLayer(layerId);
      if (globalMapInstans.getLayer(layerId1))
        globalMapInstans.removeLayer(layerId1);
      if (globalMapInstans.getLayer(layerId2))
        globalMapInstans.removeLayer(layerId2);
      if (globalMapInstans.hasImage(imageId))
        globalMapInstans.removeImage(imageId);
        if(popupInstans) popupInstans.remove();
        if(popupHoverInstans) popupHoverInstans.remove();
      const features = [];
      for (let i = 0; i < 10000; i++) {
        let coordinatesRan = generateRandomCoordinates();
        let obj = {
          type: "Feature",
          properties: {
            id: `ak1699452${i}`,
            cluster_id: `claster${i}`,
            mag: 2.3 + i,
            time: 1507425650893 + i,
            felt: null,
            tsunami: 0,
            descriptionClick: `Manzil: Toshkent, Shayxontoxir tumani, massiv Gulobod, Uyg'ur ko'chasi, ${i}-Xonadon`,
            descriptionHover:
              `<h6 style='color: #fff'>Xonadon, ${i}</h6>`,
          },
          geometry: {
            type: "Point",
            coordinates: coordinatesRan,
          },
        };

        features.push(obj);
      }
      if (!globalMapInstans.getSource(sourceId)) {
        globalMapInstans.addSource(sourceId, {
          type: "geojson",
          data: {
            type: "FeatureCollection",
            crs: {
              type: "name",
              properties: { name: "urn:ogc:def:crs:OGC:1.3:CRS84" },
            },
            features: features,
          },
          cluster: true,
          clusterMaxZoom: 20,
          clusterRadius: 100,
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
            15,
            100,
            20,
            750,
            25,
          ],
          "circle-stroke-color": [
            "step",
            ["get", "point_count"],
            "#0277FE",
            100,
            "#F08427",
            750,
            "#F55FA1",
          ],
          "circle-stroke-width": [
            "step",
            ["get", "point_count"],
            2,
            100,
            2.5,
            750,
            3,
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
        home,
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
              "icon-size": 0.1,
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
              zoom: zoom + 0.1,
            });
          });
      });

      globalMapInstans.on("click", layerId1, (e) => {
        popupHoverInstans.remove();
        const coordinates = e.features[0].geometry.coordinates.slice();

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }
        const descriptionClick = e.features[0].properties.descriptionClick;
        popupInstans
          .setLngLat(coordinates)
          .setHTML(ReactDOMServer.renderToString(<PopupComp title={descriptionClick}/>))
          .setMaxWidth("500px")
          .setOffset(20)
          .addTo(globalMapInstans);
      });

      globalMapInstans.on("mouseenter", layerId1, (e) => {
        globalMapInstans.getCanvas().style.cursor = "pointer";

        const coordinates = e.features[0].geometry.coordinates.slice();
        const descriptionHover = e.features[0].properties.descriptionHover;

        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        popupHoverInstans
          .setLngLat(coordinates)
          .setHTML(descriptionHover)
          .setOffset(20)
          .addTo(globalMapInstans);
      });

      globalMapInstans.on("mouseleave", layerId1, () => {
        globalMapInstans.getCanvas().style.cursor = "";
        popupHoverInstans.remove();
      });

      globalMapInstans.on("mouseenter", layerId, () => {
        globalMapInstans.getCanvas().style.cursor = "pointer";
      });
      globalMapInstans.on("mouseleave", layerId, () => {
        globalMapInstans.getCanvas().style.cursor = "";
      });
    }
    
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
