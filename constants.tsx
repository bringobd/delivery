
import { Restaurant, MenuCategory, OrderStatus } from './types';

export const RESTAURANTS: Restaurant[] = [
  { id: 'svoboda', n: 'СВОБОДА', img: 'https://lh3.googleusercontent.com/p/AF1QipPsLzVNvrFrEtqQtTJv1OrBp0nDjO7djl6A46EO=w408-h271-k-no', rating: 4.7, time: '30-40', delivery: 50, categories: ['Європейська', 'Бар'] },
  { id: 'smoke-time', n: 'Smoke Time', img: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAwerNL5r5DmZ1MC3m_c-22GI95NZ-gW_036mIdMhOs9SaIIoLdfsKsKQmD9G1XSOCrRDPksoeav7ATB6LKc0zmMsoiMkCfKAIvK0E2j-F7Aq5csN5FHfQib7RekCuFW0sdU765T5UiK4iX_0O=w408-h544-k-no', rating: 4.5, time: '25-35', delivery: 50, categories: ['Кальян', 'Бургери'] },
  { id: 'food-house', n: 'Food house', img: 'https://lh3.googleusercontent.com/p/AF1QipMROLILFzLckulWfZJxirh0kQaEHRxqYUIRLyQL=w408-h408-k-no', rating: 4.6, time: '20-30', delivery: 50, categories: ['Фастфуд', 'Піца'] },
  { id: 'maestro', n: 'МАЭСТРО', img: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAwer7zoR2kbht6bkSZJLZctjnDdWupbkRKmODGHyz9xSRMEuxJa53xCRP3AmivXaspetZclRfkwyIRgzg4jncA-kGRXmtnKVyk1OYN4x4ydSJjt43c13hR1xQwc6XraNHJe_v7KAV=w408-h306-k-no', rating: 4.8, time: '25-40', delivery: 50, categories: ['Піца', 'Суші', 'Мангал'] },
  { id: 'mama-mia', n: 'Mama Mia', img: 'https://lh3.googleusercontent.com/p/AF1QipN7D_iLbUOW5TFybEIzwnIcFZT_5B0usif9h4b-=w426-h240-k-no', rating: 4.4, time: '30-45', delivery: 50, categories: ['Італійська', 'Паста'] },
  { id: 'dakh', n: 'ДАХ АККЕРМАН', img: 'https://lh3.googleusercontent.com/p/AF1QipOMlCR2AA_IJY8CoNUeEZQGNlWCa88dHEq2qorO=w408-h612-k-no', rating: 4.9, time: '40-55', delivery: 50, categories: ['Ресторан', 'Вишукано'] },
  { id: 'maestro-peremoga', n: 'Маестро (Перемога)', img: 'https://lh3.googleusercontent.com/p/AF1QipOIirOKsjsCJgNiePNF0x9szxYM4-OKM03j9O30=w408-h544-k-no', rating: 4.7, time: '25-35', delivery: 50, categories: ['Піца', 'Сніданки'] },
  { id: 'la-mila', n: 'Піцерія La Mila', img: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAweqi_BAjEb2fX0RyWvcbfJCrNdkvU3Ut2vWN2lu2lPt1rrm7FsqMPpApMYm2Or7g9sOjen0MfJiSRIKoYgvggX-JtvWgytqRbqGcTVLutrrmfDZaPm-0crTrA-7LKoVS2Ca0nLuVghtB_2A=w408-h544-k-no', rating: 4.6, time: '20-30', delivery: 50, categories: ['Піца', 'Десерти'] },
  { id: 'dionis', n: 'Dionis Cafe', img: 'https://lh3.googleusercontent.com/gps-cs-s/AHVAwerJ_X25P3yp0sGuNWXGeIUHITX9K3oRxTb9r_Zat-nodqRHw0adqGkSljiNu5omqIp0mlqbq5PJDk06oO3V91lB2iGtYm47tbbjpi9wWHic1ullkXSCjy17-S_qzZmJFLNK43RuExO9QjO7=w408-h572-k-no', rating: 4.3, time: '30-40', delivery: 50, categories: ['Кафе', 'Домашня'] },
  { id: 'taverna-lucky', n: 'Taverna Lucky', img: 'https://lh3.googleusercontent.com/p/AF1QipOFuwJXe0xNFUcw0mn1aIaD1M-82MAbSmw12d4=w408-h306-k-no', rating: 4.5, time: '35-50', delivery: 50, categories: ['Гриль', 'Закуски'] }
];

export const MENU: MenuCategory[] = [
  {
    cat: 'Піца',
    items: [
      {
        id: 'p1',
        n: 'Піца 4 Сира',
        d: 'Сулугуні, моцарела, пармезан, голандський, вершковий соус',
        img: 'https://img.postershop.me/cdn-cgi/image/width=1024,format=webp/https://img.postershop.me/25896/caa50bb6-eb4d-4fa4-a876-5dcaf79dfaa2_image.png',
        basePrice: 240,
        groups: [
          {
            label: 'Розмір',
            sub: 'Виберіть один варіант',
            type: 'radio',
            required: true,
            isFull: true,
            options: [
              { n: '4 сиру 32 см', p: 240 },
              { n: '4 сиру 50 см', p: 380 }
            ]
          },
          {
            label: 'Додатково',
            sub: 'Можна вибрати декілька',
            type: 'check',
            options: [
              { n: 'Філе куряче копчене', p: 50 },
              { n: 'Ковбаски до піцци', p: 30 },
              { n: 'Ковбаса Папероні', p: 90 },
              { n: 'Помідор', p: 30 },
              { n: 'Сир піца', p: 60 },
              { n: 'Сир Голандський', p: 40 },
              { n: 'Сир Пармезан', p: 60 },
              { n: 'Ананас консерв.', p: 30 }
            ]
          }
        ]
      },
      {
        id: 'p2',
        n: 'Піца Белісімо',
        d: 'Копчене куряче філе, ананас, гриби, маслини, сулугуні, моцарела, вершковий соус',
        img: 'https://img.postershop.me/cdn-cgi/image/width=1024,format=webp/https://img.postershop.me/25896/88f8a3f5-5f19-4635-8311-d54c046273f1_image.png',
        basePrice: 250,
        groups: [
          {
            label: 'Розмір',
            sub: 'Виберіть один варіант',
            type: 'radio',
            required: true,
            isFull: true,
            options: [
              { n: 'Белісімо 32 см', p: 250 },
              { n: 'Белісімо 50 см', p: 360 }
            ]
          },
          {
            label: 'Додатково',
            sub: 'Можна вибрати декілька',
            type: 'check',
            options: [
              { n: 'Сир піца', p: 50 },
              { n: 'Філе куряче копчене', p: 40 },
              { n: 'Ковбаски до піцци', p: 20 },
              { n: 'Ананас консерв.', p: 20 },
              { n: 'Бекон', p: 60 }
            ]
          }
        ]
      }
    ]
  }
];

export const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; icon: string }> = {
  new: { label: 'Нове замовлення', color: '#FF5C00', icon: '🆕' },
  accepted: { label: 'Прийнято рестораном', color: '#FF5C00', icon: '✅' },
  cooking: { label: 'Готується', color: '#F59E0B', icon: '👨‍🍳' },
  delayed: { label: 'Затримка приготування', color: '#F59E0B', icon: '⏳' },
  ready: { label: 'Готово! Чекає курʼєра', color: '#22C55E', icon: '🍽' },
  picked: { label: 'Курʼєр вже в дорозі до вас', color: '#3B82F6', icon: '🛵' },
  done: { label: 'Доставлено!', color: '#22C55E', icon: '🎉' },
  cancelled: { label: 'Скасовано', color: '#EF4444', icon: '❌' }
};

export const STEPS: OrderStatus[] = ['new', 'accepted', 'cooking', 'ready', 'picked', 'done'];
