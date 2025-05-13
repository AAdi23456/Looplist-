import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../user/user.entity';
import { Reaction } from '../reaction/reaction.entity';

@Entity()
export class Loop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  frequency: string;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ default: 'private' })
  visibility: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ default: 0 })
  currentStreak: number;

  @Column({ default: 0 })
  longestStreak: number;

  @Column({ type: 'float', default: 0 })
  completionRate: number;

  @Column({ default: 'active' })
  status: 'active' | 'paused' | 'completed';

  @Column({ nullable: true })
  originalLoopId: string;

  @Column({ nullable: true })
  originalCreatorId: string;

  @Column({ nullable: true })
  category: string;

  @Column('simple-array', { nullable: true })
  tags: string[];

  @Column({ type: 'jsonb', nullable: true })
  streakHistory: {
    date: string;
    streak: number;
    completionRate: number;
  }[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, user => user.loops)
  user: User;

  @OneToMany(() => Reaction, reaction => reaction.loop)
  reactions: Reaction[];
} 