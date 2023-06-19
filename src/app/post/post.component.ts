import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  posts: any[] = [];
  constructor(private router: Router) { }
  ngOnInit(): void {
    this.posts = JSON.parse(localStorage.getItem('posts') || '[]');
  }

  readPost(id: number): void {
    this.router.navigate(['/posts', id]);
  }
}
