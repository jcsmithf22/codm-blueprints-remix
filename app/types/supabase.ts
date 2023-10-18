export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      attachment_names: {
        Row: {
          id: number
          name: string
          type: string
        }
        Insert: {
          id?: number
          name: string
          type: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
        }
        Relationships: []
      }
      attachments: {
        Row: {
          characteristics: Json
          id: number
          model: number
          type: number
        }
        Insert: {
          characteristics: Json
          id?: number
          model: number
          type: number
        }
        Update: {
          characteristics?: Json
          id?: number
          model?: number
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "attachments_model_fkey"
            columns: ["model"]
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attachments_type_fkey"
            columns: ["type"]
            referencedRelation: "attachment_names"
            referencedColumns: ["id"]
          }
        ]
      }
      loadout_ratings: {
        Row: {
          id: string
          rating: number
        }
        Insert: {
          id: string
          rating?: number
        }
        Update: {
          id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "loadout_ratings_id_fkey"
            columns: ["id"]
            referencedRelation: "loadouts"
            referencedColumns: ["id"]
          }
        ]
      }
      loadouts: {
        Row: {
          barrel: number | null
          created_at: string
          grip: number | null
          id: string
          laser: number | null
          magazine: number | null
          model: number
          muzzle: number | null
          name: string
          optic: number | null
          perk: number | null
          stock: number | null
          tags: string | null
          underbarrel: number | null
          user: string
          username: string | null
        }
        Insert: {
          barrel?: number | null
          created_at?: string
          grip?: number | null
          id?: string
          laser?: number | null
          magazine?: number | null
          model?: number | null
          muzzle?: number | null
          name: string
          optic?: number | null
          perk?: number | null
          stock?: number | null
          tags?: string | null
          underbarrel?: number | null
          user?: string
          username?: string | null
        }
        Update: {
          barrel?: number | null
          created_at?: string
          grip?: number | null
          id?: string
          laser?: number | null
          magazine?: number | null
          model?: number | null
          muzzle?: number | null
          name?: string
          optic?: number | null
          perk?: number | null
          stock?: number | null
          tags?: string | null
          underbarrel?: number | null
          user?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "loadouts_barrel_fkey"
            columns: ["barrel"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_grip_fkey"
            columns: ["grip"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_laser_fkey"
            columns: ["laser"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_magazine_fkey"
            columns: ["magazine"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_model_fkey"
            columns: ["model"]
            referencedRelation: "models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_muzzle_fkey"
            columns: ["muzzle"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_optic_fkey"
            columns: ["optic"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_perk_fkey"
            columns: ["perk"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_stock_fkey"
            columns: ["stock"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_underbarrel_fkey"
            columns: ["underbarrel"]
            referencedRelation: "attachments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "loadouts_username_fkey"
            columns: ["username"]
            referencedRelation: "profiles"
            referencedColumns: ["username"]
          }
        ]
      }
      models: {
        Row: {
          id: number
          name: string
          type: string
        }
        Insert: {
          id?: number
          name: string
          type: string
        }
        Update: {
          id?: number
          name?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          email: string | null
          full_name: string | null
          id: string
          liked_posts: string | null
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          liked_posts?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          liked_posts?: string | null
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: string
      }
      get_claim: {
        Args: {
          uid: string
          claim: string
        }
        Returns: Json
      }
      get_claims: {
        Args: {
          uid: string
        }
        Returns: Json
      }
      get_my_claim: {
        Args: {
          claim: string
        }
        Returns: Json
      }
      get_my_claims: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      is_claims_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      set_claim: {
        Args: {
          uid: string
          claim: string
          value: Json
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
