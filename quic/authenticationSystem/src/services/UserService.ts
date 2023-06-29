import { singleton } from "tsyringe";
import { SystemUserRepository } from "../repository/SystemUserRepository";
import { hash256 } from "../utils/Hash";

@singleton()
export class UserService {

  constructor(
    protected systemUserRepository: SystemUserRepository
  ) {}

  public async createUser(username: string, password: string) {
    const passwordHashed = hash256(password);
    const newUser = await this.systemUserRepository.persistUser(username, passwordHashed)
    return newUser
  }
}