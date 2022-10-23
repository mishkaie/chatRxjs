import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { combineLatest, delay, filter, map, Observable, of, Subject, tap, takeUntil } from 'rxjs';
import { messagesSubj$, usersSubj$} from '../services/users-http.service';
import { UnsubscribeOnDestroy } from '../UnsubscribeOnDestroy';
import { User } from '../user/user.model';
import { Chat, userOrBot } from './chat.model';


@UnsubscribeOnDestroy()
@Component({
  selector: 'chat-box-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements OnInit {

  messageController = new FormControl('');
  private destroy$ = new Subject<boolean>();
  params$: Observable<Params> = this.route.params;
  users$ = usersSubj$.asObservable();
  messages$: Observable<Chat[]> = messagesSubj$.asObservable();
  users: User[] | any; 
  messages: Chat[] | any;
  chatId: number = 0;

  constructor(
    private route: ActivatedRoute,
  ) {}
  // currentUser$!: Observable<User>;

  /* combine streams of user and params
    
  */
  currentUser$: Observable<User> | Observable<any>  = combineLatest([
    this.users$,
    this.params$
  ]).pipe(
    filter((response: any) => { 
      const [users, params] = response;
      if(users && params.id) {
        return response;
      }
    }),
    map((response: [User[],Params]) => {
    const [users, params] = response;  
    this.chatId = +params['id'];
    this.users = users;
    const crUser =  users.find((user: User) => user.id === +params['id']);
    return crUser;
  }));

  ngOnInit(): void {
    // Reset formcontrol on chatId change
    this.params$.pipe(
      tap(res => {
        if(this.chatId && res['id'] !== this.chatId){
          this.messageController.setValue('')
        }
      })
    ).subscribe();

    this.messages$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.messages = response
    })
  }

  /* 
    send message to updateSubject function,
    delay 1 second and send same message from bot
   */
  sendMessage(){
    of(this.messageController.value).pipe(
      filter(msg => !!msg),
      tap((msgValue) => {
        this.updateSubjectValue(userOrBot.user, msgValue, this.chatId)
      }),
      map((msgValue) => {
        return [msgValue, this.chatId]
      }),
      delay(1000),
      takeUntil(this.destroy$)
    ).subscribe((msgValue) => this.updateSubjectValue(userOrBot.bot, msgValue[0], msgValue[1] as number));
  }
  
  /* 
    update messageSubjectValue with given messages 
  */
  updateSubjectValue(userOrBot: userOrBot, msgValue: string | any, chatId: number) {
    const msg = {
      id: userOrBot,
      message: msgValue
    }
    const userMsg = this.messages.find((user: { userId: number; }) => user.userId === chatId);
    // If user already exists in array add message as first elemnt of messages array
    // If user isn't in array, add new data
    if(userMsg) {
      userMsg.messages.unshift(msg);
    } else {
      const user: Chat = {
        userId: chatId,
        messages: [msg]
      };
      this.messages.push(user);
    }
    // update subject with new value + old data;
    messagesSubj$.next([...this.messages ]);
    this.messageController.setValue('');
    this.updateUserSort(chatId);
  }

  /* Update User sort order 
     Find userIndex in array Remove from given id. Push current user into array as first element.
     Update Subject with new value.
     To show user with latests message first
  */
  updateUserSort(chatId: number) {
    const index = this.users.findIndex((user: User) => user.id === chatId);
    const currentUser: any = this.users.splice(index, 1);
    this.users.unshift(currentUser[0]);
    usersSubj$.next(this.users);
  }
}
