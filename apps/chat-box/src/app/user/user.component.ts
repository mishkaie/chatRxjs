import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, Observable, of, map, filter } from 'rxjs';
import { Chat } from '../chat/chat.model';
import { messagesSubj$ } from '../services/users-http.service';
import { User } from './user.model';

@Component({
  selector: 'chat-box-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  @Input() user!: User;
  messages$ = messagesSubj$.asObservable();

  lastMessages$: Observable<string> | any;

  userId: number = 0;

  ngOnInit(): void {

    // Subscribe to users last Message
    this.lastMessages$ = combineLatest([
      of(this.user),
      this.messages$,
    ]).pipe(
      filter((userMessages: any) => {
        if(userMessages[0] && userMessages[1].length){
          return userMessages
        }
      }),
      map((response : [{id: number},Chat[]]) => {
        const userId = +response[0].id;
        const user = response[1].find(user => user.userId === userId);
        if(user && user.messages) {
          return user.messages[0].message
        }
        return '';
      })
    );
    
    this.route.children[0].params.subscribe(res => {
      this.userId = +res['id'];
      this.cdr.detectChanges();
    })

  }
}
