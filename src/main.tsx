import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.tsx'
import { createHashRouter, RouterProvider } from 'react-router-dom';
import { LoginPage } from './modules/login/login_page.tsx';
import { OccupationReport } from './modules/report/occupation_report.tsx';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primeflex/primeflex.min.css';
import 'primeicons/primeicons.css';
        

const router = createHashRouter([
  {
    path: '/report/occupation',
    element: <OccupationReport />
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <LoginPage />,
  },
  {
    path: '/',
    element: <LoginPage />,
    errorElement: <LoginPage />,
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrimeReactProvider>
      <RouterProvider router={router} />
    </PrimeReactProvider>
  </StrictMode>,
)
