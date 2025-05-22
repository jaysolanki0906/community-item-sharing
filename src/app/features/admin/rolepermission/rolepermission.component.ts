import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from '../../../core/services/role-permission.service';

@Component({
  selector: 'app-rolepermission',
  standalone: false,
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.scss'] 
})
export class RolepermissionComponent implements OnInit {

  constructor(public roleService: RolePermissionService) {}

  ngOnInit(): void {
    const data = this.roleService.getallRolesandpermission();
    console.log('Roles data:', data);
  }
}