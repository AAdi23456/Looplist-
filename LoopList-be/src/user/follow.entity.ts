import { Entity, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Follow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.following, { eager: true, onDelete: 'CASCADE' })
  user: User; // The follower

  @ManyToOne(() => User, user => user.followers, { eager: true, onDelete: 'CASCADE' })
  followed: User; // The user being followed

  @CreateDateColumn()
  createdAt: Date;
} 