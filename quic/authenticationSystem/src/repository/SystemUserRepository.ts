import mongoose from "mongoose";
import { singleton } from "tsyringe";
import {SystemUser} from '../domain/user/SystemUser'

const userSchema = new mongoose.Schema({
  username: String,
  password: String
}, {
  timestamps: true
})

const model = mongoose.model('user',userSchema)

@singleton()
export class SystemUserRepository {
  async getUser(username: string): Promise<SystemUser | undefined> {
    const result = await model.find({username}).lean().exec()
    if (result.length === 0 ) {
      return undefined
    }
    return this.mapFromDb(result[0])
  }

  mapFromDb(user: any): SystemUser {
    return new SystemUser(user.username, user.password)
  }


  async persistUser(username: string, password: string): Promise<SystemUser> {
    const persistedUser = await this.getUser(username);
    if (persistedUser !== undefined) {
      throw Error(`User ${username} already created`)
    }
    const newUser = await model.create({
      username,
      password
    });
    return this.mapFromDb(newUser);
  }
}