import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Article } from '../../models/approvisionnement.model';
import { ApprovisionnementService } from '../../services/approvisionnement.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-creer-approvisionnement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './creer-approvisionnement.component.html'
})
export class CreerApprovisionnementComponent {
  date = new Date();
  fournisseur = '';
  reference = '';
  observations = '';

  article = '';
  quantite = 0;
  prixUnitaire = 0;

  articles: Article[] = [];

  fournisseurs = this.service.fournisseurs;
  articlesDisponibles = this.service.articlesDisponibles;

  constructor(private service: ApprovisionnementService, private router: Router) {}

  get total() {
    return this.articles.reduce((sum, a) => sum + a.montant, 0);
  }

  get montantTotalArticle() {
    return this.quantite * this.prixUnitaire;
  }

  ajouterArticle() {
    if (!this.article || this.quantite <= 0 || this.prixUnitaire <= 0) {
      alert('Veuillez remplir les champs article, quantité et prix.');
      return;
    }

    const montant = this.quantite * this.prixUnitaire;
    const id = this.articles.length + 1;
    this.articles.push({
      id,
      nom: this.article,
      quantite: this.quantite,
      prixUnitaire: this.prixUnitaire,
      montant,
    });

    this.article = '';
    this.quantite = 0;
    this.prixUnitaire = 0;
  }

  supprimerArticle(id: number) {
    this.articles = this.articles.filter(a => a.id !== id);
  }

  enregistrer() {
    if (!this.fournisseur || !this.reference || this.articles.length === 0) {
      alert('Veuillez remplir tous les champs obligatoires et ajouter au moins un article.');
      return;
    }

    this.service.add({
      reference: this.reference,
      date: this.date,
      fournisseur: this.fournisseur,
      articles: this.articles,
      montantTotal: this.total,
      statut: 'En_attente',
      observations: this.observations
    });

    alert('✅ Approvisionnement enregistré avec succès !');
    this.router.navigateByUrl('/approvisionnements');
  }

  annuler() {
    this.router.navigateByUrl('/approvisionnements');
  }
}
