import { animate, animateChild, group, query, sequence, stagger, state, style, transition, trigger, useAnimation } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { Comment } from 'src/app/core/models/comment.models';
import { flashAnimation } from '../../animations/flash.animations';
import { slideAndFadeAnimation } from '../../animations/slide-and-fade.animations';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss'],
  animations: [

    trigger('list', [
      transition(':enter', [
        query('@listItem', [
          stagger(500, [
            animateChild()
          ])
        ])
      ])
    ]),

    trigger('listItem', [

      state('default', style({
        transform: 'scale(1)',
        'background-color': 'white',
        'z-index': 1
      })),
      state('active', style({
        transform: 'scale(1.05)',
        'background-color': 'orange',
        'z-index': 2
      })),

      transition('default=>active', [animate('100ms ease-in-out')]),
      transition('active=>default', [animate('500ms ease-in-out')]),
      transition(':enter', [


        query('.comment-text, .comment-date', [
          style({
            opacity: 0
          }),
        ]),

        useAnimation(slideAndFadeAnimation, {
          params: {
            time: 500,
            flashColor: 'orange'
          }
        }),

        group([
          useAnimation(flashAnimation, {
            params: {
              time: '250ms',
              flashColor: 'orange',
            }
          }),
          query('.comment-text', [
            animate('250ms', style({
              opacity: 1
            }))
          ]),

          query('.comment-date', [
            animate('500ms', style({
              opacity: 1
            }))
          ]),
        ])
      ]),

    ])
  ]
})
export class CommentsComponent implements OnInit {

  commentCtrl !: FormControl
  // listItemAnimationState: 'default' | 'active' = 'default';

  constructor(private fBuilder: FormBuilder) { }

  @Input() comments !: Comment[];
  @Output() newComment = new EventEmitter<string>();

  commentLength !: number;

  // dictionnaire
  animationsState: { [key: number]: 'default' | 'active' } = {};

  ngOnInit(): void {
    this.commentCtrl = this.fBuilder.control('', [Validators.required, Validators.minLength(10)]);
    this.commentLength = this.comments.length;
  }

  onLeaveComment() {

    if (this.commentCtrl.invalid) {
      return;
    }

    const maxId = Math.max(...this.comments.map(comment => comment.id));

    this.comments.unshift({
      id: maxId + 1,
      comment: this.commentCtrl.value,
      createdDate: new Date(),
      userId: 1
    });
    this.newComment.emit(this.commentCtrl.value);
    this.commentCtrl.reset();
    this.updateNumberOfComment();
  }

  updateNumberOfComment() {
    this.commentLength = this.comments.length;
  }

  onListItemMouseEnter(index: number) {
    this.animationsState[index] = 'active';
  }
  onListItemMouseLeave(index: number) {
    this.animationsState[index] = 'default';
  }

}
