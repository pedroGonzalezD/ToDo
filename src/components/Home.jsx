import { useToDoList } from "../contexts/ToDoContext"
import {useState} from "react"

import style from "../styles/stylesComponents/Main.module.scss"

const Home = () => {
  const {toDoList, updateTodo, deleteTodo} = useToDoList()
  const [isEdit, setIsEdit] = useState(false)
  const [currentTask, setCurrentTask] = useState({ id: "", name: "", description: ""});

  const deleteTask = (id) =>{
    deleteTodo(id);
  }


  const handleTaskUpdate = (e) =>{
    e.preventDefault()
    
    updateTodo(currentTask.id, currentTask.name, currentTask.description)

    setIsEdit(false)
    setCurrentTask({id: "", name: "", description: ""})
  }

  const startEditing = (task) =>{
    setIsEdit(true)
    setCurrentTask({ id: task._id, name: task.title, description: task.description })
  }

  return (
    <div className={style.flex}>
    {toDoList.length > 0 ? (
      <ul className={style.ul}>
          {toDoList.map((item) =>(
            <li key={item._id} className={`${style.li} ${currentTask.id === item._id ? style.editMode : ''}`}>
              {isEdit && currentTask.id === item._id ? (
                <form onSubmit={handleTaskUpdate} className={style.form}>
                  <input 
                  type="text" 
                  value={currentTask.name}
                  onChange={(e) => setCurrentTask({...currentTask, name: e.target.value})}
                  />
                  <textarea
                    value={currentTask.description}
                    onChange={(e) => {
                      setCurrentTask({...currentTask, description: e.target.value});
                      e.target.style.height = 'auto'; 
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                    style={{width: '100%', maxHeight: '200px', overflowY: 'auto', resize: 'none'}}
                    />
                    <div className={style.div}>
                      <button onClick={() => {
                        setIsEdit(false)
                        setCurrentTask({id: "", name: "", description: ""})
                      }}
                      className={style.cancel}
                      >Cancel</button>
                      <button type="submit"
                      className={style.save}
                      >Save</button>
                    </div>
                </form>
              ) : (
                <>
              <h6>{item.title}</h6>
              <p>{item.description}</p>
              <div>
              <button onClick={() => startEditing(item)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"/></svg>
              </button>
              <button onClick={()=> deleteTask(item._id)}>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#5f6368"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"/></svg>
              </button>
              </div>
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className={style.note}>No pending tasks</p>
      )}
      </div>
  )
}

export default Home