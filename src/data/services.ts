// Rôle de ce fichier : la liste des prix. Ce n'est pas la base de données.
// Changer un tarif se fait ici, puis on renvoie le site.
// Les rendez-vous, eux, sont enregistrés par api/index.ts.
// coiffure, soins, boutique et vip sont les quatre groupes. Enfant n'a pas encore de liste.

export interface Service {
  id: string;
  name: string;
  price: string;
  duration: string;
  desc: string;
}

export const serviceCategories: Record<string, Service[]> = {
  coiffure: [
    { id: 'tresses', name: 'Tresses Africaines', price: '15 000 FCFA', duration: '2h - 4h', desc: 'Nattes collées complexes, box braids, ou tresses artistiques personnalisées.' },
    { id: 'tissage', name: 'Tissage & Perruque', price: '20 000 FCFA', duration: '2h', desc: 'Pose de tissage avec finition naturelle invisible ou confection de perruque sur-mesure.' },
    { id: 'nappy', name: 'Soin Profond Nappy', price: '10 000 FCFA', duration: '1h', desc: 'Traitement hydratant intense sous casque à vapeur pour nourrir les boucles naturelles.' },
    { id: 'degrade', name: 'Coupe Dégradé Homme', price: '3 000 FCFA', duration: '30 min', desc: 'Tonte précise, dégradé progressif moderne et traçage de contours nets.' },
    { id: 'barbe', name: 'Taille de Barbe', price: '2 000 FCFA', duration: '20 min', desc: 'Entretien et dessin de la barbe avec soin à la serviette chaude.' }
  ],
  soins: [
    { id: 'massage', name: 'Massage Relaxant aux Huiles', price: '25 000 FCFA', duration: '1h', desc: 'Massage corporel intégral aux huiles essentielles chaudes pour évacuer les tensions.' },
    { id: 'visage', name: 'Soin Visage Éclat Purifiant', price: '15 000 FCFA', duration: '45 min', desc: 'Nettoyage cutané en profondeur, gommage doux et masque à l\'argile régénérant.' },
    { id: 'rituel-gommage', name: 'Rituel Gommage & Massage', price: '35 000 FCFA', duration: '1h30', desc: 'Exfoliation complète du corps suivie d\'un massage réhydratant et relaxant.' },
    { id: 'soin-homme', name: 'Soin Hydratant Homme', price: '8 000 FCFA', duration: '40 min', desc: 'Soin ciblé nettoyant et énergisant adapté aux spécificités de la peau masculine.' }
  ],
  boutique: [
    { id: 'showroom', name: 'Accès Showroom Concept', price: 'Entrée Libre', duration: 'Lundi au Samedi', desc: 'Découvrez notre collection capsule de prêt-à-porter haut de gamme et d\'accessoires raffinés.' },
    { id: 'shopping', name: 'Session Shopping Privée', price: 'Offert', duration: '1h (Sur RDV)', desc: 'Profitez d\'un styliste dédié et de la privatisation du showroom pour vos essayages.' },
    { id: 'conseil', name: 'Conseil en Image Express', price: '10 000 FCFA', duration: '45 min', desc: 'Analyse de morphologie, colorimétrie et sélection de tenues adaptées à votre profil.' }
  ],
  vip: [
    { id: 'suite-vip', name: 'Option Suite VIP (Supplément)', price: '+5 000 FCFA', duration: 'Toute prestation', desc: 'Bénéficiez de votre soin dans une cabine privée luxueuse avec fauteuil massant, rafraîchissements et écran individuel.' },
    { id: 'rituel-vip', name: 'Rituel Beauté Complète VIP', price: '45 000 FCFA', duration: '3h', desc: 'Une coiffure d\'exception combinée à un soin du visage purifiant et un massage corporel (Suite VIP incluse).' },
    { id: 'mariage-prestige', name: 'Forfait Mariage Prestige', price: '50 000 FCFA', duration: 'Demi-journée', desc: 'Soin préparatoire, essai coiffure, coiffure finale le jour J, rafraîchissements et privatisation de la Suite VIP.' }
  ]
};

export const allServicesList: Service[] = [
  ...serviceCategories.coiffure,
  ...serviceCategories.soins,
  ...serviceCategories.boutique,
  ...serviceCategories.vip
];

export const categories = [
  { id: 'coiffure', label: 'Haute Coiffure' },
  { id: 'soins', label: 'Spa & Soins Esthétiques' },
  { id: 'boutique', label: 'Showroom Mode' },
  { id: 'vip', label: 'Forfaits & Suite VIP' }
];
