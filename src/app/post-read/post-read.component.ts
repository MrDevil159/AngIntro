// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-post-read',
//   templateUrl: './post-read.component.html',
//   styleUrls: ['./post-read.component.css']
// })
// export class PostReadComponent implements OnInit {
//   constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
//   postId: string = '';
//   post: any;

//   ngOnInit(): void {
//     const id = this.route.snapshot.paramMap.get('id');
//     if (id !== null) {
//       const posts = JSON.parse(localStorage.getItem('posts') || '[]');
//       this.post = posts.find((p: any) => p.id === +id);
//     }
//   }
//   goBack(): void {
//     this.router.navigate(['/home']);
//   }
//   edit(id:number): void {
//     this.router.navigate(['/posts/',id,'edit']);
//   }
// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-post-read',
  templateUrl: './post-read.component.html',
  styleUrls: ['./post-read.component.css']
})
export class PostReadComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) { }
  postId: string = '';
  post: any;
  firstImageUrl: string | null = null;
  secondImage: string | null = null;
  thirdImage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const posts = JSON.parse(localStorage.getItem('posts') || '[]');
      this.post = posts.find((p: any) => p.id === +id);
      this.searchUnsplash(this.post.title);
    }
  }

  searchUnsplash(searchQuery: string) {
    const apiKey = 'API_KEY';
    const apiUrl = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=1&client_id=${apiKey}`;
console.log(apiUrl);
    this.http.get(apiUrl).subscribe((response: any) => {
      const results = response.results;
      if (results.length > 0) {
        const firstImage = results[0];

        this.firstImageUrl = firstImage.urls.small;
        console.log('Image URL:', this.firstImageUrl);
      } else {
        this.firstImageUrl = null; // If no image found
        console.log('No image found');
      }
    }, error => {
      console.error('Error fetching search results:', error);
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  edit(id: number): void {
    this.router.navigate(['/posts/', id, 'edit']);
  }
}
