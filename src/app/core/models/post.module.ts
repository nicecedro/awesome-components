import { Comment } from "./comment.models";

export class Post {
    id!: number;
    userId!: number;
    title!: string;
    createdDate!: Date;
    content!: string;
    imageUrl!: string;
    comments!: Comment[];
}