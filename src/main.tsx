import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { FinanceProvider } from './app/FinanceProvider.tsx'
import { router } from './app/router.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FinanceProvider>
      <RouterProvider router={router} />
    </FinanceProvider>
  </StrictMode>,
)
