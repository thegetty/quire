module.exports = ({ annotations, id, canvasId, manifestId, iiifContent }) => {
  return (!!canvasId && !!manifestId) || !!iiifContent || !!annotations
}
