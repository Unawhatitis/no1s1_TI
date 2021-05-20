import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRMComponent } from './profile_RM.component';

describe('ProfileComponent', () => {
  let component: ProfileRMComponent;
  let fixture: ComponentFixture<ProfileRMComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileRMComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
