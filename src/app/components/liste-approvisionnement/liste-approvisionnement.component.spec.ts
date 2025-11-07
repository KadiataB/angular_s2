import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeApprovisionnementComponent } from './liste-approvisionnement.component';

describe('ListeApprovisionnementComponent', () => {
  let component: ListeApprovisionnementComponent;
  let fixture: ComponentFixture<ListeApprovisionnementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListeApprovisionnementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListeApprovisionnementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
