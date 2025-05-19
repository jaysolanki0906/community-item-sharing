import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { HeaderComponent } from '../../../shared/header/header.component';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-userinfo',
  standalone:false,
  templateUrl: './userinfo.component.html',
  styleUrl: './userinfo.component.scss'
})
export class UserinfoComponent {
  userProfile?: User;
  constructor(private userService: UserService) {}

  // ngOnInit(): void {
  //   this.userProfile = {
  //     name: 'John Doe',
  //     email: 'john@example.com',
  //     password: '******** (hashed)'
  //   };
  // }


  
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        console.log('User data:', data);
        this.userProfile = data;
      },
      error: (err) => {
        console.error('Failed to fetch user data', err);
      }
    });
  }  
}
