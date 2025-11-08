import { z } from 'zod';

const allowedColors = [
  'AMARELO',
  'AZUL',
  'BRANCO',
  'CINZA',
  'DOURADO',
  'LARANJA',
  'MARROM',
  'PRATA',
  'PRETO',
  'ROSA',
  'ROXO',
  'VERDE',
  'VERMELHO',
];

const today = new Date();
const storeOpenDate = new Date('2020-03-20');
const currentYear = today.getFullYear();

const Car = z.object({
  brand: z
    .string()
    .trim()
    .min(1, { message: 'Marca deve ter ao menos 1 caractere.' })
    .max(25, { message: 'Marca deve ter no máximo 25 caracteres.' }),

  model: z
    .string()
    .trim()
    .min(1, { message: 'Modelo deve ter ao menos 1 caractere.' })
    .max(25, { message: 'Modelo deve ter no máximo 25 caracteres.' }),

  color: z.enum(allowedColors, { message: 'Cor inválida.' }),

  year_manufacture: z.preprocess(
    (v) => (typeof v === 'string' && v !== '' ? Number(v) : v),
    z
      .number({ required_error: 'Ano de fabricação é obrigatório.' })
      .int({ message: 'Ano de fabricação deve ser um número inteiro.' })
      .refine((y) => y >= 1960 && y <= currentYear, {
        message: `Ano deve ser entre 1960 e ${currentYear}.`,
      }),
  ),

  imported: z.boolean({ required_error: 'Campo imported deve ser booleano.' }),

  plates: z
    .string()
    .trim()
    .refine((p) => p.length === 8, { message: 'Placas devem ter exatamente 8 caracteres.' }),

  selling_date: z.coerce
    .date()
    .min(storeOpenDate, { message: 'Data de venda não pode ser anterior a 20/03/2020.' })
    .max(today, { message: 'Data de venda não pode ser futura.' })
    .nullish(),

  selling_price: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? undefined : Number(v)),
    z
      .number()
      .min(5000, { message: 'Preço deve ser no mínimo R$ 5.000,00.' })
      .max(5000000, { message: 'Preço deve ser no máximo R$ 5.000.000,00.' })
      .nullish(),
  ),

  customer_id: z.preprocess(
    (v) => (v === '' || v === null || v === undefined ? null : Number(v)),
    z.number().int().nullable().optional(),
  ),
});

export default Car;
