import { NextFunction, Request, Response } from "express";
import { singleton } from "tsyringe";
import { VerificationService } from "../services/VerificationService";
import { z } from "zod";
import { UserService } from "../services/UserService";
import { SystemUser } from "../domain/user/SystemUser";
import { JwtTokenPayload } from "../domain/token/Jwt";
import { JwtService } from "../services/JwtService";

@singleton()
export class UserVerifierController {
  constructor(
    protected verificationService: VerificationService,
    protected userService: UserService,
    protected jwtService: JwtService
  ) {}

  private validateUserInput(body: unknown): z.SafeParseReturnType<
    {
      username: string;
      password: string;
    },
    {
      username: string;
      password: string;
    }
  > {
    const bodySchema = z.object({
      username: z.string().min(5).max(30),
      password: z.string().min(5).max(30),
    });
    return bodySchema.safeParse(body);
  }

  private generateCookie(payload: JwtTokenPayload, response: Response) {
    const token = this.jwtService.sign(payload);
    response.cookie("monitoring_jwt", token);
  }

  public async validateUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const parseResult = this.validateUserInput(request.body);
    console.log(parseResult)
    if (parseResult.success === false) {
      response
        .status(200);
      return
    } else {
      const verificationResult = await this.verificationService.verifyUser(
        {
          username: parseResult.data.username,
          password: parseResult.data.password
        }
      );
      if (verificationResult) {
        response.status(200);
      } else {
        response.status(401);
      }
    }
    
    next();
  }

  public async createUser(
    request: Request,
    response: Response,
    next: NextFunction
  ): Promise<void> {
    const parseResult = this.validateUserInput(request.body);
    if (parseResult.success === false) {
      response
        .json({
          error: `Error validating input: ${parseResult.error}`,
        })
        .status(400);
      return;
    }
    let newUser: SystemUser | undefined;
    try {
      newUser = await this.userService.createUser(
        parseResult.data.username,
        parseResult.data.password
      );
    } catch (error: any) {
      if (error.message) {
        response.json({ message: error.message }).status(400);
      } else {
        response.json(error).status(400);
      }
      return;
    }
    this.generateCookie({ username: parseResult.data.username }, response);
    response.json(newUser).status(200);
    next();
  }
}
