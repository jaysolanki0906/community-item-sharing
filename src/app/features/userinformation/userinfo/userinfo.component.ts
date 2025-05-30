import { Component } from '@angular/core';
import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';

@Component({
  selector: 'app-userinfo',
  standalone:false,
  templateUrl: './userinfo.component.html',
  styleUrl: './userinfo.component.scss'
})
export class UserinfoComponent {
  userProfile?: User;
  constructor(private userService: UserService,private errorservice:ErrorHandlerService) {}
  
  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe({
      next: (data) => {
        console.log('User data:', data);
        this.userProfile = data === null ? undefined : data;
      },
      error: (err) => {
        this.errorservice.handleError( err, 'ItemFormDialogComponent')
      }
    });
  }  
}
