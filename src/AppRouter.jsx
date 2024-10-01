import {router} from './router'
import {RouterProvider} from 'react-router-dom'
import ToDoListProvider from "./contexts/toDoContext"
import { AuthProvider } from './contexts/authContext'

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