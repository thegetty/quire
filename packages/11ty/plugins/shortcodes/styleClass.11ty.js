/**
 * { function_description }
 *
 * @param      {<type>}   content  The content
 * @param      {<type>}   data     The data
 *
 * @return     {boolean}  { description_of_the_return_value }
 */
module.exports = (content, data) => {
  return `<div class="${data.classes}">${content}</div>`
}
