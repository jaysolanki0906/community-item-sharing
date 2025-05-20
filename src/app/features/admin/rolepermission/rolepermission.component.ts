import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from '../../../core/services/role-permission.service';

@Component({
  selector: 'app-rolepermission',
  standalone: false,
  templateUrl: './rolepermission.component.html',
  styleUrls: ['./rolepermission.component.scss'] // <-- FIXED typo here
})
export class RolepermissionComponent implements OnInit {
  selectedRoleIndex: number | null = null;

  constructor(public roleService: RolePermissionService) {}

  ngOnInit(): void {
    // No need to set initialData, roles are loaded from JSON
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
  }

  canEdit(): boolean {
    // Use correct permission key according to your role.json
    return this.roleService.getPermission('items', 'items_edit');
  }
  canDelete(): boolean {
    return this.roleService.getPermission('items', 'items_delete');
  }
  canView(): boolean {
    return this.roleService.getPermission('items', 'items_view');
  }
}