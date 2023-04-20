import { UserEntity } from 'src/users/infra/db/entity/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sentence extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 1000 })
  sentence: string;

  @Column('varchar', { length: 1000 })
  translation: string;

  @Column('varchar', { length: 20 })
  translator: string;

  @Column({ type: 'boolean', default: false })
  isSearchForWord: boolean;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  @ManyToOne(() => UserEntity, (user) => user.sentences, { nullable: false })
  @JoinColumn({
    name: 'userSeq',
    referencedColumnName: 'seq',
    foreignKeyConstraintName: 'FK_SENTENCE',
  })
  user: UserEntity;
}
