import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  postForm!: FormGroup;
  postId!: number;

  constructor(private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    this.postId = posts.length + 1;
    this.postForm = this.fb.group({
      title: [''],
      body: [''],
      amount: ['']
    });
  }
  onSubmit(): void {
    const post = this.postForm.value;
    post.id = this.postId;
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    posts.push(post);
    localStorage.setItem('posts', JSON.stringify(posts));
    this.postForm.reset();
    this.router.navigate(['/posts', this.postId]);
  }
}
