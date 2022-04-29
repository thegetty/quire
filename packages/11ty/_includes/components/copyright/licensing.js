module.exports = function(eleventyConfig) {
  return function (params) {
    const { publication } = eleventyConfig.globalData
    const { license } = publication

    let licenseText = ''

    const licenseAbbreviation = license.abbreviation || license.name
    const licenseName = license.url
      ? `<a rel="license" href="${license.url}" target="_blank">${license.name}</a>`
      : license.name

    if (license.scope == "some-exceptions") {
      licenseText += `
        Except where otherwise noted, this work is licensed under a ${licenseName}.
      `
    } else if (license.scope === "text-only") {
      licenseText += `
        The text of this work is licensed under a ${licenseName}. Unless otherwise noted, all illustrations are excluded from the ${licenseAbbreviation}  license.
      `
    } else {
      licenseText += `
        This work is licensed under a ${licenseName}.
      `
    }

    const licenseLink = license.url ? `, visit ${license.url} or` : ''

    return `
      ${licenseText}
      <span class="is-print-only">
        To view a copy of this license ${licenseLink}send a letter to Creative Commons, PO Box 1866, Mountain View, CA 94042.
      </span>
    `
  }
}
