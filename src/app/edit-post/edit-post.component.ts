import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-edit-post',
  templateUrl: './edit-post.component.html',
  styleUrls: ['./edit-post.component.css']
})
export class EditPostComponent implements OnInit {
  post: any;
  postForm: FormGroup;
  postId!: number;
  formBuilder: any;

  body = new FormControl('');

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.postForm = this.fb.group({
      title: [''],
      body: [''],
      amount: ['']
    });
  }
  posts: any[] = [];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.http.get<any[]>(`http://localhost:3000/api/products/${id}`)
      .subscribe(data => {
        this.posts = data;
        console.log(this.posts);
        this.body.setValue(this.posts[0].body);
      });
    }
  }



  onSubmit(): void {
    const updatedPost = this.postForm.value;
    const id = this.route.snapshot.paramMap.get('id');
    this.http.put(`http://localhost:3000/api/products/${id}`, updatedPost)
      .subscribe(
        () => {
          console.log('Product updated successfully');
          this.router.navigate(['/posts', id]);
        },
        (error) => {
          console.error('Error updating product:', error);
        }
      );
  }
}