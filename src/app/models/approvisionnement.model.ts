export interface Approvisionnement {
  id: number;
  reference: string;
  date: Date;
  fournisseur: string;
  articles: Article[];
  montantTotal: number;
  statut: 'En_attente' | 'Reçu';
  observations?: string;
}

export interface Article {
  id: number;
  nom: string;
  quantite: number;
  prixUnitaire: number;
  montant: number;
}
