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
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column('varchar', { length: 255 })
  pronunciation: string;

  @Column('varchar', { length: 255 })
  sourceUrl: string;

  @OneToMany(() => Meaning, (meaning) => meaning.word)
  meanings: Meaning[];

  @OneToMany(() => Meaning, (meaning) => meaning.word)
  synonyms: Meaning[];
}
