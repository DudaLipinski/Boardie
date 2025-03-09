/** @type {import('@lingui/conf').LinguiConfig} */
export default {
  locales: ['en', 'pt'],
  sourceLocale: 'en',
  catalogs: [
    {
      path: 'src/i18n/locales/{locale}/messages',
      include: ['src'],
    },
  ],
}
