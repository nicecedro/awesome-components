import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { Post } from "src/app/core/models/post.module";
import { PostsService } from "../services/posts.service";

@Injectable()

export class PostsResolve implements Resolve<Post[]> {
    constructor(private postSer: PostsService) { }

    // resolver
    resolve(route: ActivatedRouteSnapshot): Observable<Post[]> {
        return this.postSer.getPosts();
    }
}
