/** @type {import('@lingui/conf').LinguiConfig} */
module.exports = {
  locales: ['en', 'pt'],
  sourceLocale: 'en',
  format: 'minimal',
  catalogs: [
    {
      path: 'src/intl/locales/{locale}/messages',
      include: ['src'],
    },
  ],
}
