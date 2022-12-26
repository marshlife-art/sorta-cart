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
          id: number
          created_at: string | null
          level: string | null
          tag: string | null
          message: string | null
          data: Json | null
          env: string | null
        }
        Insert: {
          id?: number
          created_at?: string | null
          level?: string | null
          tag?: string | null
          message?: string | null
          data?: Json | null
          env?: string | null
        }
        Update: {
          id?: number
          created_at?: string | null
          level?: string | null
          tag?: string | null
          message?: string | null
          data?: Json | null
          env?: string | null
        }
      }
      legacyMembers: {
        Row: {
          id: number
          UserId: number | null
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
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          UserId?: number | null
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
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          UserId?: number | null
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
          createdAt?: string
          updatedAt?: string
        }
      }
      legacyOrderLineItems: {
        Row: {
          id: number
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
          createdAt: string
          updatedAt: string
          status: string | null
        }
        Insert: {
          id?: number
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
          createdAt?: string
          updatedAt?: string
          status?: string | null
        }
        Update: {
          id?: number
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
          createdAt?: string
          updatedAt?: string
          status?: string | null
        }
      }
      legacyOrders: {
        Row: {
          id: number
          UserId: number | null
          status: string | null
          payment_status: string | null
          shipment_status: string | null
          total: number | null
          subtotal: number | null
          name: string
          email: string
          phone: string | null
          address: string | null
          notes: string | null
          email_sent: boolean | null
          item_count: number | null
          history: Json | null
          createdAt: string
          updatedAt: string
          MemberId: number | null
        }
        Insert: {
          id?: number
          UserId?: number | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          total?: number | null
          subtotal?: number | null
          name: string
          email: string
          phone?: string | null
          address?: string | null
          notes?: string | null
          email_sent?: boolean | null
          item_count?: number | null
          history?: Json | null
          createdAt?: string
          updatedAt?: string
          MemberId?: number | null
        }
        Update: {
          id?: number
          UserId?: number | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          total?: number | null
          subtotal?: number | null
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          notes?: string | null
          email_sent?: boolean | null
          item_count?: number | null
          history?: Json | null
          createdAt?: string
          updatedAt?: string
          MemberId?: number | null
        }
      }
      legacyPages: {
        Row: {
          id: number
          slug: string | null
          content: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          slug?: string | null
          content?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          slug?: string | null
          content?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      legacyProducts: {
        Row: {
          id: number
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
          createdAt: string
          updatedAt: string
          count_on_hand: number | null
          no_backorder: boolean | null
        }
        Insert: {
          id?: number
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
          createdAt?: string
          updatedAt?: string
          count_on_hand?: number | null
          no_backorder?: boolean | null
        }
        Update: {
          id?: number
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
          createdAt?: string
          updatedAt?: string
          count_on_hand?: number | null
          no_backorder?: boolean | null
        }
      }
      legacyWholesaleOrders: {
        Row: {
          id: number
          vendor: string | null
          notes: string | null
          status: string | null
          payment_status: string | null
          shipment_status: string | null
          createdAt: string
          updatedAt: string
        }
        Insert: {
          id?: number
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          createdAt?: string
          updatedAt?: string
        }
        Update: {
          id?: number
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          createdAt?: string
          updatedAt?: string
        }
      }
      Members: {
        Row: {
          id: number
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
        }
        Insert: {
          id?: number
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
        }
        Update: {
          id?: number
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
        }
      }
      OrderLineItems: {
        Row: {
          id: number
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
          createdAt: string | null
          updatedAt: string | null
          status: string | null
          invalid: string | null
        }
        Insert: {
          id?: number
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
          createdAt?: string | null
          updatedAt?: string | null
          status?: string | null
          invalid?: string | null
        }
        Update: {
          id?: number
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
          createdAt?: string | null
          updatedAt?: string | null
          status?: string | null
          invalid?: string | null
        }
      }
      Orders: {
        Row: {
          id: number
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
          createdAt: string | null
          updatedAt: string | null
          MemberId: number | null
          api_key: string | null
        }
        Insert: {
          id?: number
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
          createdAt?: string | null
          updatedAt?: string | null
          MemberId?: number | null
          api_key?: string | null
        }
        Update: {
          id?: number
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
          createdAt?: string | null
          updatedAt?: string | null
          MemberId?: number | null
          api_key?: string | null
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
          createdAt: string | null
          updatedAt: string | null
          count_on_hand: number | null
          no_backorder: boolean | null
          plu: string | null
          id: string
          description_orig: string | null
          description_edit: string | null
          description: string | null
          featured: boolean | null
          sq_variation_id: string | null
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
          createdAt?: string | null
          updatedAt?: string | null
          count_on_hand?: number | null
          no_backorder?: boolean | null
          plu?: string | null
          id?: string
          description_orig?: string | null
          description_edit?: string | null
          description?: string | null
          featured?: boolean | null
          sq_variation_id?: string | null
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
          createdAt?: string | null
          updatedAt?: string | null
          count_on_hand?: number | null
          no_backorder?: boolean | null
          plu?: string | null
          id?: string
          description_orig?: string | null
          description_edit?: string | null
          description?: string | null
          featured?: boolean | null
          sq_variation_id?: string | null
        }
      }
      squareImport: {
        Row: {
          id: string
          createdAt: string | null
          data: Json | null
          status: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          createdAt?: string | null
          data?: Json | null
          status?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          createdAt?: string | null
          data?: Json | null
          status?: string | null
          notes?: string | null
        }
      }
      WholesaleOrders: {
        Row: {
          id: number
          vendor: string | null
          notes: string | null
          status: string | null
          payment_status: string | null
          shipment_status: string | null
          createdAt: string | null
          updatedAt: string | null
          calc_adjustments: boolean | null
          square_status: string | null
          square_loaded_at: string | null
          data: Json | null
          api_key: string
        }
        Insert: {
          id?: number
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          calc_adjustments?: boolean | null
          square_status?: string | null
          square_loaded_at?: string | null
          data?: Json | null
          api_key?: string
        }
        Update: {
          id?: number
          vendor?: string | null
          notes?: string | null
          status?: string | null
          payment_status?: string | null
          shipment_status?: string | null
          createdAt?: string | null
          updatedAt?: string | null
          calc_adjustments?: boolean | null
          square_status?: string | null
          square_loaded_at?: string | null
          data?: Json | null
          api_key?: string
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
