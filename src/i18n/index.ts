import { i18n } from '@lingui/core'
import { Locale } from './types'

export async function activateLocale(locale: Locale) {
  const { messages } = await import(`./locales/${locale}/messages.po`)

  i18n.load(locale, messages)
  i18n.activate(locale)
}
