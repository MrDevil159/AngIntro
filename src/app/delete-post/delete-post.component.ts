import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-delete-post',
  templateUrl: './delete-post.component.html',
  styleUrls: ['./delete-post.component.css']
})
export class DeletePostComponent {
  @Input()
  postId!: number;
/**
 * 
 */
constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }



  onDelete(): void {
    // const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    // const index = posts.findIndex((p: any) => p.id === this.postId);
    // if (index !== -1) {
    //   posts.splice(index, 1);
    //   localStorage.setItem('posts', JSON.stringify(posts));
    //   this.router.navigate(['/home']);
    // }
    this.http.delete(`http://localhost:3000/api/products/${this.postId}`)
    .subscribe(
      () => {
        console.log('Product deleted successfully');
        this.router.navigate(['/home']);
        // Perform any additional actions after successful deletion
      },
      (error) => {
        console.error('Error deleting product:', error);
        // Handle error cases
      })
  }
}
