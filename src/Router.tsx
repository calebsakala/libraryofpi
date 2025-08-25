import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import NotFound from './components/NotFound'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}
