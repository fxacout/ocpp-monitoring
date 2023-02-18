import { UserDto } from "../dto/UserDto";
import * as crypto from 'crypto'
import { SystemUserRepository } from "../repository/SystemUserRepository";
import { singleton } from "tsyringe";
import { hash256 } from "../utils/Hash";


@singleton()
export class VerificationService {

  constructor(
    protected systemUserRepository: SystemUserRepository
  ) {}

  async verifyUser(user: UserDto): Promise<boolean> {
    const passwordHashed = hash256(user.password)
    console.log(passwordHashed)

    const userFromDb = await this.systemUserRepository.getUser(user.username)

    return passwordHashed === userFromDb?.password
  }
}