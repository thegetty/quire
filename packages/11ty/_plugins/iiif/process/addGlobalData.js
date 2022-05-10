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

  /**
   * Very simplified method to get choices - expects a valid manifest where choices all have identifiers
   * @todo replace with vault helper
   */
  const getChoices = (annotations = []) => {
    return annotations.flatMap(({ id, type }) => {
      const annotation = vault.get(id);
      if (annotation.motivation.includes('painting')) {
        const bodies = vault.get(annotation.body);
        for (const body of bodies) {
          const { items, type } = body;
          return type === 'Choice' ? items.map(({ id }) => vault.get(id)) : [];
        }
      }
    });
  };

  for (const [index, figure] of figures.figure_list.entries()) {
    switch (true) {
      case isImageService(figure):
        const src = figure.src.startsWith('http')
          ? figure.src
          : path.join(
              '/',
              output,
              path.parse(figure.src).name,
              imageServiceDirectory,
              'info.json'
            );
        Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
          src
        });
        break;
      case hasCanvasPanelProps(figure):
        const { canvas, choiceId, manifest } = await figureIIIF(figure);
        let choices = getChoices(canvas.annotations);
        if (!choices.length && canvas.items.length) {
          canvas.items.map(({ id, type }) => {
            if (type === 'AnnotationPage') {
              const annotationPage = vault.get(id);
              choices = getChoices(annotationPage.items);
            }
          });
        }
        Object.assign(eleventyConfig.globalData.figures.figure_list[index], {
          canvas,
          choices,
          choiceId,
          manifest
        });
        break;
      default:
        break;
    }
  }
};
