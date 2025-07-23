import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css';
//import './index.css'
import { FoodSearch } from '@/components/Food'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FoodSearch />
  </StrictMode>,
)
