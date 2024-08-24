import { ApiProperty } from '@nestjs/swagger';

export class PostDto {
  @ApiProperty() id: string;
  @ApiProperty() title: string;
  @ApiProperty() content: string;
}