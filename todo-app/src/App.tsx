
import React, { useState, useEffect } from 'react';
 import Task from '../src/types/Types.ts';
 import './styles/todo.css';
import { v4 as uuidv4 } from 'uuid';

function App() {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [filter, setFilter] = useState('all'); 

  useEffect(() => {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (newTaskText.trim() !== '') {
      const newTask: Task = {
        id: uuidv4(),
        text: newTaskText,
        completed: false,
      };
      setTasks([...tasks, newTask]);
      setNewTaskText('');
    }
  };

  const handleToggleComplete = (id: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  
  const [editTaskText, setEditTaskText] = useState('');
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleEditTask = (id: string) => {
    const taskToEdit = tasks.find((task) => task.id === id);
    if (taskToEdit) {
      setEditTaskText(taskToEdit.text);
      setEditingTaskId(id);
    }
  };

  const handleSaveEditedTask = () => {
    if (editingTaskId) {
      setTasks(
        tasks.map((task) =>
          task.id === editingTaskId ? { ...task, text: editTaskText } : task
        )
      );
      setEditTaskText('');
      setEditingTaskId(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') {
      return true;
    } else if (filter === 'completed') {
      return task.completed;
    } else {
      return !task.completed;
    }
  });

  return (
    <div className="container">
      <h1>To-Do List</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Add a new task"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
        />
        <button onClick={handleAddTask}>Add</button>
      </div>

      <div className="filter-buttons">
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
        <button onClick={() => setFilter('incomplete')}>Incomplete</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            {editingTaskId === task.id ? (
              <input
                type="text"
                value={editTaskText}
                onChange={(e) => setEditTaskText(e.target.value)}
              />
            ) : (
              <span className={task.completed ? 'completed' : ''}>{task.text}</span>
            )}
           
            {editingTaskId === task.id ? (
              <button onClick={handleSaveEditedTask}>Save</button>
            ) : (
              <>
                <button onClick={() => handleEditTask(task.id)}>Edit</button>
                <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
              </>
            )}
          </li>
        ))}
         </ul>
     </div>
   );
 }

 export default App;
      
      