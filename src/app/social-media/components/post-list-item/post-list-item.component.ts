import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Post } from 'src/app/core/models/post.module';

@Component({
  selector: 'app-post-list-item',
  templateUrl: './post-list-item.component.html',
  styleUrls: ['./post-list-item.component.scss']
})
export class PostListItemComponent implements OnInit {


  tempUser = { firstName: "Cédric", lastName: "Nizigiyimana" };
  @Input() post !: Post; // vérifier si on a reçu les données
  @Output() postCommented = new EventEmitter<{ comment: string, postId: number }>();

  constructor() { }

  ngOnInit(): void {
  }

  onNewComment(comment: string) {
    this.postCommented.emit({ comment, postId: this.post.id });
  }
}

