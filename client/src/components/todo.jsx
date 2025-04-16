import React, { useEffect, useState, useContext } from 'react';
import Logout from './Logout';
import { todoEndpoint } from '../services/apis';
import { UserContext } from '../context/UserContext'; 

const Todos = () => {
  const { user }  = useContext(UserContext);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [username, setUsername] = useState('User'); // Mock username, replace with actual user data
  const [editTodo, setEditTodo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // console.log(user);
  // Fetch todos from the server
  const fetchTodos = async () => {
    try {
      const response = await fetch(todoEndpoint.get, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch todos');
      }

      const data = await response.json();
      setTodos(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Create a new todo
  const createTodo = async () => {
    if (!newTodo.title.trim() || !newTodo.description.trim()) return;

    try {
      const response = await fetch(todoEndpoint.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newTodo),
      });

      if (!response.ok) {
        throw new Error('Failed to create todo');
      }

      fetchTodos();
      setNewTodo({ title: '', description: '' });
      setShowAddModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update a todo
  const updateTodo = (todo) => {
    setEditTodo(todo);
  };

  const handleUpdate = async () => {
    if (!editTodo.title || !editTodo.description) return;

    try {
      const response = await fetch(todoEndpoint.update(editTodo._id), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ title: editTodo.title, description: editTodo.description }),
      });

      if (!response.ok) {
        throw new Error('Failed to update todo');
      }

      setEditTodo(null);
      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete a todo
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(todoEndpoint.delete(id), {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to delete todo');
      }

      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  // Complete a todo
  const completeTodo = async (id) => {
    try {
      const response = await fetch(todoEndpoint.complete(id), {
        method: 'PUT',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to complete todo');
      }

      fetchTodos();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <>
      <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
        <h1 className="text-xl font-bold">Todo App</h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-medium">Welcome, {user?.username || "Guest"}</span>
          <Logout />
        </div>
      </nav>
      <div className="text-center mt-4">
        <h1 className="text-2xl font-bold mb-4">Todo List</h1>
        {loading && <p>Loading todos...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={() => setShowAddModal(true)} className="bg-blue-500 text-white p-2 rounded mb-4">Add Todo</button>
        {todos.length === 0 ? (
          <p className="mt-4 text-lg">Please create a todo.</p>
        ) : (
          <ul>
            {todos.map((todo) => (
              <li key={todo._id} className="  md:flex  justify-between items-center p-2  border-b">
                <span className={todo.completed ? "line-through" : ""}>{todo.title} - {todo.description}</span>
                <div>
                  <button onClick={() => completeTodo(todo._id)} className="bg-green-500 text-white p-1 rounded mr-2">Complete</button>
                  <button onClick={() => updateTodo(todo)} className="bg-yellow-500 text-white p-1 rounded mr-2">Update</button>
                  <button onClick={() => deleteTodo(todo._id)} className="bg-red-500 text-white p-1 rounded">Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {(editTodo || showAddModal) && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">{editTodo ? 'Edit' : 'Add'} Todo</h2>
              <input
                type="text"
                placeholder="Enter title"
                value={editTodo ? editTodo.title : newTodo.title}
                onChange={(e) => editTodo ? setEditTodo({ ...editTodo, title: e.target.value }) : setNewTodo({ ...newTodo, title: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <textarea
                placeholder="Enter description"
                value={editTodo ? editTodo.description : newTodo.description}
                onChange={(e) => editTodo ? setEditTodo({ ...editTodo, description: e.target.value }) : setNewTodo({ ...newTodo, description: e.target.value })}
                className="border p-2 rounded w-full mb-2"
              />
              <button onClick={editTodo ? handleUpdate : createTodo} className="bg-blue-500 text-white p-2 rounded mr-2">{editTodo ? 'Update' : 'Add'}</button>
              <button onClick={() => { setEditTodo(null); setShowAddModal(false); }} className="bg-gray-500 text-white p-2 rounded">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Todos;
