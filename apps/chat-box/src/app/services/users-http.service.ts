import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, shareReplay, Subject , BehaviorSubject} from 'rxjs';
import { User } from '../user/user.model';
import { Chat } from '../chat/chat.model';

export const usersSubj$ = new Subject<User[]>();
export const messagesSubj$ =  new BehaviorSubject<Chat[]>([]);


@Injectable({
    providedIn: 'root'
})
export class UsersHttpService {
    
    constructor(private httpClient: HttpClient){}

    getUsers(): Observable<User[]>{
            return this.httpClient.get<User[]>(environment.url + '/users').pipe(shareReplay());
    }
}