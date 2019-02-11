//@ts-check

import L from 'leaflet'
import 'leaflet-iiif'
import 'leaflet-fullscreen'

class DeepZoom {
  constructor(id) {

    this.el = id

    // remove and refresh before init
    if (figureModal) {
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


    this.imageURL = $(`#${this.el}`).data('image')
    this.iiif = $(`#${this.el}`).data('iiif')

    if (this.imageURL) {
      let image = new Image()
      image.src = this.imageURL
      this.imgHeight = image.naturalHeight
      this.imgWidth = image.naturalWidth
      this.center = [0, 0]
      this.defaultZoom = 0
      this.map = this.createMap()
      if ($(`#${this.el}`).data('catalogue-entry') === undefined) {
        window.mapID = this.map
      }
      this.mapSize = this.map.getSize()
      this.imgZoomReduction = this.imgWidth >= 4000 ? 0.5 : this.imgHeight >= 2500 ? 1 : 2
      this.maxzoom = Math.ceil(Math.log((this.mapSize.x / this.imgWidth > this.mapSize.y / this.imgHeight ? this.imgWidth / this.mapSize.x : this.imgHeight / this.mapSize.y)) / Math.log(2))
      this.southWest = this.map.unproject([0, this.imgHeight], this.maxzoom + 1)
      this.northEast = this.map.unproject([this.imgWidth, 0], this.maxzoom + 1)
      let bounds = new L.LatLngBounds(this.southWest, this.northEast)
      this.addTiles(bounds)
    } else if (this.imageURL && this.iiif) {
      this.center = [0, 0]
      this.defaultZoom = 0
      this.map = this.createMap()
      if ($(`#${this.el}`).data('catalogue-entry') === undefined) {
        window.mapID = this.map
      }
      this.addLayer(this.iiif, this.map)
    } else {
      this.center = [0, 0]
      this.defaultZoom = 0
      this.map = this.createMap()
      if ($(`#${this.el}`).data('catalogue-entry') === undefined) {
        window.mapID = this.map
      }
      this.addLayer(this.iiif, this.map)
    }

    setTimeout(() => {
      this.map.invalidateSize()
    }, 100)

    this.map.on('fullscreenchange', () => {
      this.map.invalidateSize()
    })

    $(window).on('resize', (event) => {
      this.map.invalidateSize()
    })
  }

  showZoom(id) {
    let ele = document.getElementById(id)
    ele.innerHTML = this.map.getZoom();
  }

  createMap() {
    return L.map(this.el, {
      center: this.center,
      crs: L.CRS.Simple,
      zoom: this.defaultZoom,
      maxZoom: 4,
      renderer: L.canvas(),
      fullscreenControl: {
        pseudoFullscreen: false // if true, fullscreen to page width and height
      }
    })
  }

  addLayer(json, map) {
    if (json) {
      L.tileLayer.iiif(json).addTo(map)
    }
  }

  addTiles(bounds) {
    if (bounds) {
      this.map.setMaxBounds(bounds)
      this.map.fitBounds(bounds)
      let imageOverlay = L.imageOverlay(this.imageURL, bounds, {
        attribution: false,
        opacity: 0.0
      })
      this.map.addLayer(imageOverlay)
      imageOverlay.on('load', (event) => {
        setTimeout(() => {
          imageOverlay.setOpacity(1.0)
        }, 250)
      })
    }
  }
}

export default DeepZoom