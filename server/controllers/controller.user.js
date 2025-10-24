import { UserService } from "../services/user-service.js";

export default class UserController {

    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const token = await UserService.login(email, password);

            if(token) {
                // res.cookie("refreshToken", token, { maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true})
                return res.json({ token }).status(200);
            } else {
                return res.sendStatus(typeof token == "undefined" ? 404 : 401);
            }
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
    
    static async registration(req, res) {
        try {
            const { email, password } = req.body;

            const token = await UserService.registration(email, password);

            // res.cookie("refreshToken", token, { maxAge : 30 * 24 * 60 * 60 * 1000, httpOnly : true});
            
            return res.json({ token }).status(200);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}