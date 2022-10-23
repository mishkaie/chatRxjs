import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, ignoreElements, map, Observable, of, tap } from 'rxjs';
import { UsersHttpService, usersSubj$ } from './services/users-http.service';
import { User } from './user/user.model';


@Component({
  selector: 'chat-box-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {

  users$: Observable<User[]>  = usersSubj$.asObservable();
  usersError$!: Observable<Error>;

  constructor(
    private usersService: UsersHttpService,
    private router: Router,
  ){}

  ngOnInit(): void {
    this.users$ = this.usersService.getUsers().pipe(
      tap((res: User[]) => {
        usersSubj$.next(res)
      })
    );

    this.usersError$ = this.users$.pipe(
      ignoreElements(),
      catchError((err)=> of(err))
    );
  }
  
  openUserChat(id: number, index: number) {
    this.router.navigateByUrl(`/user/${id}`);
  }

  trackByFn(index: number, user: User) {
    return user.id;
  }

}
