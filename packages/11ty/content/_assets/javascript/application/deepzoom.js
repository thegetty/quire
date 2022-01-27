//@ts-check

import L from "leaflet";
import "leaflet-iiif";
class DeepZoom {
  // add map array to access map objects outside of Deepzoom class
  constructor(id, mapArr) {
    this.id = id;
    this.el = document.querySelector(`#${this.id}`);

    // remove and refresh before init
    // @ts-ignore
    if (figureModal) {
      if (window["mapID"] != undefined || window["mapID"] != undefined) {
        window["mapID"].off();
        window["mapID"].remove();
      }
      let node = document.getElementById(id);
      if (node) {
        while (node.firstChild) {
          node.removeChild(node.firstChild);
        }
      }
    }

    this.catalogueEntry = this.el.getAttribute("data-catalogue-entry");
    this.imageURL = this.el.getAttribute("src");
    this.iiif = this.el.getAttribute("data-iiif");

    /** 
     * Leaflet options object
     * https://leafletjs.com/reference-1.7.1.html#map-option
     */
    const options = {
      maxZoom: this.el.getAttribute('data-zoom-max') || 6,
      minZoom: 1,
      scrollWheelZoom: !this.catalogueEntry,
      touchZoom: !this.catalogueEntry,
      zoom: 1
    };

    if (this.imageURL) {
      let image = new Image();
      image.src = this.imageURL;
      this.addImageProcess(image)
        .then(arr => {
          this.imgHeight = arr.height;
          this.imgWidth = arr.width;
          this.center = [0, 0];
          this.map = this.createMap(options);
          // add leaflet objects to array
          mapArr.push(this.map);
          if (this.catalogueEntry === undefined) {
            window["mapID"] = this.map;
          }
          this.southWest = this.map.unproject(
            [0, this.imgHeight],
            this.map.getMaxZoom() - 1
          );
          this.northEast = this.map.unproject(
            [this.imgWidth, 0],
            this.map.getMaxZoom() - 1
          );
          let bounds = new L.LatLngBounds(this.southWest, this.northEast);
          this.addTiles(bounds);
          // well invalidate
          // this.runMapTimeouts(this.map);
        })
        .catch(error => console.error(error));
    } else if (this.imageURL && this.iiif) {
      this.center = [0, 0];
      this.map = this.createMap(options);
      if (this.catalogueEntry === undefined) {
        window["mapID"] = this.map;
      }
      this.addLayer(this.iiif, this.map);
      this.runMapTimeouts(this.map);
    } else {
      this.center = [0, 0];
      this.map = this.createMap(options);
      if (this.catalogueEntry === undefined) {
        window["mapID"] = this.map;
      }
      this.addLayer(this.iiif, this.map);
      this.runMapTimeouts(this.map);
    }
  }

  /**
   * validateSize
   * @description
   * invalidateSize map as a promise
   * @param {object} map must be an integer
   */
  validateSize(map) {
    return new Promise((resolve, reject) => {
      if (!map) reject(new Error("No map!"));
      setTimeout(() => {
        let modal = document.querySelector(".mfp-content");
        if (modal) {
          if (
            map._container ===
            modal.getElementsByTagName("figure")[0].children[0]
          ) {
            resolve(map.invalidateSize());
          }
        } else {
          resolve(map.invalidateSize());
        }
      }, 250);
    });
  }

  /**
   * runMapTimeouts
   * @description
   * run map timeout functions
   * @param {object} map must be an integer
   */
  runMapTimeouts(map) {
    setTimeout(() => {
      this.validateSize(map);
    }, 100);
    if ($(window)) {
      $(window).on("resize", event => {
        if (map) {
          this.validateSize(map);
        }
      });
    }
  }

  /**
   * addImageProcess
   * @description
   * return an array of the natural height and width of the current image being processed
   * @param {object} img must be an integer
   */
  addImageProcess(img) {
    return new Promise((resolve, reject) => {
      img.onload = () => {
        let arr = [];
        arr["height"] = img.naturalHeight;
        arr["width"] = img.naturalWidth;
        resolve(arr);
      };
      img.onerror = reject;
    });
  }

  /** 
   * @param {object} Leaflet options
   */
  createMap(options) {
    return L.map(this.id, {
      center: [0, 0],
      crs: L.CRS.Simple,
      renderer: L.canvas(),
      ...options
    });
  }

  addLayer(json, map) {
    if (json) {
      L.tileLayer.iiif(json).addTo(map);
    }
  }

  addTiles(bounds) {
    if (bounds) {
      this.map.setMaxBounds(bounds);
      this.map.fitBounds(bounds);
      let imageOverlay = L.imageOverlay(this.imageURL, bounds, {
        opacity: 0.0
      });
      this.map.addLayer(imageOverlay);
      imageOverlay.on("load", event => {
        setTimeout(() => {
          imageOverlay.setOpacity(1.0);
        }, 250);
      });
    }
  }
}

export default DeepZoom;
