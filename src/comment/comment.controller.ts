import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/createCommentDto';
import { Request } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UpdateCommentDto } from './dto/updateCommentDto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  create(@Body() createCommentDto: CreateCommentDto, @Req() request: Request) {
    const userId = request.user['id'];
    return this.commentService.create(userId, createCommentDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  delete(
    @Req() request: Request,
    @Param('id', ParseIntPipe) commentId: number,
    @Body('postId') postId: number,
  ) {
    const current_user = request.user['id'];
    return this.commentService.delete(commentId, current_user, postId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('update/:id')
  update(
    @Req() request: Request,
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('id', ParseIntPipe) commentId: number,
  ) {
    const current_user = request.user['id'];
    return this.commentService.update(
      commentId,
      updateCommentDto,
      current_user,
    );
  }
}
