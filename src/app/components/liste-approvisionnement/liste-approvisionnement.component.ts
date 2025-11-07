import { Component } from '@angular/core';
import { ApprovisionnementService } from '../../services/approvisionnement.service';
import { Approvisionnement } from '../../models/approvisionnement.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-liste-approvisionnement',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './liste-approvisionnement.component.html',
  styleUrl: './liste-approvisionnement.component.scss'
})
export class ListeApprovisionnementComponent {

  approvisionnements: Approvisionnement[] = [];
  searchTerm = '';
  selectedFournisseur = '';
  selectedArticle = '';
  dateDebut = '';
  dateFin = '';
  tri = 'date_desc';

  fournisseurs = this.service.fournisseurs;
  articlesDisponibles = this.service.articlesDisponibles;

  constructor(private service: ApprovisionnementService) {}

  ngOnInit() {
    this.approvisionnements = this.service.getAll();
  }

  get filteredApprovisionnements() {
    return this.approvisionnements.filter(appro => {
      const matchesSearch = appro.reference.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           appro.fournisseur.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesFournisseur = !this.selectedFournisseur || appro.fournisseur === this.selectedFournisseur;

      return matchesSearch && matchesFournisseur;
    });
  }

  get totalApprovisionnements() {
    return this.service.getTotalApprovisionnements();
  }

  get fournisseurPrincipal() {
    return this.service.getFournisseurPrincipal();
  }

  getStatutBadgeClass(statut: string): string {
    return statut === 'Reçu' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  }

  getStatutText(statut: string): string {
    return statut === 'Reçu' ? 'Reçu' : 'En attente';
  }
}
