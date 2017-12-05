const _ = require('lodash')
const axios = require('axios')
const EventEmitter = require('events')

/**
 * Epub Class.
 * @param {Object} bookData
 */
class Epub extends EventEmitter {
  constructor (bookData) {
    super()
    this.data = bookData
  }

  title () {
    if (this.data.subtitle && this.data.reading_line) {
      return `${this.data.title}: ${this.data.subtitle} ${this.data.reading_line}`
    } else if (this.data.subtitle) {
      return `${this.data.title}: ${this.data.subtitle}`
    }
  }

  creators () {
    if (!this.data.primary_contributor) { return false }

    let creators = _.castArray(this.data.primary_contributor)
    return creators.map((contributor) => {
      return {
        name: `${contributor.first_name} ${contributor.last_name}`,
        'file-as': `${contributor.last_name}, ${contributor.first_name}`,
        role: `${contributor.role}`
      }
    })
  }

  publishers () {
    if (!this.data.publishers) { return false }

    let publishers = _.castArray(this.data.publishers)
    return publishers.map((p) => {
      if (p.location) {
        return `${p.name}, ${p.location}`
      } else {
        return `${p.name}`
      }
    })
  }

  getContent (urls) {
    let promiseArray = urls.map(url => axios.get(url))
    return axios.all(promiseArray)
  }

  serialize () {
    this.getContent(this.data.chapters)
      .catch(error => { console.log(error) })
      .then(results => {
        this.emit('finished')

        console.log({
          title: this.title(),
          cover: '',
          url: this.data.url,
          isbn: this.data.isbn,
          languages: this.data.language,
          date: this.data.pub_date,
          creator: this.creators(),
          publisher: this.publishers(),
          description: this.data.description.full,
          rights: this.data.copyright,
          pages: results.map(r => r.data)
        })
      })
  }
}

module.exports = Epub
