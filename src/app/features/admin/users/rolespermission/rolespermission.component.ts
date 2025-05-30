import { Component, OnInit } from '@angular/core';
import { RolePermissionService } from '../../../../core/services/role-permission.service';
import Swal from 'sweetalert2';

interface Permission {
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
    { name: 'items_create', checked: false },
    { name: 'items_edit', checked: false },
    { name: 'items_delete', checked: false },
    { name: 'items_view', checked: false },
    // Add more permissions here as needed
  ];

  constructor(
    public rolePermissionService: RolePermissionService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
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
      error: () => {
        Swal.fire('Error', 'Failed to load roles.', 'error');
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
    // Set current permissions in the service for other components if needed
    this.rolePermissionService.setRoleAuth(role.auth_items || {});
  }

  addPermission(permission: Permission): void {
    if (!this.selectedRole) {
      Swal.fire('Error', 'Select a role first.', 'warning');
      return;
    }
    // Assume permissions are stored under items module. Adjust as per your backend
    const items = this.selectedRole.auth_items?.items || {};
    if (items[permission.name]) {
      Swal.fire('Info', `"${permission.name}" permission already exists for this role.`, 'info');
      return;
    }
    if (!this.selectedRole.auth_items) {
      this.selectedRole.auth_items = {};
    }
    if (!this.selectedRole.auth_items['items']) {
      this.selectedRole.auth_items['items'] = {};
    }
    this.selectedRole.auth_items['items'][permission.name] = true;

    this.rolePermissionService.patchRole(this.selectedRole.id, { auth_items: this.selectedRole.auth_items }).subscribe({
      next: () => {
        Swal.fire('Success', `"${permission.name}" permission added.`, 'success');
        this.updatePermissionChecks();
      },
      error: () => {
        Swal.fire('Error', 'Failed to add permission.', 'error');
      }
    });
  }

  updatePermissionChecks(): void {
    if (!this.selectedRole || !this.selectedRole.auth_items || !this.selectedRole.auth_items['items']) {
      this.permissions.forEach(p => p.checked = false);
      return;
    }
    const itemsPerms = this.selectedRole.auth_items['items'];
    this.permissions.forEach(p => {
      p.checked = !!itemsPerms[p.name];
    });
  }
}