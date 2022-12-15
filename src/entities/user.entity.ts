import { Authority } from 'src/entities/authority.entity';
// import { Sentence } from 'src/entities/sentence.entity';
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
} from 'typeorm';

@Entity()
@Unique(['id'])
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

  @Column('datetime')
  createdDate: Date;

  @Column('datetime', { nullable: true })
  deletedDate: Date;
  @ManyToMany(() => Authority, (autority) => autority.users, {
    cascade: true,
  })
  @JoinTable()
  authorities: Authority[];

  // @ManyToOne(() => Sentence, (sentence) => sentence.user, {
  //   cascade: true,
  // })
  // sentences: Sentence[];
}

export type Gender = 'M' | 'F';
