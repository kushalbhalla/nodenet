import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter, take, tap } from 'rxjs/operators';
import { Post } from 'src/app/main/post.model';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';


export interface OpsDialogData{
  post: Post;
  user: {
    _id: string,
    profilePicture: string,
    username: string
  };
}

@Component({
  selector: 'app-post-ops',
  templateUrl: './post-ops.component.html',
  styleUrls: ['./post-ops.component.css']
})
export class PostOpsComponent implements OnInit {

  postId: string;

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<PostOpsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {postId: string},
    private router: Router,
  ) {
    this.postId = data.postId;
    router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
      tap(() => this.dialogRef.close()),
      take(1),
    ).subscribe();

  }

  ngOnInit(): void {
  }

  onView() {   
    this.router.navigate(['/post', this.postId, 'view']);
  }

  onEdit() {    
    this.router.navigate(['/post', this.postId, 'edit']);
  }

  onDelete() {
     const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '500px',
      height: '150px',
      data: {
        postId: this.postId
      },
      closeOnNavigation: true
    });
    dialogRef.afterClosed().subscribe(result => {
    });
    this.onCancel();
  }

  onCancel():void {
    this.dialogRef.close();
  }

}
