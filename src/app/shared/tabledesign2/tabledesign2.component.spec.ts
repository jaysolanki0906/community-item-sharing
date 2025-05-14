import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tabledesign2Component } from './tabledesign2.component';

describe('Tabledesign2Component', () => {
  let component: Tabledesign2Component;
  let fixture: ComponentFixture<Tabledesign2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tabledesign2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tabledesign2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
