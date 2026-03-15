import { supabase } from './supabase';
import type { Product, Category, Order, OrderItem } from './database.types';

export const api = {
  categories: {
    getAll: async (): Promise<Category[]> => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      return data || [];
    },
  },

  products: {
    getAll: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    getById: async (id: string): Promise<Product | null> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    getByCategory: async (categoryId: string): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    getByCategoryName: async (categoryName: string): Promise<Product[]> => {
      const { data: category, error: categoryError } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', categoryName)
        .maybeSingle();

      if (categoryError) throw categoryError;
      if (!category) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category_id', category.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    getFeatured: async (): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) throw error;
      return data || [];
    },

    create: async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .insert(product)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    update: async (id: string, updates: Partial<Product>): Promise<Product> => {
      const { data, error } = await supabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    delete: async (id: string): Promise<void> => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },

    search: async (query: string): Promise<Product[]> => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${query}%`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
  },

  orders: {
    getAll: async (): Promise<Order[]> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },

    getById: async (id: string): Promise<Order | null> => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },

    create: async (order: Omit<Order, 'id' | 'created_at'>): Promise<Order> => {
      const { data, error } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();

      if (error) throw error;
      return data;
    },

    updateStatus: async (id: string, status: string): Promise<Order> => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  },

  orderItems: {
    getByOrderId: async (orderId: string): Promise<OrderItem[]> => {
      const { data, error } = await supabase
        .from('order_items')
        .select('*')
        .eq('order_id', orderId);

      if (error) throw error;
      return data || [];
    },

    create: async (items: Omit<OrderItem, 'id' | 'created_at'>[]): Promise<OrderItem[]> => {
      const { data, error } = await supabase
        .from('order_items')
        .insert(items)
        .select();

      if (error) throw error;
      return data || [];
    },
  },
};
