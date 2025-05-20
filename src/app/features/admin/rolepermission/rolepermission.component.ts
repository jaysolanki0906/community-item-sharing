import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { v4 as uuidv4 } from 'uuid';
import { CreateRoleDialogComponent } from '../create-role-dialog/create-role-dialog.component';
import { HttpClient } from '@angular/common/http';
import { RolePermissionService } from '../../../core/services/role-permission.service';

interface AuthItems {
  [key: string]: { [key: string]: boolean };
}

interface Role {
  id: string;
  org_id: string;
  title: string;
  auth_items: AuthItems;
}

@Component({
  selector: 'app-rolepermission',
  standalone: false,
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.scss']
})
export class RolepermissionComponent implements OnInit {
selectedRoleIndex: number | null = null;

  constructor(public roleService: RolePermissionService) {}

  ngOnInit(): void {
    const initialData = [
      {
        title: 'Admin',
        auth_items: {
          Users: { view: true, create: true, delete: false },
          Settings: { update: true }
        }
      }
    ];
    this.roleService.setRoles(initialData);
  }

  get roles() {
    return this.roleService.getRoles();
  }

  getAuthItemsKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  getPermissionKeys(obj: any): string[] {
    return Object.keys(obj);
  }

  selectRole(index: number) {
    this.selectedRoleIndex = index;
  }

  createRole() {
    const newRole = {
      title: 'New Role',
      auth_items: {}
    };
    this.roleService.addRole(newRole);
    this.selectedRoleIndex = this.roles.length - 1;
  }

  deleteRole(index: number) {
    this.roleService.deleteRole(index);
    if (this.selectedRoleIndex === index) this.selectedRoleIndex = null;
  }

  saveRoles() {
    console.log('Saving roles to backend or file:', this.roles);
    // Later add actual HTTP POST here
  }
}