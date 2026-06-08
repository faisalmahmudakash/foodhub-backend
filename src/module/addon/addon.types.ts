export interface addonCreateInput {
  productId: string;
  addonName: string;
  price: number;
}

export interface addonDelete {
  productId: string;
  addonId: string;
}

export interface addonUpdate {
  addonId: string;
  addonName: string;
  price: number;
}
