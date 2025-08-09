export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          failed_login_attempts: number | null
          id: string
          last_login: string | null
          locked_until: string | null
          password_hash: string
          reset_token: string | null
          reset_token_expires: string | null
          security_answer_hash: string | null
          security_question: string | null
          username: string
        }
        Insert: {
          created_at?: string
          failed_login_attempts?: number | null
          id?: string
          last_login?: string | null
          locked_until?: string | null
          password_hash: string
          reset_token?: string | null
          reset_token_expires?: string | null
          security_answer_hash?: string | null
          security_question?: string | null
          username: string
        }
        Update: {
          created_at?: string
          failed_login_attempts?: number | null
          id?: string
          last_login?: string | null
          locked_until?: string | null
          password_hash?: string
          reset_token?: string | null
          reset_token_expires?: string | null
          security_answer_hash?: string | null
          security_question?: string | null
          username?: string
        }
        Relationships: []
      }
      blog_drafts: {
        Row: {
          content: string
          created_at: string
          created_by: string
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean | null
          metadata: Json | null
          publish_date: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          content?: string
          created_at?: string
          created_by: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          publish_date?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean | null
          metadata?: Json | null
          publish_date?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          content: string
          created_at: string
          created_by: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          is_published: boolean
          modified_by: string | null
          publish_date: string
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          content: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          modified_by?: string | null
          publish_date?: string
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          content?: string
          created_at?: string
          created_by?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          is_published?: boolean
          modified_by?: string | null
          publish_date?: string
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      image_folders: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          parent_id: string | null
          path: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          path: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          path?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "image_folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "image_folders"
            referencedColumns: ["id"]
          },
        ]
      }
      image_metadata: {
        Row: {
          alt_text: string | null
          created_at: string
          description: string | null
          file_size: number | null
          folder_path: string | null
          height: number | null
          id: string
          is_featured: boolean | null
          last_used_at: string | null
          mime_type: string | null
          original_name: string
          storage_path: string
          tags: string[] | null
          updated_at: string
          uploaded_by: string | null
          usage_count: number | null
          width: number | null
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          folder_path?: string | null
          height?: number | null
          id?: string
          is_featured?: boolean | null
          last_used_at?: string | null
          mime_type?: string | null
          original_name: string
          storage_path: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string | null
          usage_count?: number | null
          width?: number | null
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          description?: string | null
          file_size?: number | null
          folder_path?: string | null
          height?: number | null
          id?: string
          is_featured?: boolean | null
          last_used_at?: string | null
          mime_type?: string | null
          original_name?: string
          storage_path?: string
          tags?: string[] | null
          updated_at?: string
          uploaded_by?: string | null
          usage_count?: number | null
          width?: number | null
        }
        Relationships: []
      }
      image_usage: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          image_id: string | null
          usage_context: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          image_id?: string | null
          usage_context?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          image_id?: string | null
          usage_context?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "image_usage_image_id_fkey"
            columns: ["image_id"]
            isOneToOne: false
            referencedRelation: "image_metadata"
            referencedColumns: ["id"]
          },
        ]
      }
      password_recovery_tokens: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          recovery_email: string
          token_hash: string
          used_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          recovery_email: string
          token_hash: string
          used_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          recovery_email?: string
          token_hash?: string
          used_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "password_recovery_tokens_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_recovery_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      sanitize_html_content: {
        Args: { content: string }
        Returns: string
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "viewer"],
    },
  },
} as const
