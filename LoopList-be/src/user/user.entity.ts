import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Loop } from '../loop/loop.entity';
import { Follow } from './follow.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  displayName: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Loop, loop => loop.user)
  loops: Loop[];

  @OneToMany(() => Follow, follow => follow.user)
  following: Follow[];

  @OneToMany(() => Follow, follow => follow.followed)
  followers: Follow[];
} 