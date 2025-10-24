import { type AuthContextType } from "../context/auth-context";

const API_URL = 'http://localhost:3000/api';

export const getTasks = async (auth: AuthContextType) => {
    if (!auth.token) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`${API_URL}/tasks`, {
        headers: {
            'Authorization': `Bearer ${auth.token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
};

export const createTask = async (task: { title: string; description: string; }, auth: AuthContextType) => {
    if (!auth.token) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(task)
    });
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    return response.json();
};

export const updateTask = async (id: number, task: { title: string; description: string; }, auth: AuthContextType) => {
    if (!auth.token) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(task)
    });
    if (!response.ok) {
        throw new Error('Failed to update task');
    }
    return response.json();
};

export const deleteTask = async (id: number, auth: AuthContextType) => {
    if (!auth.token) {
        throw new Error('Not authenticated');
    }
    const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${auth.token}`
        }
    });
    if (!response.ok) {
        throw new Error('Failed to delete task');
    }
    return Promise.resolve();
};
