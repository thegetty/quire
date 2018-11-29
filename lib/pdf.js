const util = require('util')
const fs = require('fs-extra')
const writeFile = util.promisify(fs.writeFile)

const checkFileExists = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.access(filepath, fs.F_OK, error => {
      resolve(!error)
    })
  })
}

const createTitlePage = (data) => {
  return new Promise(function (resolve, reject) {
    if (data === '' || data === undefined || data === null) {
      reject(new Error('Something went wrong. Please try again.'), null)
    } else {

      let contributor

      if (data.contributor_as_it_appears !== null) {
        contributor = data.contributor_as_it_appears
      } else {
        contributor = data.contributor.map(d => {
          let name = d.full_name || `${d.first_name} ${d.last_name}`
          return ` ${name}`
        })
      }

      let title = data.title !== `` ? `<span class="title-tp">${data.title}</span></br>` : ``
      let subTitle = data.subtitle !== `` ? `<span class="sub-title">${data.subtitle}</span></br>` : ``
      contributor = contributor !== `` ? `<span class="contributor">${contributor.toString().replace(/,(?=[^,]*$)/, ' and')}</span></br>` : ``
      let publisherName = data.publisher[0].name !== `` ? data.publisher[0].name : ``
      let publisherLocation = data.publisher[0].location !== `` ? data.publisher[0].location : ``
      let publisher = publisherName !== `` && publisherLocation !== `` ? `<span class="publisher">${publisherName}, ${publisherLocation}</span></br>` : ``

      let template = `---
title: title page
weight: 1
type: page
search: false
class: list
chapter: false
menu: false
toc: false
---
<div class="title-page">
 ${title}
 ${subTitle}
 ${contributor}
 ${publisher}
</div>
`
      writeFile('content/title.md', template)
      resolve(data)

    }
  })
}

const createHalfTitlePage = (data) => {
  return new Promise(function (resolve, reject) {
    if (data === '' || data === undefined || data === null) {
      reject(new Error('Something went wrong. Please try again.'), null)
    } else {

      let title = data.title !== `` ? `<span class="title-htp">${data.title}</span></br>` : ``
      let subTitle = data.subtitle !== `` ? `<span class="sub-title">${data.subtitle}</span></br>` : ``


      let template = `---
title: half title page
weight: 1
type: page
search: false
class: list
chapter: false
menu: false
toc: false
---

<div class="half-title-page">
 ${title}
 ${subTitle}
</div>
`
      writeFile('content/half-title.md', template)
      resolve(data)
    }
  })
}

const createPages = (data, spinner) => {
  return new Promise(function (resolve, reject) {
    if (data === '' || data === undefined || data === null) {
      reject(new Error('Something went wrong. Please try again.'), null)
    } else {
      createHalfTitlePage(data)
        .then(() => {
          // spinner.info([`createHalfTitlePage created`])
        })
      createTitlePage(data)
        .then(() => {
          // spinner.info([`createTitlePage created`])
        })
        .catch(err => {
          spinner.fail([`${err}`])
          process.exit(1)
          removePages()
        })
      resolve(data)
    }
  })
}

const removePages = () => {
  let halfTitle = checkFileExists('content/half-title.md')
  let title = checkFileExists('content/title.md')
  return new Promise(function (resolve, reject) {
    if (!title && !halfTitle) {
      reject(new Error('Something went wrong. Please try again.'), null)
    } else {
      let files = ['content/half-title.md', 'content/title.md']
      for (const file of files) {
        fs.unlink(file, err => {
          if (err) throw err;
        });
      }
      resolve(removePages)
    }
  })
}

const PDF = (data, spinner) => {
  return new Promise(function (resolve, reject) {
    if (data === '' || data === undefined || data === null) {
      reject(new Error('Something went wrong. Either data is not included or is the wrong source. Please try again.'), null)
    } else if (spinner === '') {
      reject(new Error('Something went wrong. Either spinner is not included or is the wrong source. Please try again.'), null)
    } else {
      if (data) {
        createPages(data, spinner)
          .then(() => {
            // spinner.info([`createPages`])
          })
        fs.ensureFile('content/half-title.md')
          .then(() => {
            // spinner.info([`checkFileExists1`])
          })
        fs.ensureFile('content/title.md')
          .then(() => {
            resolve(data)
            // spinner.info([`checkFileExists2`])
          })
          .catch(err => {
            spinner.fail([`${err}`])
            process.exit(1)
            removePages()
          })
      }
    }
  })
}

module.exports = { PDF, removePages }





