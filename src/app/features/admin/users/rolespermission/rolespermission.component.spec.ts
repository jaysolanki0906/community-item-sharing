import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RolespermissionComponent } from './rolespermission.component';

describe('RolespermissionComponent', () => {
  let component: RolespermissionComponent;
  let fixture: ComponentFixture<RolespermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RolespermissionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RolespermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
