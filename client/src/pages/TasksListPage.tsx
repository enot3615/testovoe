import React, { useState, useEffect } from 'react';
import TaskModal from '../components/TaskModal';
import { useAuth } from '../context/auth-context';
import { useNavigate } from 'react-router-dom';
import { getTasks, createTask, updateTask, deleteTask } from '../services/tasks';

interface Task {
  id: number;
  title: string;
  description: string;
}

const TasksListPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentTask, setCurrentTask] = useState<Task | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const auth = useAuth();
  const navigate = useNavigate();

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks(auth);
      setTasks(fetchedTasks);
    } catch {
      setError('Failed to fetch tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (auth.token) {
      fetchTasks();
    }
  }, [auth.token]);

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  const openModal = (task?: Task) => {
    setCurrentTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setCurrentTask(undefined);
    setIsModalOpen(false);
  };

  const handleSave = async (task: { title: string; description: string; }) => {
    try {
      if (currentTask) {
        await updateTask(currentTask.id, task, auth);
      }
      else {
        await createTask(task, auth);
      }
      fetchTasks();
      closeModal();
    } catch {
      setError('Failed to save task');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTask(id, auth);
      fetchTasks();
    } catch {
      setError('Failed to delete task');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <h1 className="text-white text-2xl font-bold">Мої Завдання</h1>
        <button 
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Вийти
        </button>
      </nav>
      <div className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <button onClick={() => openModal()} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded transition-colors">
            Додати Завдання
          </button>
        </div>
        {isLoading && <p className="text-white text-center">Loading...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}
        <div className="bg-gray-800 shadow-md rounded-lg overflow-hidden">
          <ul className="divide-y divide-gray-700">
            {tasks.map(task => (
              <li key={task.id} className="p-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h2 className="font-bold text-lg text-white">{task.title}</h2>
                  <p className="text-gray-400">{task.description}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openModal(task)} className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded transition-colors">
                    Редагувати
                  </button>
                  <button onClick={() => handleDelete(task.id)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    Видалити
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <TaskModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} task={currentTask} />
    </div>
  );
}

export default TasksListPage;