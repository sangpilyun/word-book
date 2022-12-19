import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Meaning } from './meaning.entity';

@Entity()
@Unique(['name'])
export class Word extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int',
    unsigned: true,
    primaryKeyConstraintName: 'PK_WORD',
  })
  id: number;

  @Column('varchar', { length: 45 })
  name: string;

  @Column('varchar', { length: 50 })
  pronunciation: string;

  @Column('varchar', { length: 100 })
  sourceUrl: string;

  @OneToMany(() => Meaning, (meaning) => meaning.word)
  meanings: Meaning[];

  @OneToMany(() => Meaning, (meaning) => meaning.word)
  synonyms: Meaning[];
}
