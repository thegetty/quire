import L from 'leaflet'
import 'leaflet-iiif'
import 'leaflet-fullscreen'

class DeepZoom {
  constructor() {
    this.el = 'js-deepzoom'
    this.imageURL = $(`#${this.el}`).data('image')
    this.center = [0, 0]
    this.defaultZoom = 0
    this.map = this.createMap()
    this.addTiles()

    setTimeout(() => {
      this.map.invalidateSize()
    }, 100)

    this.map.on('fullscreenchange', () => {
      this.map.invalidateSize()
    })
  }

  createMap() {
    return L.map(this.el, {
      center: this.center,
      crs: L.CRS.Simple,
      zoom: this.defaultZoom,
      fullscreenControl: true
    })
  }

  addTiles() {
    L.tileLayer.iiif(this.imageURL, {
      // leaflet options
      attribution: false,
      fitBounds: true
    }).addTo(this.map)
  }
}

export default DeepZoom
