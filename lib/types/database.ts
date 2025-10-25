export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          phone_number: string | null
          avatar_url: string | null
          bio: string | null
          location: string | null
          user_type: 'tenant' | 'landlord' | 'agent' | 'both'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          user_type?: 'tenant' | 'landlord' | 'agent' | 'both'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone_number?: string | null
          avatar_url?: string | null
          bio?: string | null
          location?: string | null
          user_type?: 'tenant' | 'landlord' | 'agent' | 'both'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      properties: {
        Row: {
          id: string
          owner_id: string
          title: string
          description: string
          property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'townhouse' | 'villa' | 'studio'
          deal_type: 'sale' | 'rent' | 'lease'
          price: number
          currency: string
          price_period: string | null
          bedrooms: number
          bathrooms: number
          kitchen_areas: number
          square_feet: number | null
          square_meters: number | null
          address: string
          city: string
          region: string
          county: string
          country: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          status: 'draft' | 'available' | 'rented' | 'sold' | 'pending' | 'inactive'
          is_featured: boolean
          is_verified: boolean
          views_count: number
          favorites_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          title: string
          description: string
          property_type: 'house' | 'apartment' | 'land' | 'commercial' | 'townhouse' | 'villa' | 'studio'
          deal_type: 'sale' | 'rent' | 'lease'
          price: number
          currency?: string
          price_period?: string | null
          bedrooms?: number
          bathrooms?: number
          kitchen_areas?: number
          square_feet?: number | null
          square_meters?: number | null
          address: string
          city: string
          region: string
          county: string
          country?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: 'draft' | 'available' | 'rented' | 'sold' | 'pending' | 'inactive'
          is_featured?: boolean
          is_verified?: boolean
          views_count?: number
          favorites_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          description?: string
          property_type?: 'house' | 'apartment' | 'land' | 'commercial' | 'townhouse' | 'villa' | 'studio'
          deal_type?: 'sale' | 'rent' | 'lease'
          price?: number
          currency?: string
          price_period?: string | null
          bedrooms?: number
          bathrooms?: number
          kitchen_areas?: number
          square_feet?: number | null
          square_meters?: number | null
          address?: string
          city?: string
          region?: string
          county?: string
          country?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          status?: 'draft' | 'available' | 'rented' | 'sold' | 'pending' | 'inactive'
          is_featured?: boolean
          is_verified?: boolean
          views_count?: number
          favorites_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      property_images: {
        Row: {
          id: string
          property_id: string
          image_url: string
          thumbnail_url: string | null
          caption: string | null
          is_primary: boolean
          display_order: number
          created_at: string
          // Admin review fields
          admin_approved: boolean | null
          admin_reviewed_at: string | null
          admin_reviewed_by: string | null
          admin_rejection_reason: string | null
        }
        Insert: {
          id?: string
          property_id: string
          image_url: string
          thumbnail_url?: string | null
          caption?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
          admin_approved?: boolean | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_rejection_reason?: string | null
        }
        Update: {
          id?: string
          property_id?: string
          image_url?: string
          thumbnail_url?: string | null
          caption?: string | null
          is_primary?: boolean
          display_order?: number
          created_at?: string
          admin_approved?: boolean | null
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string | null
          admin_rejection_reason?: string | null
        }
      }
    }
  }
}

export type PropertyImage = Database['public']['Tables']['property_images']['Row']
export type Property = Database['public']['Tables']['properties']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
