import Aside from "../components/Aside"
import {Outlet} from 'react-router-dom'
import "../index.scss"

const Layout = () => {
  
  return (
      <>
        <Aside></Aside>
        <main className='main'>
          <Outlet/>
        </main>
      </>
      
  )
}

export default Layout