import { Component, OnInit, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {FormControl, ReactiveFormsModule} from '@angular/forms'

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [HttpClientModule,ReactiveFormsModule],
  providers: [UserService],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit {
  click = 0;

  platformID = inject(PLATFORM_ID);
  sorting = {
    column: '',
    order: '', // asc | desc | ""
  };
  searchValue = new FormControl("");
  users: any = [];
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoutes: ActivatedRoute
  ) {
    const queryParams = this._activatedRoutes.snapshot.queryParamMap;
    this.sorting.column = queryParams.get('_column') || '';
    this.sorting.order = queryParams.get('_order') || '';
    if (this.sorting.order == 'asc') {
      this.click = 1;
    } else if (this.sorting.order == 'desc') {
      this.click = 2;
    } else {
      this.click = 0;
    }
    console.log('🚀 ~ UsersComponent ~ this.sorting:', this.sorting);
  }
  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    console.log('platform', this.platformID);
    if (isPlatformBrowser(this.platformID)) {
      localStorage.setItem('platform', this.platformID.toString());
    }
    console.log('OnInit');
    this._userService
      .getUser(this.sorting, this.searchValue.value)
      .subscribe((res: any) => {
        this.users = res.users;
      });
  }

  sortData(event: any) {
    if (this.click === 0) {
      this.click += 1;
      this.sorting.column = event.srcElement.innerHTML.toLowerCase();
      this.sorting.order = 'asc';
      this._router.navigate([], {
        queryParams: {
          _column: this.sorting.column,
          _order: this.sorting.order,
        },
      });
    } else if (this.click === 1) {
      this.click += 1;
      this.sorting.column = event.srcElement.innerHTML.toLowerCase();
      this.sorting.order = 'desc';
      this._router.navigate([], {
        queryParams: {
          _column: this.sorting.column,
          _order: this.sorting.order,
        },
      });
    } else {
      this.click = 0;
      this.sorting.column = '';
      this.sorting.order = '';
      this._router.navigate([], {
        queryParams: {
          _column: this.sorting.column,
          _order: this.sorting.order,
        },
      });
    }
    this.getUsers();

    console.log('🚀 ~ UsersComponent ~ sortData ~ this.sorting:', this.sorting);
  }

  searchData(){
    this.getUsers()
  }
}
