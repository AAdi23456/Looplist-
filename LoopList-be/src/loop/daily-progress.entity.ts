import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { Loop } from './loop.entity';
import { User } from '../user/user.entity';

@Entity()
@Unique(['loop', 'date'])
export class DailyProgress {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ default: false })
  completed: boolean;

  @ManyToOne(() => Loop, loop => loop.id, { onDelete: 'CASCADE' })
  loop: Loop;

  @ManyToOne(() => User, user => user.id, { onDelete: 'CASCADE' })
  user: User;
} 