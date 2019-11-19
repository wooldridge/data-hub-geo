import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import OSM from 'ol/source/OSM';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { Icon, Style } from 'ol/style';
import { fromLonLat } from 'ol/proj';

import {icons} from './data/icons';

let marker = new Icon({
  anchor: [0.5, 42],
  anchorXUnits: 'fraction',
  anchorYUnits: 'pixels',
  src: icons.marker_24x42
})

let vectorSource = new VectorSource({});
let vectorLayer = new VectorLayer({ source: vectorSource });
let tileLayer = new TileLayer({ source: new OSM() });

let map = new Map({
  layers: [tileLayer, vectorLayer],
  target: document.getElementById('map')
});

// Load features asynchronously
$.ajax({
  url: 'http://localhost:3000/search?collection=Customer', 
  dataType: 'json', 
  success: function(response) {
    if (response.error) {
      alert(response.error.message + '\n' +
        response.error.details.join('\n'));
    } else {
      let features = [];
      response.forEach(doc => {
        let instance = doc.content.envelope.instance;
        if (instance.longitude) {
          let feature = new Feature({
            geometry: new Point(fromLonLat([instance.longitude, instance.latitude])),
            label: instance.FirstName + ' ' + instance.LastName
          });
          feature.setStyle(new Style({ image: marker }));
          features.push(feature);
        }
      })
      if (features.length > 0) {
        vectorSource.addFeatures(features);
        map.getView().fit(vectorSource.getExtent());
      }
    }
  }
});

let element = document.getElementById('popup');

let popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50]
});
map.addOverlay(popup);

// Display popup on click
map.on('click', function(evt) {
  let feature = map.forEachFeatureAtPixel(evt.pixel, feature => {
      return feature;
  });
  if (feature) {
    $(element).popover('destroy');
    // See: 
    setTimeout(function () {
      let coordinates = feature.getGeometry().getCoordinates();
      console.log(coordinates);
      popup.setPosition(coordinates);
      $(element).popover({
        placement: 'top',
        html: true,
        content: feature.get('label')
      });
      $(element).popover('show');
    }, 200);
  } else {
    $(element).popover('destroy');
  }
});

// Change mouse cursor when over marker
map.on('pointermove', function(e) {
  if (e.dragging) {
    $(element).popover('destroy');
    return;
  }
  let pixel = map.getEventPixel(e.originalEvent);
  let hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});