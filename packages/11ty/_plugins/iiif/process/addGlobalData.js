const { globalVault } = require('@iiif/vault');
const path = require('path');
const vault = globalVault();

/**
 * Fetches IIIF data needed to render canvas panel tags from vault and adds it to figures.yaml
 * @param  {Object} eleventyConfig
 */
module.exports = async (eleventyConfig) => {
  const figureIIIF = eleventyConfig.getFilter('figureIIIF');
  const isImageService = eleventyConfig.getFilter('isImageService');
  const hasCanvasPanelProps = eleventyConfig.getFilter('hasCanvasPanelProps');
  const { figures, iiifConfig } = eleventyConfig.globalData;
  const { imageServiceDirectory, output } = iiifConfig;

  for (const [index, figure] of figures.figure_list.entries()) {
    switch (true) {
      case isImageService(figure):
        const info = figure.src.startsWith('http')
          ? figure.src
          : path.join(
              '/',
              output,
              path.parse(figure.src).name,
              imageServiceDirectory,
              'info.json'
            );
        Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
          iiif: { info }
        });
        break;
      case hasCanvasPanelProps(figure):
        const { canvas, choiceId, choices, iiifContent, manifest } = await figureIIIF(figure);
        Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
          iiif: {
            choices,
            canvas,
            choiceId,
            iiifContent,
            manifest
          }
        });
        break;
      default:
        break;
    }
  }
};
