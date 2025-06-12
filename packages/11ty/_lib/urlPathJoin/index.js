import { posix as path } from 'node:path'
/**
 * @function urlPathJoin
 *
 * @argument {String} url
 * @argument {Iterable} segs
 *
 * Parses `url` and safely joins all of `segs` to its pathname
 *
 * @return {String}
 *
 **/

const urlPathJoin = (url, ...segs) => {
  const base = new URL(url)
  const basePath = base.pathname

  base.pathname = path.join(basePath, ...segs)

  return base.href
}

export default urlPathJoin
