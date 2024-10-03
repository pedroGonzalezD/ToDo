import {router} from './router'
import {RouterProvider} from 'react-router-dom'
import ToDoListProvider from "./contexts/ToDoContext.jsx"
import { AuthProvider } from './contexts/authContext.jsx'

const AppRouter = () => {
  return(
    <AuthProvider>
      <ToDoListProvider>
        <RouterProvider router={router}/>
     </ToDoListProvider>
    </AuthProvider>
  )
}

export default AppRouter