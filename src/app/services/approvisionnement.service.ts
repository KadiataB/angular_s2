import { Injectable, signal, computed } from '@angular/core';
import { Approvisionnement, Article } from '../models/approvisionnement.model';

@Injectable({
  providedIn: 'root'
})
export class ApprovisionnementService {
  private readonly STORAGE_KEY = 'approvisionnements';

  // Signaux pour les données
  private approvisionnements = signal<Approvisionnement[]>(this.getFromStorage());

  // Signaux calculés
  readonly totalApprovisionnements = computed(() =>
    this.approvisionnements().reduce((sum, a) => sum + a.montantTotal, 0)
  );

  readonly fournisseurPrincipal = computed(() => {
    const appros = this.approvisionnements();
    const fournisseursMap = new Map<string, number>();

    appros.forEach(a => {
      const current = fournisseursMap.get(a.fournisseur) || 0;
      fournisseursMap.set(a.fournisseur, current + a.montantTotal);
    });

    let principal = { nom: '', montant: 0, pourcentage: 0 };
    const total = this.totalApprovisionnements();

    fournisseursMap.forEach((montant, nom) => {
      if (montant > principal.montant) {
        principal = {
          nom,
          montant,
          pourcentage: total > 0 ? (montant / total) * 100 : 0
        };
      }
    });

    return principal;
  });

  readonly nombreApprovisionnements = computed(() => this.approvisionnements().length);

  // Données statiques
  readonly fournisseurs = ['Textiles Dakar SARL', 'Mercerie Centrale', 'Tissus Premium'];
  readonly articlesDisponibles = ['Tissu coton', 'Fil à coudre', 'Boutons', 'Fermeture éclair'];

  constructor() {
    this.initializeData();
  }

  private initializeData(): void {
    const existing = this.getFromStorage();
    if (existing.length === 0) {
      const sampleData: Approvisionnement[] = [
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
      this.approvisionnements.set(sampleData);
      this.saveToStorage(sampleData);
    }
  }

  private getFromStorage(): Approvisionnement[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) {
      const approvisionnements = JSON.parse(data);
      return approvisionnements.map((a: any) => ({
        ...a,
        date: new Date(a.date),
        articles: a.articles || []
      }));
    }
    return [];
  }

  private saveToStorage(data: Approvisionnement[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  getAll() {
    return this.approvisionnements.asReadonly();
  }

  add(approvisionnement: Omit<Approvisionnement, 'id'>): void {
    const current = this.approvisionnements();
    const newId = current.length > 0
      ? Math.max(...current.map(a => a.id)) + 1
      : 1;

    const newAppro: Approvisionnement = {
      ...approvisionnement,
      id: newId
    };

    const updated = [...current, newAppro];
    this.approvisionnements.set(updated);
    this.saveToStorage(updated);
  }

}
