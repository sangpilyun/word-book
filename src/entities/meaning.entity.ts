import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Word } from './word.entity';

@Entity()
export class Meaning extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_MEANING',
  })
  id: number;

  @ManyToOne(() => Word, (word) => word.meanings)
  word: Word;

  @Column('varchar', { length: 255 })
  meaning: string;

  @Column('varchar', { length: 20 })
  partOfSpeech: string;

  @Column('int', { unsigned: true })
  priority: number;
}
