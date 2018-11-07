import L from 'leaflet'
import 'leaflet-fullscreen'
// import leafletImage from 'leaflet-image'

class Map {
  constructor(id) {
    
    // remove and refresh before init
    if (isPopup) {
      if (window.mapID != undefined || window.mapID != undefined) {
        window.mapID.off()
        window.mapID.remove()
      }
      let node = document.getElementById(id);
      if (node) {
        while (node.firstChild) {
          node.removeChild(node.firstChild)
        }  
      }
    }
  
    
    if (id) {
      this.el = id
      this.tiles = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      this.attribution = 'Map data © <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
      this.data = $(`#${this.el}`).data('geojson')
      this.center = this.getCoordinates()
      this.defaultZoom = 6
      this.map = this.createMap()
      window.mapID = this.map
      this.addTiles()
 
      this.map.on('fullscreenchange', function () {
          this.invalidateSize(true)
      })
  
      if (this.data) {
        this.getData()
      }
  
      setTimeout(() => {
        this.map.invalidateSize()
      }, 100)
    }
  }

  createMap() {
    return L.map(this.el, {
      fullscreenControl: {
          pseudoFullscreen: false // if true, fullscreen to page width and height
      }
    })
    .setView(this.center, this.defaultZoom)
  }

  addTiles() {
    L.tileLayer(this.tiles, {
      // options
      attribution: this.attribution
    }).addTo(this.map)
  }

  getCoordinates() {
    let lat = $('#' + this.el).data('lat')
    let long = $('#' + this.el).data('long')
    return [lat, long]
  }

  getData() {
    $.getJSON(this.data, json => {
      L.geoJson(json, {
        // Change the style here as desired
        pointToLayer: (feature, latlng) => {
          return L.circleMarker(latlng, {
            radius: 8,
            fillColor: '#333',
            color: '#000',
            weight: 1,
            opacity: 1,
            fillOpacity: 0.75
          })
        },
        // Change styles here as desired
        onEachFeature: (feature, layer) => {
          let options = { minWidth: 100, maxHeight: 250 }
          layer.bindPopup(feature.properties.description, options)
        }
      }).addTo(this.map)
    })
  }
}

export default Map
