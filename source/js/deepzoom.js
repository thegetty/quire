import L from 'leaflet'
import 'leaflet-iiif'
import 'leaflet-fullscreen'

class DeepZoom {
  constructor() {
    this.el = 'js-deepzoom'
    this.imageURL = $(`#${this.el}`).data('image')
    let image = new Image()
    image.src = this.imageURL
    this.imgHeight = image.naturalHeight
    this.imgWidth = image.naturalWidth
    this.center = [0, 0]
    this.defaultZoom = 1
    this.map = this.createMap()
    this.southWest = this.map.unproject([0, this.imgHeight], this.map.getMaxZoom() - 1)
    this.northEast = this.map.unproject([this.imgWidth, 0], this.map.getMaxZoom() - 1)
    let bounds = new L.LatLngBounds(this.southWest, this.northEast)
    this.addTiles(bounds)

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
      minZoom: 1,
      maxZoom: 4,
      zoom: this.defaultZoom,
      fullscreenControl: true
    })
  }

  addTiles(bounds) {
    L.imageOverlay(this.imageURL, bounds, {
      attribution: false,
      fitBounds: true
    }).addTo(this.map)
    this.map.setMaxBounds(bounds)
  }
}

export default DeepZoom
