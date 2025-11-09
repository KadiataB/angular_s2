import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Approvisionnement } from '../../models/approvisionnement.model';
import { ApprovisionnementService } from '../../services/approvisionnement.service';

@Component({
  selector: 'app-liste-approvisionnement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './liste-approvisionnement.component.html'
})
export class ListeApprovisionnementComponent {
  // Signaux pour les filtres
  searchTerm = signal('');
  selectedFournisseur = signal('');
  selectedArticle = signal('');
  dateDebut = signal('');
  dateFin = signal('');
  tri = signal('date_desc');

  // Données du service (signaux)
  approvisionnements = this.service.getAll();
  totalApprovisionnements = this.service.totalApprovisionnements;
  fournisseurPrincipal = this.service.fournisseurPrincipal;
  nombreApprovisionnements = this.service.nombreApprovisionnements;

  // Données statiques
  fournisseurs = this.service.fournisseurs;
  articlesDisponibles = this.service.articlesDisponibles;

  // Signal calculé pour les données filtrées
  filteredApprovisionnements = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const fournisseur = this.selectedFournisseur();
    const tri = this.tri();

    let filtered = this.approvisionnements().filter(appro => {
      const matchesSearch = appro.reference.toLowerCase().includes(search) ||
                           appro.fournisseur.toLowerCase().includes(search);
      const matchesFournisseur = !fournisseur || appro.fournisseur === fournisseur;

      return matchesSearch && matchesFournisseur;
    });

    // Trier par date
    if (tri === 'date_desc') {
      filtered = filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else {
      filtered = filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return filtered;
  });

  constructor(private service: ApprovisionnementService) {}

  getStatutBadgeClass(statut: string): string {
    return statut === 'Reçu' ? 'badge-success' : 'badge-warning';
  }

  getStatutText(statut: string): string {
    return statut === 'Reçu' ? 'Reçu' : 'En attente';
  }
}
