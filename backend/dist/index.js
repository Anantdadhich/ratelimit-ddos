"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const SECERETKEY = '0x4AAAAAAAfdZeyWJ0N_9SLZNwcy-OZpvL8';
const app = (0, express_1.default)();
app.use(express_1.default.json());
const otpLimiter = (0, express_rate_limit_1.default)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
const passwordResetLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 password reset requests per windowMs
    message: 'Too many password reset attempts, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
const otpScore = {}; //memory store to store the emails for otp generate 
const optexpiry = 5 * 60 * 1000; //for more security to expire otp after five minutes
app.post('/generate-otp', otpLimiter, (req, res) => {
    //not extract from cookie 
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({ message: "email is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpScore[email] = otp;
    console.log(`otp for ${email}:${otp}`);
    res.status(200).json({ message: "otp generate and logged" });
});
app.post("/reset-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newpass, token } = req.body;
    let formdata = new FormData();
    formdata.append('secret', SECERETKEY);
    formdata.append('response', token);
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = yield fetch(url, {
        body: formdata,
        method: 'POST'
    });
    const challengeSucc = (yield result.json()).success;
    if (!challengeSucc) {
        return res.status(403).json({ mess: "invlalid captcha" });
    }
    if (!email || !newpass || !otp) {
        return res.status(400).json({ message: "give the credentials" });
    }
    if (Number(otpScore[email]) === Number(otp)) {
        console.log(`password for ${email} is rest to ${newpass}`);
        delete otpScore[email];
        res.status(200).json({ message: "password reset " });
    }
    else {
        res.status(400).json({ mess: "not reset" });
    }
}));
app.listen(3000);
