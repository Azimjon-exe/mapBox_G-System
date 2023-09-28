import React from "react";
import ReactDOMServer from "react-dom/server";
import PopupComp from "../../components/popup/popup1/popup-comp";
import { useSelector } from "react-redux";
import mapboxgl from "mapbox-gl";

const html = ReactDOMServer.renderToString(
  (<PopupComp />)
);

const GayiXodimlari = () => {
  const globalMapInstans = useSelector((state) => state.globalMapInstans);
  const onloudedMap = useSelector((state) => state.onloudedMap);
  const markerGayi = {
    type: "FeatureCollection",
    features: [],
  };

  const generateRandomCoordinates = () => {
    var longitude = Math.random() * (69.294057 - 69.179273) + 69.179273;
    var latitude = Math.random() * (41.306813 - 41.351043) + 41.351043;
    return [longitude, latitude];
  };

  for (let i = 0; i < 2000; i++) {
    let coordinatesRan = generateRandomCoordinates();
    let obj = {
      type: "Feature",
      properties: {
        id: i + 1,
        mag: 2,
        time: 1507425650893,
        felt: null,
        tsunami: 0,
      },
      geometry: {
        type: "Point",
        coordinates: [...coordinatesRan, 0.0],
      },
    };

    markerGayi.features.push(obj);
  }
  React.useEffect(() => {
    // for (const marker of markers) {
    //   marker.remove();
    // }
    

    const sourceId = "clasterGayi";
    const layerId = 'clusters';
    const layerId1 = 'cluster_icon';
    const layerId2 = 'cluster_label';
    
    const imageId = 'icon'
      if (
        globalMapInstans && onloudedMap &&
        globalMapInstans.getLayer(layerId) &&
        globalMapInstans.getLayer(layerId1) &&
        globalMapInstans.getLayer(layerId2) &&
        globalMapInstans.hasImage(imageId)
      ) {
        globalMapInstans.removeLayer(layerId);
        globalMapInstans.removeLayer(layerId1);
        globalMapInstans.removeLayer(layerId2);
        globalMapInstans.removeImage(imageId)
      }
    if (globalMapInstans && onloudedMap) {
        if (!globalMapInstans.getSource(sourceId)) {
            globalMapInstans.addSource(sourceId, {
            type: 'geojson',
            data: markerGayi,
            cluster: true,
            clusterMaxZoom: 14, 
            clusterRadius: 50 
            });
            console.log(globalMapInstans.getSource(sourceId).id);
        } 
            globalMapInstans.addLayer({
            id: layerId,
            type: 'circle',
            source: sourceId,
            filter: ['has', 'point_count'],
            paint: {
            'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
            ],
            'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
            ]
            }
            });
             
            globalMapInstans.addLayer({
            id: layerId2,
            type: 'symbol',
            source: sourceId,
            filter: ['has', 'point_count'],
            layout: {
            'text-field': ['get', 'point_count_abbreviated'],
            'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
            'text-size': 12
            }
            });
             
            globalMapInstans.loadImage(
                'https://cdn-icons-png.flaticon.com/128/5917/5917776.png',
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
                  "icon-size": 0.6,
                  "icon-allow-overlap": true,
                },
              });
            })
             
            // inspect a cluster on click
            globalMapInstans.on('click', layerId, (e) => {
            const features = globalMapInstans.queryRenderedFeatures(e.point, {
            layers: [layerId]
            });
            const clusterId = features[0].properties.cluster_id;
            globalMapInstans.getSource(sourceId).getClusterExpansionZoom(
            clusterId,
            (err, zoom) => {
            if (err) return;
             
            globalMapInstans.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
            });
            }
            );
            });
             
            globalMapInstans.on('click', layerId1, (e) => {
            const coordinates = e.features[0].geometry.coordinates.slice();
            const mag = e.features[0].properties.mag;
            const tsunami =
            e.features[0].properties.tsunami === 1 ? 'yes' : 'no';
             
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }
             
            new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(html)
            .addTo(globalMapInstans);
            });
             
            globalMapInstans.on('mouseenter', layerId, () => {
            globalMapInstans.getCanvas().style.cursor = 'pointer';
            });
            globalMapInstans.on('mouseleave', layerId, () => {
            globalMapInstans.getCanvas().style.cursor = '';
            });
      }
    
  }, [globalMapInstans]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    ></div>
  );
};

export default GayiXodimlari;