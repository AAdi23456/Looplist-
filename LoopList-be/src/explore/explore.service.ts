import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, In, ILike, Raw } from 'typeorm';
import { Loop } from '../loop/loop.entity';
import { TagService } from '../loop/tag.service';

interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface SearchFilters {
  frequency?: string;
  status?: string;
  category?: string;
  tags?: string[];
  minStreak?: number;
  minCompletion?: number;
  minReactions?: number;
}

export interface SearchResult {
  items: Loop[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ExploreService {
  constructor(
    @InjectRepository(Loop)
    private readonly loopRepo: Repository<Loop>,
    private readonly tagService: TagService,
  ) {}

  private async paginateResults(
    query: any,
    options: PaginationOptions = {}
  ): Promise<SearchResult> {
    const {
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'DESC'
    } = options;

    const skip = (page - 1) * limit;

    const [items, total] = await this.loopRepo.findAndCount({
      ...query,
      skip,
      take: limit,
      order: { [sortBy]: sortOrder }
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getTrendingLoops(options: PaginationOptions = {}): Promise<SearchResult> {
    return this.paginateResults({
      where: { visibility: 'public' },
      relations: ['user', 'reactions'],
      order: { 
        currentStreak: 'DESC', 
        longestStreak: 'DESC',
        completionRate: 'DESC'
      }
    }, options);
  }

  async getLoopsByCategory(category: string, options: PaginationOptions = {}): Promise<SearchResult> {
    return this.paginateResults({
      where: { 
        visibility: 'public', 
        category 
      },
      relations: ['user', 'reactions']
    }, options);
  }

  async getLoopOfTheDay() {
    const loops = await this.loopRepo.find({ 
      where: { 
        visibility: 'public',
        status: 'active'
      },
      relations: ['user', 'reactions'],
      order: { 
        currentStreak: 'DESC',
        completionRate: 'DESC'
      },
      take: 10
    });
    
    if (!loops.length) return null;
    
    return loops[Math.floor(Math.random() * loops.length)];
  }

  async searchLoops(
    query: string,
    options: PaginationOptions = {},
    filters: SearchFilters = {}
  ): Promise<SearchResult> {
    const page = options.page || 1;
    const limit = options.limit || 20;
    const sortBy = options.sortBy || 'createdAt';
    const sortOrder = options.sortOrder || 'DESC';

    // Build base where clause
    let where: any[] = [];
    if (query && query.length > 1) {
      const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 1);
      searchTerms.forEach(term => {
        where.push({
          visibility: 'public',
          title: ILike(`%${term}%`)
        });
        where.push({
          visibility: 'public',
          category: ILike(`%${term}%`)
        });
        where.push({
          visibility: 'public',
          frequency: ILike(`%${term}%`)
        });
        where.push({
          visibility: 'public',
          tags: Raw((alias) => `${alias} @> ARRAY['${term}']::varchar[]`)
        });
      });
    } else {
      where.push({ visibility: 'public' });
    }

    // Add advanced filters
    if (filters.frequency) {
      where = where.map(w => ({ ...w, frequency: filters.frequency }));
    }
    if (filters.status) {
      where = where.map(w => ({ ...w, status: filters.status }));
    }
    if (filters.category) {
      where = where.map(w => ({ ...w, category: filters.category }));
    }
    if (filters.tags && filters.tags.length) {
      where = where.map(w => ({ ...w, tags: In(filters.tags ?? []) }));
    }

    // Find matching loops
    const [loops, total] = await this.loopRepo.findAndCount({
      where,
      relations: ['user', 'reactions'],
      skip: (page - 1) * limit,
      take: limit,
      order: { [sortBy]: sortOrder }
    });

    // Score and filter by numeric thresholds
    const scoredLoops = loops
      .map(loop => {
        let score = 0;
        const title = loop.title.toLowerCase();
        const category = loop.category?.toLowerCase() || '';
        const frequency = loop.frequency.toLowerCase();
        const tags = (loop.tags || []).map(t => t.toLowerCase());
        const searchTerms = query ? query.toLowerCase().split(' ').filter(term => term.length > 1) : [];

        searchTerms.forEach(term => {
          if (title === term) score += 10;
          if (category === term) score += 8;
          if (frequency === term) score += 6;
          if (tags.includes(term)) score += 7;
          if (title.includes(term)) score += 5;
          if (category.includes(term)) score += 4;
          if (frequency.includes(term)) score += 3;
          if (tags.some(tag => tag.includes(term))) score += 2;
        });
        score += loop.currentStreak * 0.1;
        score += loop.completionRate * 5;
        score += (loop.reactions?.length || 0) * 0.2;
        return { ...loop, searchScore: score };
      })
      .filter(loop => {
        if (filters.minStreak && loop.currentStreak < filters.minStreak) return false;
        if (filters.minCompletion && loop.completionRate < filters.minCompletion) return false;
        if (filters.minReactions && (loop.reactions?.length || 0) < filters.minReactions) return false;
        return true;
      });

    // Sort by search score if searching, otherwise by sortBy
    const sortedLoops = query
      ? scoredLoops.sort((a, b) => b.searchScore - a.searchScore)
      : scoredLoops;

    return {
      items: sortedLoops,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getPopularTags(limit: number = 10) {
    return this.tagService.getPopularTags(limit);
  }

  async getTagSuggestions(input: string, limit: number = 5) {
    return this.tagService.getTagSuggestions(input, limit);
  }

  async getRelatedTags(tags: string[], limit: number = 5) {
    return this.tagService.getRelatedTags(tags, limit);
  }
}
