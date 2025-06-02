import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from '../../../../core/services/role-permission.service';
import Swal from 'sweetalert2';
import { ErrorHandlerService } from '../../../../core/services/error-handler.service';

interface Permission {
  module: string;   
  name: string;     
  checked: boolean;
}

@Component({
  selector: 'app-rolespermission',
  templateUrl: './rolespermission.component.html',
  standalone: false,
  styleUrls: ['./rolespermission.component.scss']
})
export class RolesPermissionComponent implements OnInit {
  roles: any[] = [];
  selectedRole: any = null;
  permissions: Permission[] = [
    { module: 'item', name: 'item_create', checked: false },
    { module: 'item', name: 'item_update', checked: false },
    { module: 'item', name: 'item_delete', checked: false },
    { module: 'item', name: 'item_view', checked: false },
    { module: 'user', name: 'user_list', checked: false },
    { module: 'user', name: 'user_update', checked: false },
    { module: 'user', name: 'user_view', checked: false },
    { module: 'interest', name: 'interest_create', checked: false },
    { module: 'interest', name: 'interest_list', checked: false }
  ];

  constructor(
    public rolePermissionService: RolePermissionService,
    public errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.rolePermissionService.getRoles().subscribe({
      next: (roles) => {
        console.log('Roles and Permissions:', roles); // <--- Display in 
        this.roles = roles.map((role: any) => ({ ...role, selected: false }));
        if (this.selectedRole) {
          const found = this.roles.find(r => r.id === this.selectedRole.id);
          if (found) {
            this.selectRole(found);
          }
        }
      },
      error: (e) => {
        this.errorHandler.handleError(e, 'Failed to load roles.');
      }
    });
  }

  loadRoles(): void {
    this.rolePermissionService.getRoles().subscribe({
      next: (roles) => {
        this.roles = roles.map((role: any) => ({ ...role, selected: false }));
        if (this.selectedRole) {
          const found = this.roles.find(r => r.id === this.selectedRole.id);
          if (found) {
            this.selectRole(found);
          }
        }
      },
      error: (e) => {
        this.errorHandler.handleError(e, 'Failed to load roles.');
      }
    });
  }

  createRole(): void {
    Swal.fire({
      title: 'Create Role',
      input: 'text',
      inputLabel: 'Role Name',
      inputPlaceholder: 'Enter role name',
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        this.rolePermissionService.createRole({ name: result.value, auth_items: {} }).subscribe({
          next: () => {
            Swal.fire('Success', 'Role created successfully.', 'success');
            this.loadRoles();
          },
          error: () => {
            Swal.fire('Error', 'Failed to create role.', 'error');
          }
        });
      }
    });
  }

  editRole(role: any): void {
    Swal.fire({
      title: 'Edit Role',
      input: 'text',
      inputLabel: 'Role Name',
      inputValue: role.name,
      showCancelButton: true
    }).then((result) => {
      if (result.isConfirmed && result.value && result.value !== role.name) {
        this.rolePermissionService.updateRole(role.id, { name: result.value }).subscribe({
          next: () => {
            Swal.fire('Success', 'Role updated successfully.', 'success');
            this.loadRoles();
          },
          error: () => {
            Swal.fire('Error', 'Failed to update role.', 'error');
          }
        });
      }
    });
  }

  deleteRole(role: any): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Delete role "${role.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.rolePermissionService.deleteRole(role.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Role deleted.', 'success');
            this.selectedRole = null;
            this.loadRoles();
          },
          error: () => {
            Swal.fire('Error', 'Failed to delete role.', 'error');
          }
        });
      }
    });
  }

  selectRole(role: any): void {
    this.roles.forEach(r => r.selected = false);
    role.selected = true;
    this.selectedRole = role;
    this.updatePermissionChecks();
    this.rolePermissionService.setRoleAuth(role.auth_items || {});
  }

  addPermission(permission: Permission): void {
    if (!this.selectedRole) {
      Swal.fire('Error', 'Select a role first.', 'warning');
      return;
    }
    // Use correct backend module!
    const moduleName = permission.module;
    const permName = permission.name;
    const perms = this.selectedRole.auth_items?.[moduleName] || {};
    if (perms[permName]) {
      Swal.fire('Info', `"${permName}" permission already exists for this role.`, 'info');
      return;
    }
    if (!this.selectedRole.auth_items) {
      this.selectedRole.auth_items = {};
    }
    if (!this.selectedRole.auth_items[moduleName]) {
      this.selectedRole.auth_items[moduleName] = {};
    }
    this.selectedRole.auth_items[moduleName][permName] = true;

    this.rolePermissionService.patchRole(this.selectedRole.id, { auth_items: this.selectedRole.auth_items }).subscribe({
      next: () => {
        Swal.fire('Success', `"${permName}" permission added.`, 'success');
        this.updatePermissionChecks();
      },
      error: () => {
        Swal.fire('Error', 'Failed to add permission.', 'error');
      }
    });
  }

  updatePermissionChecks(): void {
    if (!this.selectedRole || !this.selectedRole.auth_items) {
      this.permissions.forEach(p => p.checked = false);
      return;
    }
    this.permissions.forEach(p => {
      const perms = this.selectedRole.auth_items[p.module] || {};
      p.checked = !!perms[p.name];
    });
  }
}