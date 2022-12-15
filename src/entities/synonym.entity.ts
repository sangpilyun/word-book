import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Word } from './word.entity';

@Entity()
export class Synonym extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_SYNONYM',
  })
  id: number;

  @ManyToOne(() => Word, (word) => word.synonyms)
  @JoinColumn({ name: 'word_id' })
  word: Word;

  @ManyToOne(() => Word, (word) => word.synonyms)
  @JoinColumn({ name: 'synonym_id' })
  synonym: Word;
}
