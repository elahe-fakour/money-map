import {
  Download,
  Languages,
  Moon,
  Settings2,
  Upload,
  WalletCards,
} from 'lucide-react'
import { type ChangeEvent, useRef, useState } from 'react'
import { isFinanceState } from '../../app/financeStateStorage'
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [backupStatus, setBackupStatus] = useState('')
  const {
    accounts,
    budgets,
    categories,
    replaceFinanceData,
    resetFinanceData,
    savingsGoals,
    settings,
    transactions,
    updateSettings,
  } = useFinance()

  const exportBackup = () => {
    const backup = {
      accounts,
      budgets,
      categories,
      savingsGoals,
      settings,
      transactions,
    }
    const backupJson = JSON.stringify(backup, null, 2)
    const backupBlob = new Blob([backupJson], { type: 'application/json' })
    const backupUrl = URL.createObjectURL(backupBlob)
    const downloadLink = document.createElement('a')

    downloadLink.href = backupUrl
    downloadLink.download = `moneymap-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.append(downloadLink)
    downloadLink.click()
    downloadLink.remove()
    URL.revokeObjectURL(backupUrl)
    setBackupStatus('فایل پشتیبان آماده دانلود شد.')
  }

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    try {
      const fileText = await file.text()
      const parsedBackup = JSON.parse(fileText)

      if (!isFinanceState(parsedBackup)) {
        throw new Error('Invalid MoneyMap backup')
      }

      replaceFinanceData(parsedBackup)
      setBackupStatus('داده‌ها از فایل پشتیبان بازیابی شدند.')
    } catch {
      setBackupStatus('فایل انتخاب‌شده با ساختار پشتیبان مانی‌مپ سازگار نیست.')
    } finally {
      event.target.value = ''
    }
  }

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
                aria-pressed={settings.currency === currency}
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
                aria-pressed={settings.themeMode === value}
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
            داده‌ها در مرورگر ذخیره می‌شوند و بعد از refresh هم باقی می‌مانند.
            برای جابه‌جایی بین مرورگرها می‌توانی فایل پشتیبان JSON بگیری.
          </p>
          <div className="settings-actions">
            <button
              className="settings-action-button"
              type="button"
              onClick={exportBackup}
            >
              <Download aria-hidden="true" size={18} />
              خروجی JSON
            </button>
            <button
              className="settings-action-button"
              type="button"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload aria-hidden="true" size={18} />
              وارد کردن پشتیبان
            </button>
            <input
              aria-label="انتخاب فایل پشتیبان JSON"
              accept="application/json,.json"
              className="settings-file-input"
              ref={fileInputRef}
              type="file"
              onChange={importBackup}
            />
          </div>
          {backupStatus ? (
            <p className="settings-backup-status" role="status" aria-live="polite">
              {backupStatus}
            </p>
          ) : null}
          <button
            className="settings-reset-button"
            type="button"
            onClick={resetFinanceData}
          >
            بازنشانی داده‌های نمونه
          </button>
        </article>
      </section>
    </div>
  )
}
