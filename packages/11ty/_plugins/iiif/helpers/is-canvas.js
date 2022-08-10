module.exports = ({ id, canvasId, manifestId, iiifContent, choices }) => {
  return (!!canvasId && !!manifestId) || !!iiifContent || !!choices
}
