import { User } from 'src/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Sentence extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 255 })
  sentence: string;

  @Column('varchar', { length: 255 })
  translation: string;

  @Column('varchar', { length: 20 })
  translator: string;

  @CreateDateColumn({ type: 'datetime' })
  createdDate: Date;

  // @ManyToOne(() => User, (user) => user.sentences)
  // user: User;
}
