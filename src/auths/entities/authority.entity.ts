import { User } from 'src/users/entities/user.entity';
import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Authority extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 20 })
  name: string;

  @ManyToMany(() => User)
  @JoinColumn()
  user: User[];
}
