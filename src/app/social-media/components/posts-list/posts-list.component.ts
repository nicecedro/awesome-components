import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Post } from 'src/app/core/models/post.module';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {


  /** recuperer les posts via les Observables */
  post$ !: Observable<Post[]>
  constructor(private route: ActivatedRoute,
    private postService: PostsService) { }

  ngOnInit(): void {
    this.post$ = this.route.data.pipe(
      map(data => data['posts'])
    )
  }

  onPostCommented(postCommented: { comment: string, postId: number }) {
    this.postService.addNewComment(postCommented);
  }

}
