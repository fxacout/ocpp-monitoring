import mongoose from "mongoose";
import { singleton } from "tsyringe";

@singleton()
export class DbConnection {
  
  async connect() {
    mongoose.connect('mongodb://mongodb:27017/users');
  }

}