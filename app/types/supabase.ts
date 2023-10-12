export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      attachment_names: {
        Row: {
          id: number;
          name: string;
          type: string;
        };
        Insert: {
          id?: number;
          name: string;
          type: string;
        };
        Update: {
          id?: number;
          name?: string;
          type?: string;
        };
        Relationships: [];
      };
      attachments: {
        Row: {
          characteristics: Json;
          id: number;
          model: number;
          type: number;
        };
        Insert: {
          characteristics: Json;
          id?: number;
          model: number;
          type: number;
        };
        Update: {
          characteristics?: Json;
          id?: number;
          model?: number;
          type?: number;
        };
        Relationships: [
          {
            foreignKeyName: "attachments_model_fkey";
            columns: ["model"];
            referencedRelation: "models";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attachments_type_fkey";
            columns: ["type"];
            referencedRelation: "attachment_names";
            referencedColumns: ["id"];
          }
        ];
      };
      models: {
        Row: {
          id: number;
          name: string;
          type: string;
        };
        Insert: {
          id?: number;
          name: string;
          type: string;
        };
        Update: {
          id?: number;
          name?: string;
          type?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
