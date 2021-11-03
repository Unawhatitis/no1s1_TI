import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BackdoorComponent } from './backdoor.component';

describe('BackdoorComponent', () => {
  let component: BackdoorComponent;
  let fixture: ComponentFixture<BackdoorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BackdoorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BackdoorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
