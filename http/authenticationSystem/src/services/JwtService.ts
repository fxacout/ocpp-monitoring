import { singleton } from "tsyringe";
import * as jwt from 'jsonwebtoken'
import { JwtTokenPayload } from "../domain/token/Jwt";


@singleton()
export class JwtService {
  private secretKey: string = process.env.SECRET_KEY!


  public sign(payload: JwtTokenPayload): string {
    const signed = jwt.sign(payload, this.secretKey)
    return signed
  }
}