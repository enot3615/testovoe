import db from "../database.js";
import { v4 } from "uuid";
import jwt from "jsonwebtoken";

export class UserService {
    static async registration(email, password) {
        return new Promise((resolve, reject) => {
            try {
                console.log(email)
                let userId = v4();
                db.users.run('INSERT INTO users (userId, email, password) VALUES (?, ?, ?)', [userId, email, password], (err) => {
                    if (err) {
                        console.error(err.message);
                        reject(new Error('Error creating user'));
                    }
                    const token = jwt.sign({ userId: userId }, process.env.JWT_SECRET);
                    resolve(token);
                });
            } catch (e) {
                console.log(e)
                reject(new Error('Error creating user'));
            }
        });
    }

    static async login(email, password) {
        return new Promise((resolve, reject) => {
            db.users.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
                if (err) {
                    console.error(err.message);
                    reject(new Error('Error during login'));
                }

                if (user) {
                    if (password == user.password) {
                        const token = jwt.sign({ userId: user.userId }, process.env.JWT_SECRET);
                        db.tokens.run('INSERT INTO tokens (userId, refreshToken) VALUES (?, ?)', [user.userId, token]);

                        console.log(token)
                        resolve(token);
                    } else {
                        resolve(null);
                    }
                } else {
                    resolve(undefined);
                }
            });
        });
    }
}

