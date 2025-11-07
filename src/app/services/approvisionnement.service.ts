import { Injectable } from '@angular/core';
import { Approvisionnement, Article } from '../models/approvisionnement.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {
  private approvisionnements: Approvisionnement[] = [
    {
      id: 1,
      reference: 'APP-2023-001',
      date: new Date('2023-04-15'),
      fournisseur: 'Textiles Dakar SARL',
      articles: [],
      montantTotal: 750000,
      statut: 'Reçu'
    },
    {
      id: 2,
      reference: 'APP-2023-002',
      date: new Date('2023-04-10'),
      fournisseur: 'Mercerie Centrale',
      articles: [],
      montantTotal: 320000,
      statut: 'Reçu'
    },
    {
      id: 3,
      reference: 'APP-2023-003',
      date: new Date('2023-04-05'),
      fournisseur: 'Tissus Premium',
      articles: [],
      montantTotal: 450000,
      statut: 'En_attente'
    },
    {
      id: 4,
      reference: 'APP-2023-004',
      date: new Date('2023-04-01'),
      fournisseur: 'Textiles Dakar SARL',
      articles: [],
      montantTotal: 680000,
      statut: 'Reçu'
    },
    {
      id: 5,
      reference: 'APP-2023-005',
      date: new Date('2023-03-25'),
      fournisseur: 'Mercerie Centrale',
      articles: [],
      montantTotal: 520000,
      statut: 'Reçu'
    }
  ];

  fournisseurs = ['Textiles Dakar SARL', 'Mercerie Centrale', 'Tissus Premium'];
  articlesDisponibles = ['Tissu coton', 'Fil à coudre', 'Boutons', 'Fermeture éclair'];

  constructor() { }

  getAll(): Approvisionnement[] {
    return this.approvisionnements;
  }

  add(approvisionnement: Omit<Approvisionnement, 'id'>): void {
    const newAppro: Approvisionnement = {
      ...approvisionnement,
      id: this.approvisionnements.length + 1
    };
    this.approvisionnements.push(newAppro);
  }

  getTotalApprovisionnements(): number {
    return this.approvisionnements.reduce((sum, a) => sum + a.montantTotal, 0);
  }

  getFournisseurPrincipal(): { nom: string, montant: number, pourcentage: number } {
    const fournisseursMap = new Map<string, number>();

    this.approvisionnements.forEach(a => {
      const current = fournisseursMap.get(a.fournisseur) || 0;
      fournisseursMap.set(a.fournisseur, current + a.montantTotal);
    });

    let principal = { nom: '', montant: 0, pourcentage: 0 };
    const total = this.getTotalApprovisionnements();

    fournisseursMap.forEach((montant, nom) => {
      if (montant > principal.montant) {
        principal = { nom, montant, pourcentage: (montant / total) * 100 };
      }
    });

    return principal;
  }
}
