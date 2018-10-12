import L from 'leaflet'
import 'leaflet-iiif'
import 'leaflet-fullscreen'

class DeepZoom {
  constructor(id) {
    // remove and refresh before init
    if (window.mapID != undefined || window.mapID != undefined) {
      window.mapID.off()
      window.mapID.remove()
    }
    let myNode = document.getElementById(id);
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
    this.el = id
    this.imageURL = $(`#${this.el}`).data('image')
    let image = new Image()
    image.src = this.imageURL
    this.imgHeight = image.naturalHeight
    this.imgWidth = image.naturalWidth
    this.center = [0, 0]
    this.defaultZoom = 0
    this.map = this.createMap()
    window.mapID = this.map
    this.imgZoomReduction = this.imgWidth >= 4000 ? 0.5 : this.imgHeight >= 2500 ? 1 : 2
    this.southWest = this.map.unproject([0, this.imgHeight], this.map.getMaxZoom() - this.imgZoomReduction)
    this.northEast = this.map.unproject([this.imgWidth, 0], this.map.getMaxZoom() - this.imgZoomReduction)
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
      minZoom: 0,
      maxZoom: 4,
      zoom: this.defaultZoom,
      fullscreenControl: {
        pseudoFullscreen: true // if true, fullscreen to page width and height
      },
      trackResize: false
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
