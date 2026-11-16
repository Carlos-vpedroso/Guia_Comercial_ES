import { ContactType } from "@prisma/client";
import prisma from "../../src/lib/prisma.js";
import { slugify } from "../../src/utils/format.js";
import type { CategoryName } from "./category.seed.js";

type SeedCompany = {
  name: string;
  description: string;
  address: {
    street: string;
    number?: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  phone: string; // DDD + número, só dígitos
  hours: { dayOfWeek: number; openTime: string; closeTime: string }[];
  isHighlighted?: boolean;
};

// dayOfWeek segue o padrão do JS: 0 = domingo ... 6 = sábado
function schedule(
  days: number[],
  openTime: string,
  closeTime: string,
): { dayOfWeek: number; openTime: string; closeTime: string }[] {
  return days.map((dayOfWeek) => ({ dayOfWeek, openTime, closeTime }));
}

const WEEKDAYS = [1, 2, 3, 4, 5];

const COMMERCIAL = [
  ...schedule(WEEKDAYS, "08:00", "18:00"),
  ...schedule([6], "08:00", "12:00"),
];
const STORE = [
  ...schedule(WEEKDAYS, "09:00", "19:00"),
  ...schedule([6], "09:00", "14:00"),
];
const RESTAURANT = schedule([0, 2, 3, 4, 5, 6], "11:00", "15:00");
const NIGHT = schedule([2, 3, 4, 5, 6], "18:00", "23:30");

// a empresa sempre tem os 7 dias; os que não estão em `hours` ficam fechados (null)
function fullWeek(hours: SeedCompany["hours"]) {
  return [0, 1, 2, 3, 4, 5, 6].map(
    (dayOfWeek) =>
      hours.find((day) => day.dayOfWeek === dayOfWeek) ?? {
        dayOfWeek,
        openTime: null,
        closeTime: null,
      },
  );
}

// "Moqueca da Ilha" -> "moquecadailha" (perfis do Instagram não usam hífen)
function toInstagramHandle(name: string) {
  return slugify(name).replace(/-/g, "");
}

function buildContacts(company: SeedCompany) {
  const handle = toInstagramHandle(company.name);

  return [
    { type: ContactType.PHONE, url: `tel:+55${company.phone}` },
    { type: ContactType.WHATSAPP, url: `https://wa.me/55${company.phone}` },
    { type: ContactType.INSTAGRAM, url: `https://instagram.com/${handle}` },
  ];
}

const companiesByCategory: Record<CategoryName, SeedCompany[]> = {
  Alimentação: [
    {
      name: "Moqueca da Ilha",
      description:
        "Moqueca capixaba feita na panela de barro, com frutos do mar frescos.",
      address: {
        street: "Rua Desembargador Augusto Botelho",
        number: "320",
        neighborhood: "Praia do Canto",
        city: "Vitória",
        state: "ES",
        zipCode: "29055440",
      },
      phone: "27998010101",
      hours: RESTAURANT,
      isHighlighted: true,
    },
    {
      name: "Padaria Pão Dourado",
      description:
        "Pães artesanais, cafés especiais e salgados assados na hora.",
      address: {
        street: "Avenida Champagnat",
        number: "815",
        neighborhood: "Centro",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29100011",
      },
      phone: "27998010102",
      hours: schedule([0, 1, 2, 3, 4, 5, 6], "06:00", "20:00"),
    },
    {
      name: "Pizzaria Forno a Lenha Serrana",
      description:
        "Pizzas de massa fina assadas no forno a lenha, com rodízio às sextas.",
      address: {
        street: "Avenida Talma Rodrigues Ribeiro",
        number: "1450",
        neighborhood: "Portal de Jacaraípe",
        city: "Serra",
        state: "ES",
        zipCode: "29173795",
      },
      phone: "27998010103",
      hours: NIGHT,
    },
  ],
  "Saúde e bem-estar": [
    {
      name: "Clínica Vida Plena",
      description:
        "Clínica multidisciplinar com clínico geral, nutrição e psicologia.",
      address: {
        street: "Avenida Nossa Senhora da Penha",
        number: "1495",
        complement: "Sala 702",
        neighborhood: "Santa Lúcia",
        city: "Vitória",
        state: "ES",
        zipCode: "29056250",
      },
      phone: "27998020201",
      hours: COMMERCIAL,
      isHighlighted: true,
    },
    {
      name: "Studio Equilíbrio Pilates",
      description:
        "Aulas de pilates em grupos reduzidos e fisioterapia funcional.",
      address: {
        street: "Rua Henrique Moscoso",
        number: "1020",
        neighborhood: "Praia da Costa",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29101345",
      },
      phone: "27998020202",
      hours: schedule(WEEKDAYS, "06:00", "21:00"),
    },
    {
      name: "Farmácia Bem Viver",
      description: "Medicamentos, manipulação e aferição de pressão sem custo.",
      address: {
        street: "Avenida Expedito Garcia",
        number: "210",
        neighborhood: "Campo Grande",
        city: "Cariacica",
        state: "ES",
        zipCode: "29146201",
      },
      phone: "27998020203",
      hours: schedule([0, 1, 2, 3, 4, 5, 6], "07:00", "22:00"),
    },
  ],
  Beleza: [
    {
      name: "Salão Raízes Hair",
      description:
        "Cortes, coloração e tratamentos para cabelos cacheados e crespos.",
      address: {
        street: "Rua Aleixo Netto",
        number: "560",
        neighborhood: "Praia do Canto",
        city: "Vitória",
        state: "ES",
        zipCode: "29055260",
      },
      phone: "27998030301",
      hours: STORE,
      isHighlighted: true,
    },
    {
      name: "Barbearia Navalha de Ouro",
      description:
        "Barba, cabelo e sobrancelha com atendimento por agendamento.",
      address: {
        street: "Rua Antônio Ataíde",
        number: "88",
        neighborhood: "Centro",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29100290",
      },
      phone: "27998030302",
      hours: schedule([2, 3, 4, 5, 6], "09:00", "20:00"),
    },
    {
      name: "Espaço Lótus Estética",
      description:
        "Limpeza de pele, design de sobrancelhas e massagem relaxante.",
      address: {
        street: "Rua Joaquim Lírio",
        number: "235",
        complement: "Loja 3",
        neighborhood: "Muquiçaba",
        city: "Guarapari",
        state: "ES",
        zipCode: "29215030",
      },
      phone: "27998030303",
      hours: COMMERCIAL,
    },
  ],
  "Serviços automotivos": [
    {
      name: "Auto Center Rodovia",
      description:
        "Mecânica geral, alinhamento, balanceamento e troca de óleo.",
      address: {
        street: "Rodovia do Sol",
        number: "3200",
        neighborhood: "Itaparica",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29102020",
      },
      phone: "27998040401",
      hours: COMMERCIAL,
      isHighlighted: true,
    },
    {
      name: "Lava Jato Brilho Total",
      description: "Lavagem completa, higienização interna e polimento.",
      address: {
        street: "Avenida Eldes Scherrer Souza",
        number: "975",
        neighborhood: "Parque Residencial Laranjeiras",
        city: "Serra",
        state: "ES",
        zipCode: "29165680",
      },
      phone: "27998040402",
      hours: schedule([1, 2, 3, 4, 5, 6], "08:00", "18:00"),
    },
    {
      name: "Funilaria e Pintura Linhares",
      description:
        "Recuperação de lataria, pintura automotiva e martelinho de ouro.",
      address: {
        street: "Avenida Governador Carlos Lindenberg",
        number: "1600",
        neighborhood: "Centro",
        city: "Linhares",
        state: "ES",
        zipCode: "29900020",
      },
      phone: "27998040403",
      hours: COMMERCIAL,
    },
  ],
  "Varejo e moda": [
    {
      name: "Boutique Maré Alta",
      description:
        "Moda feminina praia e casual com peças de marcas capixabas.",
      address: {
        street: "Rua Chapot Presvot",
        number: "389",
        neighborhood: "Praia do Canto",
        city: "Vitória",
        state: "ES",
        zipCode: "29055410",
      },
      phone: "27998050501",
      hours: STORE,
      isHighlighted: true,
    },
    {
      name: "Calçados Passo Firme",
      description:
        "Calçados masculinos, femininos e infantis para todas as ocasiões.",
      address: {
        street: "Avenida Getúlio Vargas",
        number: "455",
        neighborhood: "Centro",
        city: "Colatina",
        state: "ES",
        zipCode: "29700010",
      },
      phone: "27998050502",
      hours: STORE,
    },
    {
      name: "Armarinho Costura & Cia",
      description: "Tecidos, aviamentos e materiais para artesanato.",
      address: {
        street: "Rua Moniz Freire",
        number: "120",
        neighborhood: "Centro",
        city: "Cachoeiro de Itapemirim",
        state: "ES",
        zipCode: "29300090",
      },
      phone: "28998050503",
      hours: COMMERCIAL,
    },
  ],
  "Casa e construção": [
    {
      name: "Materiais de Construção Alicerce",
      description:
        "Cimento, ferragens, tintas e entrega rápida na Grande Vitória.",
      address: {
        street: "Rodovia Governador Mário Covas",
        number: "2100",
        neighborhood: "Planalto Serrano",
        city: "Serra",
        state: "ES",
        zipCode: "29162703",
      },
      phone: "27998060601",
      hours: COMMERCIAL,
      isHighlighted: true,
    },
    {
      name: "Marcenaria Arte em Madeira",
      description: "Móveis planejados para cozinha, quarto e escritório.",
      address: {
        street: "Rua São Paulo",
        number: "740",
        neighborhood: "Itaquari",
        city: "Cariacica",
        state: "ES",
        zipCode: "29148600",
      },
      phone: "27998060602",
      hours: schedule(WEEKDAYS, "07:30", "17:30"),
    },
    {
      name: "Vidraçaria Cristal Aracruz",
      description:
        "Box para banheiro, espelhos, janelas e portas de vidro temperado.",
      address: {
        street: "Avenida Venâncio Flores",
        number: "530",
        neighborhood: "Centro",
        city: "Aracruz",
        state: "ES",
        zipCode: "29190010",
      },
      phone: "27998060603",
      hours: COMMERCIAL,
    },
  ],
  Educação: [
    {
      name: "Colégio Saber Capixaba",
      description: "Ensino infantil, fundamental e médio em período integral.",
      address: {
        street: "Avenida Fernando Ferrari",
        number: "1080",
        neighborhood: "Mata da Praia",
        city: "Vitória",
        state: "ES",
        zipCode: "29066380",
      },
      phone: "27998070701",
      hours: schedule(WEEKDAYS, "07:00", "18:00"),
      isHighlighted: true,
    },
    {
      name: "Escola de Idiomas Conecta",
      description: "Inglês e espanhol para crianças, adolescentes e adultos.",
      address: {
        street: "Avenida Hugo Musso",
        number: "1200",
        complement: "Sala 105",
        neighborhood: "Praia da Costa",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29101280",
      },
      phone: "27998070702",
      hours: schedule(WEEKDAYS, "08:00", "21:00"),
    },
    {
      name: "Curso Preparatório Foco ENEM",
      description: "Pré-vestibular e reforço escolar com turmas reduzidas.",
      address: {
        street: "Rua Coronel Constantino Cunha",
        number: "1450",
        neighborhood: "Centro",
        city: "São Mateus",
        state: "ES",
        zipCode: "29930010",
      },
      phone: "27998070703",
      hours: schedule(WEEKDAYS, "13:00", "22:00"),
    },
  ],
  "Serviços profissionais": [
    {
      name: "Contabilidade Exata",
      description:
        "Abertura de empresas, MEI, imposto de renda e folha de pagamento.",
      address: {
        street: "Avenida Princesa Isabel",
        number: "629",
        complement: "Sala 1204",
        neighborhood: "Centro",
        city: "Vitória",
        state: "ES",
        zipCode: "29010360",
      },
      phone: "27998080801",
      hours: schedule(WEEKDAYS, "08:00", "18:00"),
      isHighlighted: true,
    },
    {
      name: "Advocacia Moreira & Associados",
      description: "Direito trabalhista, cível e do consumidor.",
      address: {
        street: "Rua Sete de Setembro",
        number: "362",
        complement: "Sala 401",
        neighborhood: "Centro",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29100300",
      },
      phone: "27998080802",
      hours: schedule(WEEKDAYS, "09:00", "18:00"),
    },
    {
      name: "Gráfica Rápida Impressão",
      description: "Cartões de visita, banners, adesivos e impressão digital.",
      address: {
        street: "Avenida Mestre Álvaro",
        number: "780",
        neighborhood: "Jardim Limoeiro",
        city: "Serra",
        state: "ES",
        zipCode: "29164153",
      },
      phone: "27998080803",
      hours: COMMERCIAL,
    },
  ],
  Pets: [
    {
      name: "Clínica Veterinária Amigo Fiel",
      description: "Consultas, vacinação, cirurgias e atendimento 24 horas.",
      address: {
        street: "Avenida Leitão da Silva",
        number: "1900",
        neighborhood: "Itararé",
        city: "Vitória",
        state: "ES",
        zipCode: "29047595",
      },
      phone: "27998090901",
      hours: schedule([0, 1, 2, 3, 4, 5, 6], "00:00", "23:59"),
      isHighlighted: true,
    },
    {
      name: "Pet Shop Patas e Penas",
      description: "Ração, acessórios, banho e tosa com leva e traz.",
      address: {
        street: "Avenida Jerônimo Monteiro",
        number: "1010",
        neighborhood: "Glória",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29122010",
      },
      phone: "27998090902",
      hours: STORE,
    },
    {
      name: "Hotelzinho Cão Feliz",
      description:
        "Hospedagem e creche para cães com área verde e monitoramento.",
      address: {
        street: "Rua Projetada",
        number: "45",
        neighborhood: "Muquiçaba",
        city: "Guarapari",
        state: "ES",
        zipCode: "29215090",
      },
      phone: "27998090903",
      hours: schedule([0, 1, 2, 3, 4, 5, 6], "07:00", "19:00"),
    },
  ],
  "Turismo e hospedagem": [
    {
      name: "Pousada Recanto das Ondas",
      description: "Pousada pé na areia com café da manhã capixaba incluso.",
      address: {
        street: "Rua Joaquim da Silva Lima",
        number: "300",
        neighborhood: "Praia do Morro",
        city: "Guarapari",
        state: "ES",
        zipCode: "29216010",
      },
      phone: "27998101001",
      hours: schedule([0, 1, 2, 3, 4, 5, 6], "00:00", "23:59"),
      isHighlighted: true,
    },
    {
      name: "Hotel Convento Vista Mar",
      description:
        "Hotel com vista para o Convento da Penha e piscina na cobertura.",
      address: {
        street: "Avenida Antônio Gil Veloso",
        number: "1500",
        neighborhood: "Praia da Costa",
        city: "Vila Velha",
        state: "ES",
        zipCode: "29101010",
      },
      phone: "27998101002",
      hours: schedule([0, 1, 2, 3, 4, 5, 6], "00:00", "23:59"),
    },
    {
      name: "Montanhas Capixabas Turismo",
      description:
        "Passeios guiados pela região serrana, rota do agroturismo e cachoeiras.",
      address: {
        street: "Avenida Presidente Vargas",
        number: "600",
        neighborhood: "Centro",
        city: "Linhares",
        state: "ES",
        zipCode: "29900040",
      },
      phone: "27998101003",
      hours: COMMERCIAL,
    },
  ],
};

export async function seedCompanies() {
  const categories = await prisma.category.findMany({
    where: { name: { in: Object.keys(companiesByCategory) } },
  });
  const categoryIds = new Map(categories.map(({ name, id }) => [name, id]));

  for (const [categoryName, companies] of Object.entries(companiesByCategory)) {
    const categoryId = categoryIds.get(categoryName);

    if (!categoryId) {
      throw new Error(
        `Categoria "${categoryName}" não encontrada. Rode seedCategories() antes.`,
      );
    }

    for (const company of companies) {
      const contacts = buildContacts(company);
      const hours = fullWeek(company.hours);
      const fields = {
        description: company.description,
        address: company.address,
        isHighlighted: company.isHighlighted ?? false,
        categoryId,
      };

      // Rodar a seed de novo recria contatos e horários em vez de duplicar.
      // O slug só é definido na criação: ele não muda depois (links continuam valendo).
      await prisma.company.upsert({
        where: { name: company.name },
        update: {
          ...fields,
          contacts: { deleteMany: {}, create: contacts },
          hours: { deleteMany: {}, create: hours },
        },
        create: {
          name: company.name,
          slug: slugify(company.name),
          ...fields,
          contacts: { create: contacts },
          hours: { create: hours },
        },
      });
    }

    console.log(`✔ ${categoryName}: ${companies.length} empresas`);
  }
}
