export type Person = "pai" | "mae" | "filha";
export type MealType = "cafe" | "almoco" | "lanche" | "jantar";

export interface Portion {
  nome: string;
  quantidade: number;
  unidade: "g" | "ml" | "un";
}
export interface Meal {
  prato: string;
  itens: Portion[];
  receitaId?: string;
}
export type DayPlan = Record<MealType, Meal>;

export const dias: Record<number, string> = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
};

// ====== Plano semanal (resumo somado por refeição) ======
export const semana: Record<string, DayPlan> = {
  segunda: {
    cafe: {
      prato: "Pão integral + ovos + mamão",
      itens: [
        { nome: "Pão integral (60/40/30g)", quantidade: 130, unidade: "g" },
        { nome: "Ovos (2/2/1)", quantidade: 5, unidade: "un" },
        { nome: "Mamão (150/120/80g)", quantidade: 350, unidade: "g" },
      ],
    },
    almoco: {
      prato: "Arroz + feijão carioca + frango + brócolis",
      receitaId: "arroz-feijao-frango",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Feijão carioca (cozido)", quantidade: 140, unidade: "g" },
        { nome: "Peito de frango", quantidade: 280, unidade: "g" },
        { nome: "Brócolis", quantidade: 260, unidade: "g" },
      ],
    },
    lanche: {
      prato: "Iogurte + aveia + banana",
      itens: [
        { nome: "Iogurte natural", quantidade: 450, unidade: "g" },
        { nome: "Aveia em flocos", quantidade: 45, unidade: "g" },
        { nome: "Banana", quantidade: 230, unidade: "g" },
      ],
    },
    jantar: {
      prato: "Purê batata-doce + carne moída + abobrinha",
      receitaId: "pure-carne-abobrinha",
      itens: [
        { nome: "Purê de batata-doce (cozida)", quantidade: 260, unidade: "g" },
        { nome: "Carne moída bovina", quantidade: 350, unidade: "g" },
        { nome: "Abobrinha", quantidade: 260, unidade: "g" },
      ],
    },
  },
  terca: {
    cafe: {
      prato: "Tapioca + queijo minas + suco de laranja",
      itens: [
        { nome: "Goma de tapioca", quantidade: 140, unidade: "g" },
        { nome: "Queijo minas", quantidade: 90, unidade: "g" },
        { nome: "Suco de laranja (in natura)", quantidade: 450, unidade: "ml" },
      ],
    },
    almoco: {
      prato: "Arroz + lentilha + suíno + couve",
      receitaId: "arroz-lentilha-suino",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Lentilha (cozida)", quantidade: 140, unidade: "g" },
        { nome: "Filé suíno", quantidade: 280, unidade: "g" },
        { nome: "Couve", quantidade: 260, unidade: "g" },
      ],
    },
    lanche: {
      prato: "Vitamina (leite+aveia+maçã)",
      itens: [
        { nome: "Leite", quantidade: 600, unidade: "ml" },
        { nome: "Aveia em flocos", quantidade: 45, unidade: "g" },
        { nome: "Maçã", quantidade: 230, unidade: "g" },
      ],
    },
    jantar: {
      prato: "Arroz + feijão preto + frango + cenoura",
      receitaId: "arroz-feijao-frango",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Feijão preto (cozido)", quantidade: 150, unidade: "g" },
        { nome: "Peito de frango", quantidade: 280, unidade: "g" },
        { nome: "Cenoura", quantidade: 260, unidade: "g" },
      ],
    },
  },
  quarta: {
    cafe: {
      prato: "Omelete de espinafre + pão + suco de acerola",
      itens: [
        { nome: "Ovos (2/2/1)", quantidade: 5, unidade: "un" },
        { nome: "Espinafre", quantidade: 150, unidade: "g" },
        { nome: "Pão integral (60/40/30g)", quantidade: 130, unidade: "g" },
        { nome: "Suco de acerola (in natura)", quantidade: 450, unidade: "ml" },
      ],
    },
    almoco: {
      prato: "Purê batata-doce + carne moída + vagem",
      receitaId: "pure-carne-vagem",
      itens: [
        { nome: "Purê de batata-doce (cozida)", quantidade: 260, unidade: "g" },
        { nome: "Carne moída bovina", quantidade: 350, unidade: "g" },
        { nome: "Vagem", quantidade: 260, unidade: "g" },
      ],
    },
    lanche: {
      prato: "Iogurte + granola + morangos",
      itens: [
        { nome: "Iogurte natural", quantidade: 450, unidade: "g" },
        { nome: "Granola", quantidade: 60, unidade: "g" },
        { nome: "Morangos", quantidade: 230, unidade: "g" },
      ],
    },
    jantar: {
      prato: "Arroz + grão-de-bico + suíno + abóbora",
      receitaId: "arroz-gbico-suino",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Grão-de-bico (cozido)", quantidade: 140, unidade: "g" },
        { nome: "Filé suíno", quantidade: 280, unidade: "g" },
        { nome: "Abóbora", quantidade: 260, unidade: "g" },
      ],
    },
  },
  quinta: {
    cafe: {
      prato: "Cuscuz nordestino + ovos + mamão",
      itens: [
        { nome: "Cuscuz (cozido)", quantidade: 180, unidade: "g" },
        { nome: "Ovos (2/2/1)", quantidade: 5, unidade: "un" },
        { nome: "Mamão", quantidade: 350, unidade: "g" },
      ],
    },
    almoco: {
      prato: "Arroz + feijão carioca + frango + beterraba",
      receitaId: "arroz-feijao-frango",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Feijão carioca (cozido)", quantidade: 150, unidade: "g" },
        { nome: "Peito de frango", quantidade: 280, unidade: "g" },
        { nome: "Beterraba", quantidade: 260, unidade: "g" },
      ],
    },
    lanche: {
      prato: "Pão + patê de atum + suco de laranja",
      itens: [
        { nome: "Pão integral (60/40/30g)", quantidade: 130, unidade: "g" },
        { nome: "Atum (em água)", quantidade: 90, unidade: "g" },
        { nome: "Suco de laranja (in natura)", quantidade: 450, unidade: "ml" },
      ],
    },
    jantar: {
      prato: "Purê batata-doce + carne moída + couve",
      receitaId: "pure-carne-couve",
      itens: [
        { nome: "Purê de batata-doce (cozida)", quantidade: 260, unidade: "g" },
        { nome: "Carne moída bovina", quantidade: 350, unidade: "g" },
        { nome: "Couve", quantidade: 260, unidade: "g" },
      ],
    },
  },
  sexta: {
    cafe: {
      prato: "Pão integral + queijo minas + mamão",
      itens: [
        { nome: "Pão integral (60/40/30g)", quantidade: 130, unidade: "g" },
        { nome: "Queijo minas", quantidade: 90, unidade: "g" },
        { nome: "Mamão", quantidade: 350, unidade: "g" },
      ],
    },
    almoco: {
      prato: "Arroz + lentilha + suíno + abóbora",
      receitaId: "arroz-lentilha-suino",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Lentilha (cozida)", quantidade: 140, unidade: "g" },
        { nome: "Filé suíno", quantidade: 280, unidade: "g" },
        { nome: "Abóbora", quantidade: 260, unidade: "g" },
      ],
    },
    lanche: {
      prato: "Iogurte + aveia + morangos",
      itens: [
        { nome: "Iogurte natural", quantidade: 450, unidade: "g" },
        { nome: "Aveia em flocos", quantidade: 45, unidade: "g" },
        { nome: "Morangos", quantidade: 230, unidade: "g" },
      ],
    },
    jantar: {
      prato: "Pizza caseira (massa + frango + queijo + vegetais)",
      receitaId: "pizza-caseira",
      itens: [
        { nome: "Massa para pizza", quantidade: 430, unidade: "g" },
        { nome: "Peito de frango (pizza)", quantidade: 180, unidade: "g" },
        { nome: "Queijo muçarela (pizza)", quantidade: 90, unidade: "g" },
      ],
    },
  },
  sabado: {
    cafe: {
      prato: "Vitamina (leite+aveia+banana)",
      itens: [
        { nome: "Leite", quantidade: 600, unidade: "ml" },
        { nome: "Aveia em flocos", quantidade: 45, unidade: "g" },
        { nome: "Banana", quantidade: 280, unidade: "g" },
      ],
    },
    almoco: {
      prato: "Arroz + feijão preto + frango + couve",
      receitaId: "arroz-feijao-frango",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Feijão preto (cozido)", quantidade: 150, unidade: "g" },
        { nome: "Peito de frango", quantidade: 280, unidade: "g" },
        { nome: "Couve", quantidade: 260, unidade: "g" },
      ],
    },
    lanche: {
      prato: "Pão + ovos + mamão",
      itens: [
        { nome: "Pão integral (60/40/30g)", quantidade: 130, unidade: "g" },
        { nome: "Ovos (2/2/1)", quantidade: 5, unidade: "un" },
        { nome: "Mamão", quantidade: 350, unidade: "g" },
      ],
    },
    jantar: {
      prato: "Purê batata-doce + carne moída + cenoura",
      receitaId: "pure-carne-cenoura",
      itens: [
        { nome: "Purê de batata-doce (cozida)", quantidade: 260, unidade: "g" },
        { nome: "Carne moída bovina", quantidade: 350, unidade: "g" },
        { nome: "Cenoura", quantidade: 260, unidade: "g" },
      ],
    },
  },
  domingo: {
    cafe: {
      prato: "Tapioca + ovos + suco de acerola",
      itens: [
        { nome: "Goma de tapioca", quantidade: 140, unidade: "g" },
        { nome: "Ovos (2/2/1)", quantidade: 5, unidade: "un" },
        { nome: "Suco de acerola (in natura)", quantidade: 450, unidade: "ml" },
      ],
    },
    almoco: { prato: "Livre", itens: [] },
    lanche: {
      prato: "Iogurte + granola + frutas variadas",
      itens: [
        { nome: "Iogurte natural", quantidade: 450, unidade: "g" },
        { nome: "Granola", quantidade: 60, unidade: "g" },
        { nome: "Frutas variadas (mix)", quantidade: 240, unidade: "g" },
      ],
    },
    jantar: {
      prato: "Arroz + grão-de-bico + suíno + brócolis",
      receitaId: "arroz-gbico-suino",
      itens: [
        { nome: "Arroz branco", quantidade: 180, unidade: "g" },
        { nome: "Grão-de-bico (cozido)", quantidade: 140, unidade: "g" },
        { nome: "Filé suíno", quantidade: 280, unidade: "g" },
        { nome: "Brócolis", quantidade: 260, unidade: "g" },
      ],
    },
  },
};

// ====== Receitas / modo de preparo ======
export const receitas: Record<
  string,
  { titulo: string; modo: string[]; rendimento: string }
> = {
  "arroz-feijao-frango": {
    titulo: "Arroz com feijão + frango grelhado",
    rendimento: "3 porções (família – somatório das porções do dia)",
    modo: [
      "Arroz: refogar 1 dente de alho e 1/2 cebola em azeite, adicionar arroz e água (1:2) e cozinhar até secar.",
      "Feijão: usar cozido (congelado) ou de panela. Ajustar sal e finalizar com cheiro-verde.",
      "Frango: temperar com sal, pimenta, alho e limão; grelhar até dourar.",
      "Servir com legumes no vapor (brócolis/cenoura/beterraba/couve).",
    ],
  },
  "pure-carne-abobrinha": {
    titulo: "Purê de batata-doce + carne moída + abobrinha",
    rendimento: "3 porções",
    modo: [
      "Purê: cozinhar batata-doce e amassar com um fio de leite/água, sal e noz-moscada.",
      "Carne moída: refogar alho, cebola e tomate; dourar a carne; ajustar sal/páprica.",
      "Abobrinha: refogar rapidamente com azeite, sal e ervas.",
    ],
  },
  "arroz-lentilha-suino": {
    titulo: "Arroz + lentilha + filé suíno",
    rendimento: "3 porções",
    modo: [
      "Cozinhar a lentilha até macia; finalizar com azeite e sal.",
      "Grelhar o filé suíno em medalhões temperados.",
      "Arroz branco tradicional.",
    ],
  },
  "arroz-gbico-suino": {
    titulo: "Arroz + grão-de-bico + filé suíno",
    rendimento: "3 porções",
    modo: [
      "Grão-de-bico: deixar de molho 8–12h; cozinhar na pressão 20–25min.",
      "Grelhar o filé suíno e fatiar.",
      "Acompanhar com abóbora/brócolis no vapor.",
    ],
  },
  "pure-carne-vagem": {
    titulo: "Purê de batata-doce + carne moída + vagem",
    rendimento: "3 porções",
    modo: [
      "Purê básico de batata-doce.",
      "Carne moída refogada com alho, cebola, páprica e cominho.",
      "Vagem no vapor, finalizar com azeite e sal.",
    ],
  },
  "pure-carne-couve": {
    titulo: "Purê de batata-doce + carne moída + couve",
    rendimento: "3 porções",
    modo: [
      "Purê básico de batata-doce.",
      "Carne moída refogada sequinha (boa para congelar).",
      "Couve refogada rapidamente com alho e azeite.",
    ],
  },
  "pizza-caseira": {
    titulo: "Pizza caseira (massa + frango + queijo + vegetais)",
    rendimento: "1 pizza média",
    modo: [
      "Massa rápida: 250 g farinha, 150 ml água morna, 5 g fermento seco, 1/2 cchá sal, 1 csopa azeite. Descansar 40–60 min.",
      "Abrir, cobrir com molho, frango desfiado, queijo e vegetais; assar a 240–260°C por 10–12 min.",
    ],
  },
};

// ====== Lista de mercado consolidada (semana) ======
export const listaMercadoConsolidada = [
  { item: "Arroz branco", unidade: "g", quantidade: 1440 },
  { item: "Feijão carioca (cozido)", unidade: "g", quantidade: 290 },
  { item: "Feijão preto (cozido)", unidade: "g", quantidade: 300 },
  { item: "Lentilha (cozida)", unidade: "g", quantidade: 280 },
  { item: "Grão-de-bico (cozido)", unidade: "g", quantidade: 260 },
  { item: "Peito de frango", unidade: "g", quantidade: 1120 },
  { item: "Peito de frango (pizza)", unidade: "g", quantidade: 180 },
  { item: "Carne moída bovina", unidade: "g", quantidade: 1400 },
  { item: "Filé suíno", unidade: "g", quantidade: 820 },
  { item: "Atum (em água)", unidade: "g", quantidade: 90 },
  { item: "Ovos", unidade: "un", quantidade: 25 },
  { item: "Iogurte natural", unidade: "g", quantidade: 1000 },
  { item: "Leite", unidade: "ml", quantidade: 1200 },
  { item: "Suco de laranja (in natura)", unidade: "ml", quantidade: 900 },
  { item: "Suco de acerola (in natura)", unidade: "ml", quantidade: 900 },
  { item: "Pão integral", unidade: "g", quantidade: 650 },
  { item: "Goma de tapioca", unidade: "g", quantidade: 140 },
  { item: "Cuscuz (flocão cozido)", unidade: "g", quantidade: 180 },
  { item: "Purê de batata-doce (cozida)", unidade: "g", quantidade: 1040 },
  { item: "Massa para pizza", unidade: "g", quantidade: 430 },
  { item: "Aveia em flocos", unidade: "g", quantidade: 180 },
  { item: "Granola", unidade: "g", quantidade: 120 },
  { item: "Queijo minas", unidade: "g", quantidade: 180 },
  { item: "Queijo muçarela (pizza)", unidade: "g", quantidade: 90 },
  { item: "Mamão", unidade: "g", quantidade: 1400 },
  { item: "Banana", unidade: "g", quantidade: 510 },
  { item: "Maçã", unidade: "g", quantidade: 230 },
  { item: "Morangos", unidade: "g", quantidade: 460 },
  { item: "Frutas variadas (mix)", unidade: "g", quantidade: 240 },
  { item: "Brócolis", unidade: "g", quantidade: 520 },
  { item: "Abobrinha", unidade: "g", quantidade: 260 },
  { item: "Couve", unidade: "g", quantidade: 780 },
  { item: "Cenoura", unidade: "g", quantidade: 520 },
  { item: "Abóbora", unidade: "g", quantidade: 520 },
  { item: "Beterraba", unidade: "g", quantidade: 260 },
  { item: "Espinafre", unidade: "g", quantidade: 150 },
  { item: "Vagem", unidade: "g", quantidade: 260 },
];
