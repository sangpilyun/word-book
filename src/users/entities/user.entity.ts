import { Authority } from 'src/auths/entities/authority.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  Entity,
} from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  seq: number;

  @Column({ type: 'varchar', length: 16, unique: true })
  id: string;

  @Column('varchar', { length: 20 })
  password: string;

  @Column('varchar', { length: 40 })
  name: string;

  @Column('varchar', { length: 45 })
  email: string;

  @Column('varchar', { length: 1 })
  gender: Gender;

  @Column('varchar', { length: 13 })
  tel: string;

  @Column('date')
  createdDate: Date;

  @Column('date', { nullable: true })
  deletedDate: Date;
  @ManyToMany(() => Authority)
  @JoinColumn()
  authoritys: Authority[];
}

export type Gender = 'M' | 'F';
