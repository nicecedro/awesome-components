import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PostsListComponent } from './components/posts-list/posts-list.component';
import { PostsResolve } from './resolvers/posts.resolver';

const routes: Routes = [
  { path: '', component: PostsListComponent, resolve: { posts: PostsResolve } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SocialMediaRoutingModule { }
