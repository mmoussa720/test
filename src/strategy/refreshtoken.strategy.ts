import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/types/jwtpayload.enum";
import {Request} from 'express'
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET,
            passReqToCallback: true
        });
    }
    validate(payload: JwtPayload,request:Request) {
        const refreshToken = request.get('Authorization').replace('Bearer', '').trim();
        return { payload, refreshToken };
    }
}