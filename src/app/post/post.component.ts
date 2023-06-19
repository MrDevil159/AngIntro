import { Component, OnInit  } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit{
  posts: any[] = [];
  constructor(private router: Router, private http: HttpClient) { }
  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:3000/api/products')
      .subscribe(data => {
        this.posts = data;
      });
    // this.posts = JSON.parse(localStorage.getItem('posts') || '[]');
  }

  readPost(id: number): void {
    this.router.navigate(['/posts', id]);
  }
}
