import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { User } from './user.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow)
    private readonly followRepo: Repository<Follow>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async follow(userId: string, followedId: string) {
    if (userId === followedId) throw new BadRequestException('Cannot follow yourself');
    const user = await this.userRepo.findOne({ where: { id: userId } });
    const followed = await this.userRepo.findOne({ where: { id: followedId } });
    if (!user || !followed) throw new NotFoundException('User not found');
    const existing = await this.followRepo.findOne({ where: { user: { id: userId }, followed: { id: followedId } } });
    if (existing) throw new BadRequestException('Already following');
    const follow = this.followRepo.create({ user, followed });
    return this.followRepo.save(follow);
  }

  async unfollow(userId: string, followedId: string) {
    const follow = await this.followRepo.findOne({ where: { user: { id: userId }, followed: { id: followedId } } });
    if (!follow) throw new NotFoundException('Not following');
    await this.followRepo.remove(follow);
    return { unfollowed: true };
  }

  async getFollowing(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['following', 'following.followed'] });
    if (!user) throw new NotFoundException('User not found');
    return user.following.map(f => f.followed);
  }

  async getFollowers(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId }, relations: ['followers', 'followers.user'] });
    if (!user) throw new NotFoundException('User not found');
    return user.followers.map(f => f.user);
  }

  async getFriends(userId: string) {
    // Mutual follows: users you follow who also follow you
    const following = await this.getFollowing(userId);
    const followers = await this.getFollowers(userId);
    const friends = following.filter(f => followers.some(u => u.id === f.id));
    return friends;
  }
} 