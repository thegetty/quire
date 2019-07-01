//@ts-check

import L from "leaflet";
import "leaflet-iiif";
class DeepZoom {
  // add map array to access map objects outside of Deepzoom class
  constructor(id, mapArr) {
    this.el = id;

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

    this.imageURL = $(`#${this.el}`).attr("src");
    this.iiif = $(`#${this.el}`).data("iiif");

    if (this.imageURL) {
      let image = new Image();
      image.src = this.imageURL;
      this.addImageProcess(image)
        .then(arr => {
          this.imgHeight = arr.height;
          this.imgWidth = arr.width;
          this.center = [0, 0];
          this.defaultZoom = 0;
          let zoom = {
            min: 0,
            default: 1,
            max: 5
          };
          this.map = this.createMap(zoom);
          // add leaflet objects to array
          mapArr.push(this.map);
          if ($(`#${this.el}`).data("catalogue-entry") === undefined) {
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
      this.defaultZoom = 0;
      let zoom = {
        min: 0.5,
        default: 0,
        max: 4
      };
      this.map = this.createMap(zoom);
      if ($(`#${this.el}`).data("catalogue-entry") === undefined) {
        // @ts-ignore
        window["mapID"] = this.map;
      }
      this.addLayer(this.iiif, this.map);
      this.runMapTimeouts(this.map);
    } else {
      this.center = [0, 0];
      this.defaultZoom = 0;
      let zoom = {
        min: 0.5,
        default: 0,
        max: 4
      };
      this.map = this.createMap(zoom);
      if ($(`#${this.el}`).data("catalogue-entry") === undefined) {
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

  /** @param {object} zoom must be an object */
  createMap(zoom) {
    return L.map(this.el, {
      center: [0, 0],
      crs: L.CRS.Simple,
      zoom: zoom.default,
      minZoom: zoom.min,
      maxZoom: zoom.max,
      renderer: L.canvas()
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
