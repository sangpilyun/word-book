import { UserEntity } from 'src/users/infra/db/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sentence } from './sentence.entity';
import { Word } from './word.entity';

@Entity()
export class UserWord extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.userWords)
  @JoinColumn({
    name: 'userSeq',
    referencedColumnName: 'seq',
    foreignKeyConstraintName: 'FK_USER_WORD_USER',
  })
  user: UserEntity;

  @ManyToOne(() => Word, (word) => word.userWords)
  @JoinColumn({
    name: 'wordId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_USER_WORD_WORD',
  })
  word: Word;

  @Column({ type: 'int', default: 0, unsigned: true })
  searchCount: number;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @UpdateDateColumn({ type: 'datetime' })
  updatedDate: Date;

  @Column({ type: 'boolean', default: false })
  test1: boolean;

  @Column({ type: 'boolean', default: false })
  test2: boolean;

  @Column({ type: 'boolean', default: false })
  test3: boolean;

  @Column({ type: 'boolean', default: false })
  test4: boolean;

  @Column({ type: 'boolean', default: false })
  isMemorialized: boolean;
}
