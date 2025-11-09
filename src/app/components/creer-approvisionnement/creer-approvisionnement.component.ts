import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Article } from '../../models/approvisionnement.model';
import { ApprovisionnementService } from '../../services/approvisionnement.service';

@Component({
  selector: 'app-creer-approvisionnement',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './creer-approvisionnement.component.html'
})
export class CreerApprovisionnementComponent implements OnInit {
  // Signaux pour les formulaires
  date = signal(new Date().toISOString().split('T')[0]);
  fournisseur = signal('');
  reference = signal('');
  observations = signal('');

  article = signal('');
  quantite = signal(0);
  prixUnitaire = signal(0);

  // Signal pour les articles ajoutés
  articles = signal<Article[]>([]);

  // Signaux calculés
  total = computed(() =>
    this.articles().reduce((sum, a) => sum + a.montant, 0)
  );

  montantTotalArticle = computed(() =>
    this.quantite() * this.prixUnitaire()
  );

  // Données du service
  fournisseurs = this.service.fournisseurs;
  articlesDisponibles = this.service.articlesDisponibles;

  constructor(private service: ApprovisionnementService, private router: Router) {}

  ngOnInit() {
    this.genererReference();
  }

  onDateChange(event: any) {
    const selectedDate = event.target.value;
    this.date.set(selectedDate);
    this.genererReference();
  }

  genererReference() {
    const selectedDate = new Date(this.date());
    const approvisionnements = this.service.getAll()();

    // Compter seulement les approvisionnements du mois sélectionné
    const moisSelectionne = selectedDate.getMonth() + 1;
    const anneeSelectionnee = selectedDate.getFullYear();

    const approvisionnementsCeMois = approvisionnements.filter(appro => {
      const dateAppro = new Date(appro.date);
      return dateAppro.getMonth() + 1 === moisSelectionne &&
             dateAppro.getFullYear() === anneeSelectionnee;
    });

    const count = approvisionnementsCeMois.length + 1;

    const reference = `APP-${anneeSelectionnee}-${count.toString().padStart(3, '0')}`;

    this.reference.set(reference);
  }

  ajouterArticle() {
    const currentArticle = this.article();
    const currentQuantite = this.quantite();
    const currentPrix = this.prixUnitaire();

    if (!currentArticle || currentQuantite <= 0 || currentPrix <= 0) {
      alert('Veuillez remplir les champs article, quantité et prix.');
      return;
    }

    const montant = currentQuantite * currentPrix;
    const currentArticles = this.articles();
    const newId = currentArticles.length > 0
      ? Math.max(...currentArticles.map(a => a.id)) + 1
      : 1;

    const newArticle: Article = {
      id: newId,
      nom: currentArticle,
      quantite: currentQuantite,
      prixUnitaire: currentPrix,
      montant,
    };

    this.articles.update(articles => [...articles, newArticle]);

    // Réinitialiser les champs
    this.article.set('');
    this.quantite.set(0);
    this.prixUnitaire.set(0);
  }

  supprimerArticle(id: number) {
    this.articles.update(articles => articles.filter(a => a.id !== id));
  }

  enregistrer() {
    const currentFournisseur = this.fournisseur();
    const currentReference = this.reference();
    const currentArticles = this.articles();

    if (!currentFournisseur || currentArticles.length === 0) {
      alert('Veuillez sélectionner un fournisseur et ajouter au moins un article.');
      return;
    }

    this.service.add({
      reference: currentReference,
      date: new Date(this.date()),
      fournisseur: currentFournisseur,
      articles: [...currentArticles],
      montantTotal: this.total(),
      statut: 'En_attente',
      observations: this.observations()
    });

    alert('✅ Approvisionnement enregistré avec succès !');
    this.router.navigate(['/']);
  }

  annuler() {
    this.router.navigate(['/']);
  }
}
