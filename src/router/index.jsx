import {createBrowserRouter} from 'react-router-dom'
import Layout from '../Layout/Layout'
import Home from '../components/Home'
import Auth from '../pages/Auth'
import ProtectedRoute from '../pages/ProtectedRoute'

export const router = createBrowserRouter([
  {
    path:'/login',
    element:<Auth/>
  },
  {
    path:'/',
    element:<ProtectedRoute>
        <Layout/>
    </ProtectedRoute>,
    children: [
      {
        index: true,
        element:<Home/>
      }
    ]
  },
])