import { Authority } from 'src/entities/authority.entity';
import { Sentence } from 'src/entities/sentence.entity';
import {
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinColumn,
  Entity,
  JoinTable,
  Unique,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserWord } from './user-word.entity';

@Entity()
@Unique(['id', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_USER',
  })
  seq: number;

  @Column({ type: 'varchar', length: 16 })
  id: string;

  @Column('varchar', { length: 72 })
  password: string;

  @Column('varchar', { length: 40 })
  name: string;

  @Column('varchar', { length: 45 })
  email: string;

  @Column('varchar', { length: 1 })
  gender: Gender;

  @Column('varchar', { length: 13 })
  tel: string;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @DeleteDateColumn({ type: 'datetime' })
  deletedDate: Date;

  @ManyToMany(() => Authority, (autority) => autority.users, {
    cascade: true,
  })
  @JoinTable()
  authorities: Authority[];

  @OneToMany(() => Sentence, (sentence) => sentence.user, {
    cascade: true,
  })
  sentences: Sentence[];

  @OneToMany(() => UserWord, (userWord) => userWord.user, { cascade: true })
  userWords: UserWord[];
}

export type Gender = 'M' | 'F';
