import path from 'node:path'

/**
 * @function urlPathJoin
 *
 * @argument {String} baseUrl
 * @argument {Iterable} pathSegments
 *
 * Joins path segments into a fully qualified URL for output
 *
 * @return {String} URL string
 *
 **/

const urlPathJoin = (baseUrl, ...pathSegments) => {
  const url = new URL(baseUrl)
  const basePath = url.pathname

  url.pathname = path.posix.join(basePath, ...pathSegments)

  return url.toString()
}

export default urlPathJoin
