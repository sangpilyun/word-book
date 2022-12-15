import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meaning } from './meaning.entity';

@Entity()
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_WORD',
  })
  id: number;

  @Column('varchar', { length: 20 })
  pronunciation: string;

  @Column('varchar', { length: 100 })
  sourceUrl: string;

  @OneToMany(() => Meaning, (meaning) => meaning.word)
  meanings: Meaning[];

  @OneToMany(() => Meaning, (meaning) => meaning.word)
  synonyms: Meaning[];
}
