import taskService from "../services/service.tasks.js";

export default class TaskController {
    static async createTask(req, res) {
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Authorization header missing' });
            }
            const token = authHeader.split(' ')[1];
            const task = await taskService.createTask(req.body, token);
            res.status(201).json(task);
        } catch (error) {
            console.log(error)
            res.status(500);
        }
    }
    
    static async getTasks(req, res) {
        try {
            let id = req.params.id ?? null;
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).json({ error: 'Authorization header missing' });
            }
            const token = authHeader.split(' ')[1];
            const tasks = await taskService.getTasks(token, id);
            console.log(tasks)
            res.json(tasks);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const { title, description } = req.body;
            const task = await taskService.updateTask(taskId, { title, description });
            res.json(task);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    static async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            await taskService.deleteTask(taskId);
            res.sendStatus(204);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}