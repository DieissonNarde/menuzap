export type SubscriptionPlanId = "mensal" | "semestral" | "anual";

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  title: string;
  price: number;
  description: readonly string[];
  popular?: boolean;
}

export const SUBSCRIPTION_PLANS: readonly SubscriptionPlan[] = [
  {
    id: "mensal",
    title: "Mensal",
    price: 55,
    description: ["Assinatura de 30 dias", "Pedidos Ilimitados", "Itens Ilimitados", "Fotos nos Itens", "Adicione Logo Marca", "Adicione Plano de Fundo", "Página de Contato", "Imagens nos Itens", "Cupom de Desconto"],
  },
  {
    id: "semestral",
    title: "Semestral",
    price: 280,
    popular: true,
    description: ["Assinatura de 6 meses", "Pedidos Ilimitados", "Itens Ilimitados", "Fotos nos Itens", "Adicione Logo Marca", "Adicione Plano de Fundo", "Página de Contato", "Imagens nos Itens", "Cupom de Desconto"],
  },
  {
    id: "anual",
    title: "Anual",
    price: 480,
    description: ["Assinatura de 12 meses", "Pedidos Ilimitados", "Itens Ilimitados", "Fotos nos Itens", "Adicione Logo Marca", "Adicione Plano de Fundo", "Página de Contato", "Imagens nos Itens", "Cupom de Desconto"],
  },
];

export function getSubscriptionPlan(id: string | null | undefined): SubscriptionPlan {
  return SUBSCRIPTION_PLANS.find((plan) => plan.id === id) ?? SUBSCRIPTION_PLANS[0];
}
