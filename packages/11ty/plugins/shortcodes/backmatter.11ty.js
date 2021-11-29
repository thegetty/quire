/**
 * { function_description }
 *
 * @param      {String}  content  content between shortcode tags
 *
 * @return     {boolean}  A styled HTML <div> element with the content
 */
module.exports = (context, content) => {
  return `<div class="backmatter">${content}</div>`
}
