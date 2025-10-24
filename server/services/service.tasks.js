import db from "../database.js";
import jwt from "jsonwebtoken";

class TaskService {

        async createTask(task, token) {

            return new Promise((resolve, reject) => {

                try {
                    let decodedToken = jwt.decode(token);
                    let userId = decodedToken.userId;
                    db.tasks.run('INSERT INTO tasks (userId, title, description) VALUES (?, ?, ?)', [userId, task.title, task.description], function(err) {
                        if (err) {
                            reject(new Error('Error creating task'));
                        } else {
                            db.tasks.get('SELECT * FROM tasks WHERE id = ?', [this.lastID], (err, row) => {
                                if (err) {
                                    reject(new Error('Error fetching created task'));
                                } else {
                                    resolve(row);
                                }
                            });

                        }

                    }); 

                } catch {

                    reject(new Error('Error creating task'));

                }

            });

        }

    

        async getTasks(token, taskId) {

            try {

                let decodedToken = jwt.decode(token);

                let userId = decodedToken.userId;

    

                if(taskId !== null && decodedToken.role !== "admin") {

                    return new Promise((resolve, reject) => {

                    db.tasks.get('SELECT * FROM tasks WHERE id = ? AND userId = ?', [taskId, userId], (err, raw) => {

                        if (err) {

                            reject(err);

                        } else {

                            resolve(raw);

                        }

                    });

                    });

                } else {

                    return new Promise((resolve, reject) => {

                        db.tasks.all('SELECT * FROM tasks WHERE userId = ? ORDER BY id DESC', [userId], (err, raw) => {

                            if (err) {

                                reject(err);

                            } else {

                                resolve(raw);

                            }

                        });

                    });

                }

                

            } catch (e){

                console.log(e)

                throw new Error('Error getting tasks');

            }

        }

    

        async updateTask(taskId, { title, description }) {

            return new Promise((resolve, reject) => {

                try {

                    db.tasks.run('UPDATE tasks SET title = ?, description = ? WHERE id = ?', [title, description, taskId], function(err) {

                        if (err) {

                            reject(new Error('Error updating task'));

                        } else {

                            db.tasks.get('SELECT * FROM tasks WHERE id = ?', [taskId], (err, row) => {

                                if (err) {

                                    reject(new Error('Error fetching updated task'));

                                } else {

                                    resolve(row);

                                }

                            });

                        }

                    });

                } catch {

                    reject(new Error('Error updating task'));

                }

            });

        }

    async deleteTask(taskId) {
        try {
            db.tasks.run('DELETE FROM tasks WHERE id = ?', [taskId]);
        } catch {
            throw new Error('Error deleting task');
        }
    }

}

export default new TaskService();