/**
 * Localization service
 *
 * @class  LocaleService
 */
export class LocaleService {
  /**
   * @param  {Object}  i18nProvider
   */
  constructor(i18nProvider) {
    this.i18nProvider = i18nProvider
  }

  /**
   * Gets the current locale
   *
   * @return  {String}  current locale code
   */
  getCurrentLocale() {
    return this.i18nProvider.getLocale()
  }

  /**
   * Get a list of supported locales
   *
   * @return {Array}  List of supported locale codes
   */
  getLocales() {
    return this.i18nProvider.getLocales()
  }

  /**
   * Sets the current locale
   *
   * @param  {String}  locale  i18n locale code
   * @return  {String}  the current locale code
   */
  setLocale(locale) {
    const locales = this.getLocales()
    if (!locales.includes(locale)) {
      throw new Error(`
        Unknown locale code ${locale} Unable to set current locale;
        supported locales: ${locales}
      `)
    }
    return this.i18nProvider.setLocale(locale)
  }

  /**
   * Translate a string
   *
   * @param  {String}  string   string to translate
   * @param  {Object}  options  translation options
   */
  translate(string, options) {
    return this.i18nProvider.t(string)
  }
}
