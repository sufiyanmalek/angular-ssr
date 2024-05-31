import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(public http: HttpClient) { }
  getUser(sorting: any,searchValue: any):Observable<any>{
    return this.http.get(`http://localhost:4000/api/users?_sort=${sorting.column}&_order=${sorting.order}&name_like=${searchValue}`);
  }
}
