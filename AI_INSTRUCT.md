پیشنهاد من برای تکنولوژی‌ها:

- `React + TypeScript`
- `Vite`
- `Material UI` یا `shadcn/ui`
- `React Router`
- `Redux Toolkit` یا `Context + useReducer`
- `React Hook Form + Zod`
- `Recharts`
- `Mock Service Worker` یا `json-server`
- `React Testing Library`
- `Playwright`
- `Storybook`

اگر هدفت آگهی‌های React است، این ترکیب خیلی خوب توانایی‌هایت را نشان می‌دهد.

## پرامپت اصلی برای AI

این پرامپت را می‌توانی به AI بدهی:

```text
I want to build a portfolio-level frontend project called MoneyMap.

MoneyMap is a responsive personal finance management web app built with React and TypeScript. The goal is to showcase professional frontend skills for a React developer role.

The app should allow users to manage personal income, expenses, budgets, accounts, savings goals, and monthly financial reports. It should feel like a real SaaS-style financial dashboard, not a simple demo.

Tech requirements:
- React with TypeScript
- Vite
- React Router
- State management using Redux Toolkit or Context API with useReducer
- Component library such as Material UI or shadcn/ui
- Form handling with React Hook Form
- Validation with Zod
- Charts using Recharts
- Mock REST API using MSW, json-server, or a local mock service
- Responsive design for mobile, tablet, and desktop
- Unit and integration tests with React Testing Library
- End-to-end tests with Playwright
- Storybook for reusable UI components
- Performance optimization and Lighthouse-friendly implementation

Main features:
1. Dashboard
- Show total balance
- Monthly income
- Monthly expenses
- Savings rate
- Budget usage
- Recent transactions
- Expense breakdown chart
- Monthly cash flow chart

2. Transactions
- Add, edit, delete transactions
- Transaction types: income, expense, transfer
- Fields: amount, date, category, account, note
- Search transactions
- Filter by date range, type, category, and account
- Sort by date and amount
- Empty, loading, and error states

3. Categories
- Default categories for income and expenses
- Category icons and colors
- Filter reports by category

4. Budgets
- Create monthly budgets per category
- Show spent amount, remaining amount, and percentage used
- Warning state when user is close to the budget limit
- Over-budget state

5. Accounts
- Add accounts such as cash, bank card, savings account
- Show account balances
- Support transfer between accounts

6. Savings Goals
- Create savings goals
- Set target amount and deadline
- Track progress
- Add contribution transactions

7. Reports
- Monthly summary
- Income vs expense chart
- Category breakdown
- Comparison with previous month
- Simple insights such as highest spending category

8. Settings
- Currency selection
- Light/dark mode
- Data export to CSV
- Optional data import from CSV

UX/UI requirements:
- Clean professional dashboard UI
- Fully responsive layout
- Sidebar on desktop
- Bottom navigation or compact menu on mobile
- Accessible forms and buttons
- Clear validation messages
- Good empty states
- Loading skeletons
- Error handling
- No overlapping UI on small screens

Code quality requirements:
- Reusable components
- Clear folder structure
- Custom hooks where useful
- Pure components where appropriate
- Separation between UI, state, and API logic
- Typed data models
- Clean naming
- Documentation in README
- Storybook stories for core components
- Tests for important user flows

Please help me build this project step by step from setup to final polish. For each step, explain what to implement, which files to create, and what concepts I should focus on as a frontend developer.
```

## مسیر مرحله‌به‌مرحله ساخت MoneyMap

### مرحله 1: تعریف پروژه و فیچرها

قبل از کدنویسی، یک فایل ساده بساز به اسم:

```text
PROJECT_PLAN.md
```

داخلش بنویس:

- هدف پروژه چیست؟
- کاربر اصلی کیست؟
- چه فیچرهایی در MVP هستند؟
- چه فیچرهایی بعدا اضافه می‌شوند؟
- چه مهارت‌هایی از آگهی کار را پوشش می‌دهد؟

MVP پیشنهادی:

- Dashboard
- Transactions
- Categories
- Budgets
- Accounts
- Reports basic
- Responsive layout
- Tests basic
- README

فیچرهای بعدی:

- Savings Goals
- CSV import/export
- Playwright
- Storybook
- Performance optimization

## مرحله 2: ساخت پروژه

با Vite پروژه را بساز:

```bash
npm create vite@latest moneymap -- --template react-ts
cd moneymap
npm install
npm run dev
```

بعد Git را فعال کن:

```bash
git init
git add .
git commit -m "Initial React TypeScript setup"
```

## مرحله 3: نصب پکیج‌های اصلی

```bash
npm install react-router-dom @reduxjs/toolkit react-redux react-hook-form zod @hookform/resolvers recharts
```

اگر Material UI می‌خواهی:

```bash
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
```

برای تست:

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

برای Playwright:

```bash
npm install -D @playwright/test
npx playwright install
```

برای Storybook:

```bash
npx storybook@latest init
```

## مرحله 4: ساختار فولدرها

ساختار پیشنهادی:

```text
src/
  app/
    store.ts
    router.tsx
  components/
    ui/
    layout/
    charts/
    forms/
  features/
    dashboard/
    transactions/
    budgets/
    accounts/
    categories/
    reports/
    settings/
  hooks/
  services/
  types/
  utils/
  data/
  test/
```

این ساختار برای کارفرما خوب است چون نشان می‌دهد با معماری فرانت‌اند آشنایی داری.

## مرحله 5: طراحی مدل داده‌ها

در `src/types/finance.ts` مدل‌ها را تعریف کن:

```ts
export type TransactionType = "income" | "expense" | "transfer";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  categoryId: string;
  accountId: string;
  toAccountId?: string;
  note?: string;
}

export interface Account {
  id: string;
  name: string;
  type: "cash" | "bank" | "savings";
  balance: number;
}

export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color: string;
  icon: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  month: string;
  limit: number;
}
```

اینجا TypeScript را خوب نشان می‌دهی.

## مرحله 6: ساخت Layout اصلی

اول UI کلی را بساز:

- `AppLayout`
- `Sidebar`
- `Topbar`
- `MobileNavigation`
- `PageHeader`

در دسکتاپ sidebar داشته باش.  
در موبایل navigation جمع‌وجور یا bottom nav داشته باش.

صفحات اصلی:

```text
/dashboard
/transactions
/budgets
/accounts
/reports
/settings
```

## مرحله 7: ساخت Dashboard

داشبورد باید اولین صفحه قوی پروژه باشد.

کامپوننت‌ها:

- `SummaryCard`
- `BalanceCard`
- `ExpenseBreakdownChart`
- `CashFlowChart`
- `RecentTransactions`
- `BudgetProgressList`

داده‌ها فعلا mock باشند.

اینجا نشان می‌دهی:

- کامپوننت‌سازی
- props
- charts
- responsive grid
- derived state

## مرحله 8: ساخت Transactions

این مهم‌ترین بخش پروژه است.

فیچرها:

- جدول تراکنش‌ها
- فرم افزودن تراکنش
- ویرایش تراکنش
- حذف تراکنش
- سرچ
- فیلتر
- sort
- validation

فرم با `React Hook Form + Zod` باشد.

مثلا validation:

- مبلغ باید بیشتر از صفر باشد
- تاریخ اجباری باشد
- دسته‌بندی اجباری باشد
- برای transfer حساب مقصد اجباری باشد
- حساب مبدا و مقصد نباید یکی باشند

این بخش برای مصاحبه خیلی ارزشمند است.

## مرحله 9: State Management

برای پروژه‌ای مثل MoneyMap، `Redux Toolkit` انتخاب خوبی است.

sliceها:

```text
transactionsSlice
accountsSlice
categoriesSlice
budgetsSlice
settingsSlice
```

در این مرحله کارفرما می‌بیند که فقط useState ساده بلد نیستی و می‌توانی state اپ را مدیریت کنی.

## مرحله 10: اتصال به Mock API

برای اینکه پروژه واقعی‌تر شود، از یک mock API استفاده کن.

گزینه ساده‌تر:

```text
json-server
```

گزینه حرفه‌ای‌تر:

```text
MSW
```

برای نمونه‌کار، `MSW` خیلی خوب است چون برای تست هم کاربرد دارد.

مسیرهای API:

```text
GET /transactions
POST /transactions
PUT /transactions/:id
DELETE /transactions/:id

GET /accounts
GET /categories
GET /budgets
POST /budgets
```

## مرحله 11: Budgets

صفحه بودجه‌بندی بساز:

- انتخاب ماه
- انتخاب دسته‌بندی
- تعیین سقف بودجه
- نمایش خرج‌شده
- نمایش باقی‌مانده
- progress bar
- warning وقتی مصرف بالای ۸۰٪ شد
- over budget وقتی از ۱۰۰٪ رد شد

این بخش UX و منطق مالی را خوب نشان می‌دهد.

## مرحله 12: Accounts

صفحه حساب‌ها:

- حساب نقدی
- کارت بانکی
- حساب پس‌انداز
- نمایش موجودی هر حساب
- افزودن حساب جدید
- انتقال بین حساب‌ها

اینجا می‌توانی از تجربه حسابداری‌ات استفاده کنی و پروژه را واقعی‌تر کنی.

## مرحله 13: Reports

گزارش‌ها را ساده ولی حرفه‌ای بساز:

- درآمد ماهانه
- هزینه ماهانه
- سود/کسری ماه
- نمودار income vs expense
- نمودار دسته‌بندی هزینه‌ها
- مقایسه با ماه قبل
- پرهزینه‌ترین دسته‌بندی

برای این صفحه `Recharts` عالی است.

## مرحله 14: Responsive Design

این را از آخر نگذار. از همان ابتدا رعایت کن.

چک کن در:

- موبایل ۳۶۰px
- موبایل ۴۳۰px
- تبلت
- لپ‌تاپ
- دسکتاپ بزرگ

نکات مهم:

- جدول تراکنش‌ها در موبایل بهتر است تبدیل به card list شود
- sidebar در موبایل مخفی شود
- chartها عرض کامل بگیرند
- فرم‌ها تک‌ستونه شوند
- دکمه‌ها و فیلترها به هم نریزند

## مرحله 15: تست‌ها

تست‌های مهم:

با React Testing Library:

- رندر شدن Dashboard
- افزودن تراکنش جدید
- validation فرم تراکنش
- فیلتر کردن تراکنش‌ها
- نمایش over-budget state

با Playwright:

- کاربر وارد صفحه تراکنش‌ها می‌شود
- تراکنش جدید ثبت می‌کند
- به داشبورد برمی‌گردد
- تغییرات را در summary می‌بیند

این دقیقا به آگهی کاری که فرستادی وصل است.

## مرحله 16: Storybook

برای این کامپوننت‌ها story بساز:

- Button
- Input
- Select
- Modal
- SummaryCard
- TransactionForm
- BudgetProgress
- EmptyState
- ChartCard

در مصاحبه می‌توانی بگویی:
«برای مستندسازی و تست بصری کامپوننت‌های reusable از Storybook استفاده کردم.»

## مرحله 17: Performance

کارهایی که خوب است انجام دهی:

- استفاده از `React.memo` برای کامپوننت‌های سنگین
- استفاده از `useMemo` برای محاسبات گزارش‌ها
- lazy loading برای routeها
- بررسی bundle size
- اجرای Lighthouse
- جلوگیری از re-renderهای غیرضروری

مثلا صفحات را lazy کن:

```ts
const DashboardPage = lazy(() => import("../features/dashboard/DashboardPage"));
```

## مرحله 18: README حرفه‌ای

README خیلی مهم است. داخلش بنویس:

- معرفی پروژه
- اسکرین‌شات
- لینک دمو
- تکنولوژی‌ها
- فیچرها
- معماری فولدرها
- روش اجرا
- روش اجرای تست‌ها
- چیزهایی که یاد گرفتی
- برنامه توسعه آینده

مثلا:

```text
MoneyMap is a responsive personal finance dashboard built with React, TypeScript, Redux Toolkit, React Hook Form, Zod, Recharts, Storybook, and Playwright.
```

## مرحله 19: دیپلوی

برای دمو:

- Vercel
- Netlify

بعد لینک دمو را در رزومه و GitHub بگذار.

## مرحله 20: نسخه نهایی برای ارائه به کارفرما

در توضیح پروژه بنویس:

```text
MoneyMap is a responsive personal finance management app designed to help users track income, expenses, budgets, accounts, and financial reports. I built it with React and TypeScript using reusable components, state management, form validation, charts, mock APIs, automated tests, Storybook documentation, and performance optimizations.
```

## ترتیب پیشنهادی ساخت

بهترین ترتیب این است:

1. Setup پروژه
2. Layout و routing
3. Mock data و types
4. Dashboard
5. Transactions
6. Redux/state management
7. Forms و validation
8. Budgets
9. Accounts
10. Reports
11. Responsive polish
12. Tests
13. Storybook
14. Performance
15. README و deploy