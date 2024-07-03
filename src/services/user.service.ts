import Database from '@src/database';
import { User } from '@src/models';

export default class UserService {
  static instance: UserService;
  private connection = new Database().sequelize;

  constructor() {
    this.connection.authenticate();
  }

  public static getInstance(): UserService {
    if (!this.instance) {
      this.instance = new UserService();
    }

    return this.instance;
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    return await User.findOne({ where: { username } });
  }

  public async getUserById(id: string): Promise<User | null> {
    return await User.findByPk(id);
  }
}
