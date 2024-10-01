import {useState} from "react"
import { useAuth } from "../contexts/authContext"
import { useToDoList } from "../contexts/ToDoContext";

import style from "../styles/stylesComponents/Aside.module.scss"

const Aside = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('')
  const {createTodo} = useToDoList()
  const {userInfo, logout} = useAuth()

  const openModal = () => setIsOpen(true)
  const closeModal = () => {
    setIsOpen(false)
    setTaskName('')
    setTaskDescription('')
  }
   
  const addTask = (e) => {
    e.preventDefault()

    createTodo(taskName, taskDescription)

    setTaskName('')
    setTaskDescription('')
    closeModal()
  } 

  return (
    
    <aside className={style.aside}>
      <h1 className={style.name}>TaskTide</h1>
      <h3 className={style.user}>{userInfo.username}</h3> 
      {isOpen && (
        <div className={style.overlay} onClick={closeModal}>
          
        <form onSubmit={addTask} className={style.modal} onClick={(e)=> e.stopPropagation()}>
          <label className={style.label}>
          <input 
          type="text" 
          placeholder="Task name"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}
          className={style.taskName}
          required
          />
          <span></span>
          </label>
          <label className={style.label}>
          <input
          type="text" 
          placeholder="Description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className={style.description}
          required
          />
          <span></span>
          </label>
        
          <div className={style.conB}>
          <button onClick={closeModal} className={style.cancel}>Cancel</button>
          <button type="submit" className={style.confirm}>Add task</button>
          </div>
        </form>
      </div>
      )}
      <button  onClick={openModal} className={style.add}>Add task</button> 
      <button onClick={logout} className={style.logout}>logOut</button>
    </aside>
  )
}

export default Aside