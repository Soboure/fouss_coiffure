// Rôle de ce fichier : la liste des prix. Ce n'est pas la base de données.
// Changer un tarif se fait ici, puis on renvoie le site.
// Les rendez-vous, eux, sont enregistrés par api/index.ts.
// coiffure, soins, boutique et vip sont les quatre groupes. Femme, Homme et Enfant sont détaillés. Les nouvelles coiffures du guide sont en Prix au salon.

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
    { id: 'barbe', name: 'Taille de Barbe', price: '2 000 FCFA', duration: '20 min', desc: 'Entretien et dessin de la barbe avec soin à la serviette chaude.' },
    { id: 'taper', name: 'Taper Fade', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Dégradé progressif aux tempes et à la nuque, volume gardé sur le dessus.' },
    { id: 'degrade-blanc', name: 'Dégradé à blanc', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Rasage court sur les côtés, high, mid ou low fade.' },
    { id: 'contours', name: 'Contours', price: 'Prix au salon', duration: '20 min', desc: 'Lignes nettes du front, des tempes, des pattes et de la barbe.' },
    { id: 'waves', name: 'Waves', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Vagues 360 ou 180, brossage et finition.' },
    { id: 'sponge', name: 'Sponge Twists', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Petites torsades formées à l\'éponge sur le dessus.' },
    { id: 'boule-zero', name: 'Boule à zéro', price: 'Prix au salon', duration: '20 min', desc: 'Rasage complet du cuir chevelu.' },
    { id: 'nattes-homme', name: 'Nattes collées homme', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Tresses plaquées, lignes droites ou motifs, souvent avec un dégradé.' },
    { id: 'twists-homme', name: 'Twists homme', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Vanilles libres sur toute la tête ou seulement le dessus.' },
    { id: 'dreadlocks', name: 'Dreadlocks, retwist', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Entretien des locks, racines tournées pour une finition nette.' },
    { id: 'afro', name: 'Afro et High Top', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Volume naturel, ou dessus haut et plat avec côtés courts.' },
    { id: 'nattes-femme', name: 'Nattes collées', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Tresses plaquées, vers l\'arrière ou selon un dessin.' },
    { id: 'ghana', name: 'Ghana Weaving', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Nattes collées avec mèches ajoutées, relief épais.' },
    { id: 'box', name: 'Box Braids', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Tresses individuelles, carrés nets à la racine.' },
    { id: 'knotless', name: 'Knotless Braids', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Tresses sans nœud de départ, moins de tension.' },
    { id: 'goddess', name: 'Goddess Braids', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Tresses terminées par des mèches bouclées.' },
    { id: 'senegalese', name: 'Senegalese Twists', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Vanilles fines et régulières, aspect lisse.' },
    { id: 'marley', name: 'Marley Twists', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Vanilles à texture crépue, proche du cheveu naturel.' },
    { id: 'passion', name: 'Passion Twists', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Vanilles bouclées, volume léger.' },
    { id: 'perruque', name: 'Pose de perruque', price: 'Prix au salon', duration: 'Selon la pose', desc: 'Installation d\'une perruque lace, ligne de cheveux naturelle.' },
    { id: 'faux-locks', name: 'Faux locks', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Look locks sans transformation définitive.' },
    { id: 'taper-femme', name: 'Taper fade féminin', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Longueur et boucles sur le dessus, côtés dégradés.' },
    { id: 'teint', name: 'Teint sur cheveux courts', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Coupe courte et coloration : blond, doré, rouge ou blanc.' },
    { id: 'perles', name: 'Nattes avec perles', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Nattes enfant ornées de perles, billes ou coquillages.' },
    { id: 'fil', name: 'Coiffure au fil', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Cheveux enroulés de fil, sans chaleur.' },
    { id: 'pompons', name: 'Choux et pompons', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Sections réunies en boules, élastiques doux.' },
    { id: 'mini-vanilles', name: 'Mini-vanilles', price: 'Prix au salon', duration: 'Selon la coiffure', desc: 'Petites torsades sur cheveux naturels, pratique pour l\'école.' },
    { id: 'degrade-enfant', name: 'Dégradé garçon', price: 'Prix au salon', duration: '30 min', desc: 'Coupe nette à la tondeuse, adaptée au cuir chevelu des enfants.' },
    { id: 'motifs', name: 'Motifs légers', price: 'Prix au salon', duration: 'Selon la coupe', desc: 'Lignes, éclairs ou étoiles tracés sur un dégradé.' }
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
