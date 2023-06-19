import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit {
  postForm!: FormGroup;
  postId!: number;

  constructor(private fb: FormBuilder, private router: Router, private http: HttpClient) { }

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
    const url = 'http://localhost:3000/api/products';
    this.http.post(url, post)
      .subscribe(
        (createdProduct) => {
          console.log('Product created successfully:', createdProduct);
          this.postForm.reset();
          this.router.navigate(['/home']);
        },
        (error) => {
          console.error('Error creating product:', error);
          // Handle error cases
        }
      );
  }
  
}
