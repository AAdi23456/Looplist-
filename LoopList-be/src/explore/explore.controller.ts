import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ExploreService, SearchResult, SearchFilters } from './explore.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('explore')
@UseGuards(ThrottlerGuard)
export class ExploreController {
  constructor(private readonly exploreService: ExploreService) {}

  @Get('trending')
  async getTrendingLoops(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC'
  ): Promise<SearchResult> {
    return this.exploreService.getTrendingLoops({ page, limit, sortBy, sortOrder });
  }

  @Get('category/:category')
  async getLoopsByCategory(
    @Query('category') category: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC'
  ): Promise<SearchResult> {
    return this.exploreService.getLoopsByCategory(category, { page, limit, sortBy, sortOrder });
  }

  @Get('loop-of-the-day')
  async getLoopOfTheDay() {
    return this.exploreService.getLoopOfTheDay();
  }

  @Get('search')
  async searchLoops(
    @Query('q') query: string,
    @Query('frequency') frequency?: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('tags') tags?: string,
    @Query('minStreak') minStreak?: string,
    @Query('minCompletion') minCompletion?: string,
    @Query('minReactions') minReactions?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC'
  ): Promise<SearchResult> {
    const filters: SearchFilters = {
      frequency,
      status,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
      minStreak: minStreak ? Number(minStreak) : undefined,
      minCompletion: minCompletion ? Number(minCompletion) : undefined,
      minReactions: minReactions ? Number(minReactions) : undefined,
    };
    return this.exploreService.searchLoops(query, { page, limit, sortBy, sortOrder }, filters);
  }

  @Get('tags/popular')
  async getPopularTags(@Query('limit') limit?: number) {
    return this.exploreService.getPopularTags(limit);
  }

  @Get('tags/suggestions')
  async getTagSuggestions(
    @Query('input') input: string,
    @Query('limit') limit?: number
  ) {
    return this.exploreService.getTagSuggestions(input, limit);
  }

  @Get('tags/related')
  async getRelatedTags(
    @Query('tags') tags: string,
    @Query('limit') limit?: number
  ) {
    const tagArray = tags.split(',').map(tag => tag.trim());
    return this.exploreService.getRelatedTags(tagArray, limit);
  }
}
