import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Import the FormsModule
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponentComponent } from './navbar-component/navbar-component.component';
import { PostComponent } from './post/post.component';
import { NgbCollapseModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewPostComponent } from './new-post/new-post.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PostReadComponent } from './post-read/post-read.component';
import { EditPostComponent } from './edit-post/edit-post.component';
import { DeletePostComponent } from './delete-post/delete-post.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponentComponent } from './home-component/home-component.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponentComponent,
    PostComponent,
    NewPostComponent,
    PageNotFoundComponent,
    PostReadComponent,
    EditPostComponent,
    DeletePostComponent,
    FooterComponent,
    HomeComponentComponent
    ],
    
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbCollapseModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      {path: '', component: HomeComponentComponent},
      {path: 'home', component: PostComponent},
      {path: 'newPost', component: NewPostComponent},
      {path: 'posts/:id', component: PostReadComponent},
      {path: 'posts/:id/edit', component: EditPostComponent},
      {path: '**', component: PageNotFoundComponent}
    ]),
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
