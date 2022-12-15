import { User } from 'src/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  Unique,
  JoinTable,
} from 'typeorm';

@Entity()
@Unique(['name'])
export class Authority extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_AUTHORITY',
  })
  id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @ManyToMany(() => User, (user) => user.authorities)
  @JoinTable()
  users: User[];
}
