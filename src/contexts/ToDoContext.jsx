/* eslint-disable react/prop-types */
import {createContext, useContext, useState, useEffect} from 'react'
import { useAuth  } from './AuthContext'

const ToDoListContext = createContext()

const ToDoListProvider = ({children}) =>{
  const [toDoList, setToDoList] = useState([])
  const {accessToken, newAccessToken, userInfo} = useAuth()

  useEffect(() =>{
    getTodo()
    
  }, [userInfo])

const getTodo = async () => {
  if(!accessToken) return null
  try {
    const response = await fetch("http://localhost:5000/api/todos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }
    const data = await response.json();
    
    setToDoList(data);

    return data;
  
      } catch (error) {
        console.log(error);
      }
}

const createTodo = async (name, description) => {
  try {
    const response = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({title: name, description: description}),
    });

    if(response.status === 401 || response.status === 403) {
      const newToken = await newAccessToken()

      if (!newToken){
        return console.log("access denied")
      }

       const retryResponse = await fetch("http://localhost:5000/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newToken}`,
        },
        body: JSON.stringify({title: name, description: description})
      })

      if (!retryResponse.ok) {
        const errorMessage = `Error ${retryResponse.status}: ${retryResponse.statusText}`;
        throw new Error(errorMessage);
      }
      
      const data = await retryResponse.json();
      setToDoList([data, ...toDoList]);
      return data;
    }
    
    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const data = await response.json();
    
    setToDoList([data, ...toDoList ])
    return data;
  
      } catch (error) {
        console.log(error);
      }
}

const updateTodo = async (id, updatedTitle, updatedDescription) => {
  try {
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ title: updatedTitle, description: updatedDescription }),
    });

    if (!response.ok) {
      const errorMessage = `Error ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    const updatedTodo = await response.json();
    
    setToDoList(
      toDoList.map((todo) => (todo._id === id ? updatedTodo : todo))
    );

    return updatedTodo;
  } catch (error) {
    console.log(error);
  }
};

const deleteTodo = async (id) => {
  try {
    const response = await fetch(`http://localhost:5000/api/todos/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    
    setToDoList((prevList) => prevList.filter((todo) => todo._id !== id));
  } catch (error) {
    console.error(error);
  }
};


  return(
    <ToDoListContext.Provider value={{toDoList, setToDoList, createTodo, updateTodo, deleteTodo}}>
      {children}
    </ToDoListContext.Provider>
  )
}

export const useToDoList = () => useContext(ToDoListContext)

export default ToDoListProvider

