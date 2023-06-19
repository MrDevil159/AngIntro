import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  post: any;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      this.post = posts.find((p: any) => p.id === +id);
    } 
  }

  onSubmit(): void {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const index = posts.findIndex((p: any) => p.id === this.post.id);
    posts[index].title = this.post.title;
    posts[index].body = this.post.body;
    localStorage.setItem('posts', JSON.stringify(posts));
    this.router.navigate(['/posts', this.post.id]);
  }

}
