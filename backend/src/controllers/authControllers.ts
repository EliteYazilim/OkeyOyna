import { Request, Response } from 'express';
import { RegisterBody, LoginBody } from '../types/auth';
import { User } from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = (req: Request<{}, {}, RegisterBody>, res: Response) => {
    (async () => {
        try {
            const { username, email, password } = req.body;

            const userExists = await User.findOne({ email });
            if (userExists) {
                return res.status(400).json({ message: "Bu e-posta zaten kayıtlı." });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const nowTR = moment().tz("Europe/Istanbul").format("YYYY/MM/DD HH:mm:ss");

            const newUser = new User({
                username,
                email,
                password: hashedPassword,
                createdAt: nowTR,
            });

            await newUser.save();

            res.status(201).json({ message: "Kayıt başarılı." });
        } catch (err) {
            res.status(500).json({ message: "Sunucu hatası." });
        }
    })();
};
export const login = (req: Request, res: Response) => {
    console.log("Login request received:", req.body);
    (async () => {
        try {
            const { email, password } = req.body;

            const user = await User.findOne({ email });
            if (!user) {
                console.log("Kullanici bulunamadi:", email);
                return res.status(400).json({ message: "Kullanıcı bulunamadı." });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                console.log("Hatali sifre");
                return res.status(401).json({ message: "Hatalı şifre." });
            }


            const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
            console.log("Giris basarili:", token);

            res.status(200).json({ message: "Giriş başarılı.", user: user });
        } catch (err) {
            console.log("Sunucu hatasi:", err);

            res.status(500).json({ message: "Sunucu hatası." });
        }
    })();
};