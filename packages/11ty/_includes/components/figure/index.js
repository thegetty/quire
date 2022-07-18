const canvasPanel = require('./canvas-panel')
const caption = require('./caption')
const choices = require('./choices')
const image = require('./image')
const imageService = require('./image-service')
const label = require('./label')
const modallink = require('./modal-link')
const placeholder = require('./placeholder')
const soundcloud = require('./soundcloud')
const table = require('./table')
const video = require('./video')
const vimeo = require('./vimeo')
const youtube = require('./youtube')

module.exports = {
  canvasPanel,
  figurecaption: caption,
  figurechoices: choices,
  figureimage: image,
  figurelabel: label,
  figuremodallink: modallink,
  figureplaceholder: placeholder,
  figuresoundcloud: soundcloud,
  figuretable: table,
  figurevideo: video,
  figurevimeo: vimeo,
  figureyoutube: youtube,
  imageService
}
