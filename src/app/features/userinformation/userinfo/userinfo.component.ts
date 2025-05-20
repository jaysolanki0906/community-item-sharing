import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-userinfo',
  standalone:false,
  templateUrl: './userinfo.component.html',
  styleUrl: './userinfo.component.scss'
})
export class UserinfoComponent {
  userProfile?: User;
  constructor(private userService: UserService) {}
  
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
