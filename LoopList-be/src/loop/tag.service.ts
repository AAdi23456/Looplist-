import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Loop } from './loop.entity';

@Injectable()
export class TagService {
  private readonly commonTags = [
    'health', 'fitness', 'productivity', 'learning', 'mindfulness',
    'reading', 'writing', 'coding', 'music', 'art', 'cooking',
    'meditation', 'exercise', 'sleep', 'diet', 'study', 'work',
    'creativity', 'social', 'finance'
  ];

  constructor(
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
  ) {}

  async getPopularTags(limit: number = 10): Promise<{ tag: string; count: number }[]> {
    const loops = await this.loopRepo.find({
      where: { visibility: 'public' },
      select: ['tags']
    });

    const tagCounts = new Map<string, number>();
    loops.forEach(loop => {
      if (loop.tags) {
        loop.tags.forEach(tag => {
          tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
        });
      }
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }

  async getTagSuggestions(input: string, limit: number = 5): Promise<string[]> {
    if (!input || input.length < 2) {
      return this.commonTags.slice(0, limit);
    }

    const normalizedInput = input.toLowerCase();
    
    // Get all unique tags from public loops
    const loops = await this.loopRepo.find({
      where: { visibility: 'public' },
      select: ['tags']
    });

    const uniqueTags = new Set<string>();
    loops.forEach(loop => {
      if (loop.tags) {
        loop.tags.forEach(tag => uniqueTags.add(tag));
      }
    });

    // Combine with common tags
    this.commonTags.forEach(tag => uniqueTags.add(tag));

    // Filter and sort suggestions
    return Array.from(uniqueTags)
      .filter(tag => tag.toLowerCase().includes(normalizedInput))
      .sort((a, b) => {
        // Prioritize exact matches
        const aExact = a.toLowerCase() === normalizedInput;
        const bExact = b.toLowerCase() === normalizedInput;
        if (aExact && !bExact) return -1;
        if (!aExact && bExact) return 1;
        
        // Then prioritize common tags
        const aCommon = this.commonTags.includes(a);
        const bCommon = this.commonTags.includes(b);
        if (aCommon && !bCommon) return -1;
        if (!aCommon && bCommon) return 1;
        
        // Finally sort by length
        return a.length - b.length;
      })
      .slice(0, limit);
  }

  async getRelatedTags(tags: string[], limit: number = 5): Promise<string[]> {
    if (!tags || !tags.length) return [];

    const loops = await this.loopRepo.find({
      where: { 
        visibility: 'public',
        tags: In(tags)
      },
      select: ['tags']
    });

    const relatedTags = new Map<string, number>();
    loops.forEach(loop => {
      if (loop.tags) {
        loop.tags.forEach(tag => {
          if (!tags.includes(tag)) {
            relatedTags.set(tag, (relatedTags.get(tag) || 0) + 1);
          }
        });
      }
    });

    return Array.from(relatedTags.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag]) => tag)
      .slice(0, limit);
  }
} 