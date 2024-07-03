import { Table, Column, Model } from 'sequelize-typescript';

import { compare } from 'bcrypt';

@Table({ tableName: 'users', timestamps: true, paranoid: true })
export default class User extends Model {
  @Column({ unique: true, allowNull: false })
  username!: string;

  @Column({ unique: true, allowNull: true, validate: { isEmail: true } })
  email!: string;

  @Column({ allowNull: false })
  password!: string;

  @Column({ allowNull: false, defaultValue: 'local' })
  strategy!: string;

  @Column({ allowNull: true })
  identifier!: string;

  @Column({ allowNull: false, defaultValue: true })
  active!: boolean;

  // @BeforeCreate
  // @BeforeUpdate
  // static async hashPassword(instance: User) {
  // 	if (instance.changed('password')) {
  // 		instance.password = await hash(instance.password, 10);
  // 	}
  // }

  async comparePassword(password: string) {
    return await compare(password, this.password);
  }
}
