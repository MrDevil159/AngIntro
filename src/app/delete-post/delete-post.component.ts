import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
constructor(private route: ActivatedRoute, private router: Router) { }

  onDelete(): void {
    const posts = JSON.parse(localStorage.getItem('posts') || '[]');
    const index = posts.findIndex((p: any) => p.id === this.postId);
    if (index !== -1) {
      posts.splice(index, 1);
      localStorage.setItem('posts', JSON.stringify(posts));
      this.router.navigate(['/home']);
    }
  }
}
