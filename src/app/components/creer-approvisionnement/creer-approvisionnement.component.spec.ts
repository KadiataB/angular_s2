import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreerApprovisionnementComponent } from './creer-approvisionnement.component';

describe('CreerApprovisionnementComponent', () => {
  let component: CreerApprovisionnementComponent;
  let fixture: ComponentFixture<CreerApprovisionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreerApprovisionnementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreerApprovisionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
