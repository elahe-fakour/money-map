import { Languages, Moon, Settings2, WalletCards } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import type {
  AppLocale,
  CurrencyCode,
  TextDirection,
  ThemeMode,
} from '../../types'
import './SettingsPage.css'

const localeLabels: Record<AppLocale, string> = {
  en: 'English',
  fa: 'فارسی',
}

const directionLabels: Record<TextDirection, string> = {
  ltr: 'چپ به راست',
  rtl: 'راست به چپ',
}

const themeLabels: Record<ThemeMode, string> = {
  dark: 'تیره',
  light: 'روشن',
  system: 'سیستم',
}

const currencyOptions: CurrencyCode[] = ['IRR', 'USD', 'EUR', 'GBP']

export function SettingsPage() {
  const { settings, updateSettings } = useFinance()

  return (
    <div className="settings-page">
      <section className="settings-hero" aria-labelledby="settings-title">
        <div>
          <p className="eyebrow">شخصی‌سازی مانی‌مپ</p>
          <h1 id="settings-title">تنظیمات</h1>
          <p className="intro-copy">
            زبان، جهت متن، واحد پول و حالت ظاهری برنامه را از یک جا مدیریت کن.
          </p>
        </div>
        <div className="settings-current">
          <span>تنظیمات فعلی</span>
          <strong>{localeLabels[settings.locale]}</strong>
          <small>{directionLabels[settings.direction]}</small>
        </div>
      </section>

      <section className="settings-grid" aria-label="تنظیمات برنامه">
        <article className="settings-panel">
          <div className="settings-panel-heading">
            <Languages aria-hidden="true" size={22} />
            <div>
              <h2>زبان و جهت متن</h2>
              <p>پایه bilingual بودن اپ از همین تنظیمات کنترل می‌شود.</p>
            </div>
          </div>

          <label className="settings-field">
            <span>زبان</span>
            <select
              value={settings.locale}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  locale: event.target.value as AppLocale,
                })
              }
            >
              {Object.entries(localeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="settings-field">
            <span>جهت متن</span>
            <select
              value={settings.direction}
              onChange={(event) =>
                updateSettings({
                  ...settings,
                  direction: event.target.value as TextDirection,
                })
              }
            >
              {Object.entries(directionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
        </article>

        <article className="settings-panel">
          <div className="settings-panel-heading">
            <WalletCards aria-hidden="true" size={22} />
            <div>
              <h2>واحد پول</h2>
              <p>واحد پول پیش‌فرض برای داده‌های مالی جدید.</p>
            </div>
          </div>

          <div className="currency-options" role="group" aria-label="انتخاب واحد پول">
            {currencyOptions.map((currency) => (
              <button
                className={
                  settings.currency === currency
                    ? 'settings-chip settings-chip-active'
                    : 'settings-chip'
                }
                key={currency}
                type="button"
                onClick={() => updateSettings({ ...settings, currency })}
              >
                {currency}
              </button>
            ))}
          </div>
        </article>

        <article className="settings-panel">
          <div className="settings-panel-heading">
            <Moon aria-hidden="true" size={22} />
            <div>
              <h2>حالت ظاهری</h2>
              <p>فعلاً tokenهای روشن/تیره آماده‌اند و این state پایه UI است.</p>
            </div>
          </div>

          <div className="currency-options" role="group" aria-label="انتخاب ظاهر">
            {Object.entries(themeLabels).map(([value, label]) => (
              <button
                className={
                  settings.themeMode === value
                    ? 'settings-chip settings-chip-active'
                    : 'settings-chip'
                }
                key={value}
                type="button"
                onClick={() =>
                  updateSettings({
                    ...settings,
                    themeMode: value as ThemeMode,
                  })
                }
              >
                {label}
              </button>
            ))}
          </div>
        </article>

        <article className="settings-panel settings-panel-muted">
          <div className="settings-panel-heading">
            <Settings2 aria-hidden="true" size={22} />
            <div>
              <h2>داده‌ها</h2>
              <p>ورود و خروج CSV برای نسخه‌های بعدی آماده برنامه‌ریزی است.</p>
            </div>
          </div>
          <p className="settings-note">
            فعلاً داده‌ها در state برنامه و mock data نگهداری می‌شوند. در قدم‌های
            بعدی می‌توانیم ذخیره‌سازی دائمی مثل localStorage یا backend اضافه کنیم.
          </p>
        </article>
      </section>
    </div>
  )
}
