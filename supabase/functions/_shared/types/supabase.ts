export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      catmap: {
        Row: {
          from: string
          to: string
        }
        Insert: {
          from: string
          to: string
        }
        Update: {
          from?: string
          to?: string
        }
      }
      events: {
        Row: {
          level: string | null
          tag: string | null
          message: string | null
          data: Json | null
          env: string | null
          created_at: string | null
          id: number
        }
        Insert: {
          level?: string | null
          tag?: string | null
          message?: string | null
          data?: Json | null
          env?: string | null
          created_at?: string | null
          id?: number
        }
        Update: {
          level?: string | null
          tag?: string | null
          message?: string | null
          data?: Json | null
          env?: string | null
          created_at?: string | null
          id?: number
        }
      }
      legacyMembers: {
        Row: {
          UserId: number | null
          registration_email: string | null
          name: string | null
          phone: string | null
          address: string | null
          discount: number | null
          discount_type: string | null
          member_type: string | null
          fees_paid: number | null
          store_credit: number | null
          shares: number | null
          data: Json | null
          createdAt: string
          updatedAt: string
          id: number
        }
        Insert: {
          UserId?: number | null
          registration_email?: string | null
          name?: string | null
          phone?: string | null
          address?: string | null
          discount?: number | null
          discount_type?: string | null
          member_type?: string | null
          fees_paid?: number | null
          store_credit?: number | null
          shares?: number | null
          data?: Json | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
        Update: {
          UserId?: number | null
          registration_email?: string | null
          name?: string | null
          phone?: string | null
          address?: string | null
          discount?: number | null
          discount_type?: string | null
          member_type?: string | null
          fees_paid?: number | null
          store_credit?: number | null
          shares?: number | null
          data?: Json | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
      }
      legacyOrderLineItems: {
        Row: {
          OrderId: number | null
          WholesaleOrderId: number | null
          price: number | null
          quantity: number | null
          total: number | null
          kind: string | null
          description: string | null
          vendor: string | null
          selected_unit: string | null
          data: Json | null
          status: string | null
          createdAt: string
          updatedAt: string
          id: number
        }
        Insert: {
          OrderId?: number | null
          WholesaleOrderId?: number | null
          price?: number | null
          quantity?: number | null
          total?: number | null
          kind?: string | null
          description?: string | null
          vendor?: string | null
          selected_unit?: string | null
          data?: Json | null
          status?: string | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
        Update: {
          OrderId?: number | null
          WholesaleOrderId?: number | null
          price?: number | null
          quantity?: number | null
          total?: number | null
          kind?: string | null
          description?: string | null
          vendor?: string | null
          selected_unit?: string | null
          data?: Json | null
          status?: string | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
      }
      legacyOrders: {
        Row: {
          UserId: number | null
          status: string | null
          payment_status: string | null
          shipment_status: string | null
          name: string
          email: string
          phone: string | null
          address: string | null
          notes: string | null
          email_sent: boolean | null
          history: Json | null
          MemberId: number | null
          total: number | null
          subtotal: number | null
          item_count: number | null
          createdAt: string
          updatedAt: string
          id: number
        }
        Insert: {
          UserId?: number | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          name: string
          email: string
          phone?: string | null
          address?: string | null
          notes?: string | null
          email_sent?: boolean | null
          history?: Json | null
          MemberId?: number | null
          total?: number | null
          subtotal?: number | null
          item_count?: number | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
        Update: {
          UserId?: number | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          notes?: string | null
          email_sent?: boolean | null
          history?: Json | null
          MemberId?: number | null
          total?: number | null
          subtotal?: number | null
          item_count?: number | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
      }
      legacyPages: {
        Row: {
          slug: string | null
          content: string | null
          createdAt: string
          updatedAt: string
          id: number
        }
        Insert: {
          slug?: string | null
          content?: string | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
        Update: {
          slug?: string | null
          content?: string | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
      }
      legacyProducts: {
        Row: {
          unf: string | null
          upc_code: string | null
          category: string | null
          sub_category: string | null
          name: string | null
          description: string | null
          pk: number | null
          size: string | null
          unit_type: string | null
          ws_price: number | null
          u_price: number | null
          ws_price_cost: number | null
          u_price_cost: number | null
          codes: string | null
          vendor: string | null
          import_tag: string | null
          count_on_hand: number | null
          no_backorder: boolean | null
          createdAt: string
          updatedAt: string
          id: number
        }
        Insert: {
          unf?: string | null
          upc_code?: string | null
          category?: string | null
          sub_category?: string | null
          name?: string | null
          description?: string | null
          pk?: number | null
          size?: string | null
          unit_type?: string | null
          ws_price?: number | null
          u_price?: number | null
          ws_price_cost?: number | null
          u_price_cost?: number | null
          codes?: string | null
          vendor?: string | null
          import_tag?: string | null
          count_on_hand?: number | null
          no_backorder?: boolean | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
        Update: {
          unf?: string | null
          upc_code?: string | null
          category?: string | null
          sub_category?: string | null
          name?: string | null
          description?: string | null
          pk?: number | null
          size?: string | null
          unit_type?: string | null
          ws_price?: number | null
          u_price?: number | null
          ws_price_cost?: number | null
          u_price_cost?: number | null
          codes?: string | null
          vendor?: string | null
          import_tag?: string | null
          count_on_hand?: number | null
          no_backorder?: boolean | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
      }
      legacyWholesaleOrders: {
        Row: {
          vendor: string | null
          notes: string | null
          status: string | null
          payment_status: string | null
          shipment_status: string | null
          createdAt: string
          updatedAt: string
          id: number
        }
        Insert: {
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
        Update: {
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          createdAt?: string
          updatedAt?: string
          id?: number
        }
      }
      Members: {
        Row: {
          UserId: string | null
          registration_email: string | null
          name: string | null
          phone: string | null
          address: string | null
          discount: number | null
          discount_type: string | null
          fees_paid: number | null
          store_credit: number | null
          shares: number | null
          member_type: string | null
          data: Json | null
          createdAt: string | null
          updatedAt: string | null
          is_admin: boolean
          id: number
        }
        Insert: {
          UserId?: string | null
          registration_email?: string | null
          name?: string | null
          phone?: string | null
          address?: string | null
          discount?: number | null
          discount_type?: string | null
          fees_paid?: number | null
          store_credit?: number | null
          shares?: number | null
          member_type?: string | null
          data?: Json | null
          createdAt?: string | null
          updatedAt?: string | null
          is_admin?: boolean
          id?: number
        }
        Update: {
          UserId?: string | null
          registration_email?: string | null
          name?: string | null
          phone?: string | null
          address?: string | null
          discount?: number | null
          discount_type?: string | null
          fees_paid?: number | null
          store_credit?: number | null
          shares?: number | null
          member_type?: string | null
          data?: Json | null
          createdAt?: string | null
          updatedAt?: string | null
          is_admin?: boolean
          id?: number
        }
      }
      OrderLineItems: {
        Row: {
          OrderId: number | null
          WholesaleOrderId: number | null
          price: number | null
          quantity: number | null
          total: number | null
          kind: string | null
          description: string | null
          vendor: string | null
          selected_unit: string | null
          data: Json | null
          status: string | null
          invalid: string | null
          createdAt: string | null
          updatedAt: string | null
          id: number
        }
        Insert: {
          OrderId?: number | null
          WholesaleOrderId?: number | null
          price?: number | null
          quantity?: number | null
          total?: number | null
          kind?: string | null
          description?: string | null
          vendor?: string | null
          selected_unit?: string | null
          data?: Json | null
          status?: string | null
          invalid?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          id?: number
        }
        Update: {
          OrderId?: number | null
          WholesaleOrderId?: number | null
          price?: number | null
          quantity?: number | null
          total?: number | null
          kind?: string | null
          description?: string | null
          vendor?: string | null
          selected_unit?: string | null
          data?: Json | null
          status?: string | null
          invalid?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          id?: number
        }
      }
      Orders: {
        Row: {
          UserId: string | null
          status: string | null
          payment_status: string | null
          shipment_status: string | null
          total: number | null
          subtotal: number | null
          name: string | null
          email: string | null
          phone: string | null
          address: string | null
          notes: string | null
          email_sent: boolean | null
          item_count: number | null
          history: Json | null
          MemberId: number | null
          createdAt: string | null
          updatedAt: string | null
          api_key: string | null
          id: number
        }
        Insert: {
          UserId?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          total?: number | null
          subtotal?: number | null
          name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          email_sent?: boolean | null
          item_count?: number | null
          history?: Json | null
          MemberId?: number | null
          createdAt?: string | null
          updatedAt?: string | null
          api_key?: string | null
          id?: number
        }
        Update: {
          UserId?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          total?: number | null
          subtotal?: number | null
          name?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          notes?: string | null
          email_sent?: boolean | null
          item_count?: number | null
          history?: Json | null
          MemberId?: number | null
          createdAt?: string | null
          updatedAt?: string | null
          api_key?: string | null
          id?: number
        }
      }
      products: {
        Row: {
          unf: string | null
          upc_code: string | null
          category: string | null
          sub_category: string | null
          name: string | null
          pk: number | null
          size: string | null
          unit_type: string | null
          ws_price: number | null
          u_price: number | null
          ws_price_cost: number | null
          u_price_cost: number | null
          codes: string | null
          vendor: string | null
          import_tag: string | null
          count_on_hand: number | null
          no_backorder: boolean | null
          plu: string | null
          id: string
          description_orig: string | null
          description_edit: string | null
          sq_variation_id: string | null
          createdAt: string | null
          updatedAt: string | null
          description: string | null
          featured: boolean | null
        }
        Insert: {
          unf?: string | null
          upc_code?: string | null
          category?: string | null
          sub_category?: string | null
          name?: string | null
          pk?: number | null
          size?: string | null
          unit_type?: string | null
          ws_price?: number | null
          u_price?: number | null
          ws_price_cost?: number | null
          u_price_cost?: number | null
          codes?: string | null
          vendor?: string | null
          import_tag?: string | null
          count_on_hand?: number | null
          no_backorder?: boolean | null
          plu?: string | null
          id: string
          description_orig?: string | null
          description_edit?: string | null
          sq_variation_id?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          description?: string | null
          featured?: boolean | null
        }
        Update: {
          unf?: string | null
          upc_code?: string | null
          category?: string | null
          sub_category?: string | null
          name?: string | null
          pk?: number | null
          size?: string | null
          unit_type?: string | null
          ws_price?: number | null
          u_price?: number | null
          ws_price_cost?: number | null
          u_price_cost?: number | null
          codes?: string | null
          vendor?: string | null
          import_tag?: string | null
          count_on_hand?: number | null
          no_backorder?: boolean | null
          plu?: string | null
          id?: string
          description_orig?: string | null
          description_edit?: string | null
          sq_variation_id?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          description?: string | null
          featured?: boolean | null
        }
      }
      WholesaleOrders: {
        Row: {
          vendor: string | null
          notes: string | null
          status: string | null
          payment_status: string | null
          shipment_status: string | null
          calc_adjustments: boolean | null
          square_status: string | null
          square_loaded_at: string | null
          data: Json | null
          createdAt: string | null
          updatedAt: string | null
          api_key: string
          id: number
        }
        Insert: {
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          calc_adjustments?: boolean | null
          square_status?: string | null
          square_loaded_at?: string | null
          data?: Json | null
          createdAt?: string | null
          updatedAt?: string | null
          api_key?: string
          id?: number
        }
        Update: {
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          calc_adjustments?: boolean | null
          square_status?: string | null
          square_loaded_at?: string | null
          data?: Json | null
          createdAt?: string | null
          updatedAt?: string | null
          api_key?: string
          id?: number
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      default_products: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      distinct_product_categories: {
        Args: Record<PropertyKey, never>
        Returns: { category: string }[]
      }
      distinct_product_import_tags: {
        Args: Record<PropertyKey, never>
        Returns: { import_tag: string }[]
      }
      distinct_product_sub_categories: {
        Args: { category: string }
        Returns: { category: string }[]
      }
      distinct_product_vendors: {
        Args: Record<PropertyKey, never>
        Returns: { vendor: string }[]
      }
      recent_orders: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

