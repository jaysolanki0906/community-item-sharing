import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoauthComponent } from './noauth.component';

describe('NoauthComponent', () => {
  let component: NoauthComponent;
  let fixture: ComponentFixture<NoauthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoauthComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoauthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
