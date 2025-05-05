
export type ClientStatus = 'active' | 'inactive' | 'lead';

export interface ClientContact {
  type: 'phone' | 'email' | 'other';
  value: string;
  primary?: boolean;
}

export interface ClientAddress {
  street: string;
  city: string;
  state?: string;
  zip: string;
  country: string;
  isMain?: boolean;
}

export interface Client {
  id: string;
  companyName: string;
  contactPerson: string;
  contacts: ClientContact[];
  addresses: ClientAddress[];
  status: ClientStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  lastOrderDate?: string;
  totalOrders?: number;
  totalSpent?: number;
}

export interface ClientCreateDto {
  companyName: string;
  contactPerson: string;
  contacts: ClientContact[];
  addresses: ClientAddress[];
  status: ClientStatus;
  notes?: string;
}

export interface ClientUpdateDto {
  companyName?: string;
  contactPerson?: string;
  contacts?: ClientContact[];
  addresses?: ClientAddress[];
  status?: ClientStatus;
  notes?: string;
}
