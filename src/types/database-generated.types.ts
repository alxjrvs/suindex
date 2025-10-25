export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.5'
  }
  public: {
    Tables: {
      crawlers: {
        Row: {
          bays: Json | null
          cargo: Json | null
          crawler_type_id: string | null
          created_at: string | null
          current_damage: number | null
          current_scrap: number | null
          description: string | null
          game_id: string | null
          id: string
          name: string
          notes: string | null
          npc: Json | null
          tech_level: number | null
          updated_at: string | null
          upgrade: number | null
          user_id: string
        }
        Insert: {
          bays?: Json | null
          cargo?: Json | null
          crawler_type_id?: string | null
          created_at?: string | null
          current_damage?: number | null
          current_scrap?: number | null
          description?: string | null
          game_id?: string | null
          id?: string
          name: string
          notes?: string | null
          npc?: Json | null
          tech_level?: number | null
          updated_at?: string | null
          upgrade?: number | null
          user_id: string
        }
        Update: {
          bays?: Json | null
          cargo?: Json | null
          crawler_type_id?: string | null
          created_at?: string | null
          current_damage?: number | null
          current_scrap?: number | null
          description?: string | null
          game_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          npc?: Json | null
          tech_level?: number | null
          updated_at?: string | null
          upgrade?: number | null
          user_id?: string
        }
        Relationships: []
      }
      external_links: {
        Row: {
          created_at: string | null
          game_id: string
          id: string
          name: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          game_id: string
          id?: string
          name: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          game_id?: string
          id?: string
          name?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      game_invites: {
        Row: {
          code: string
          created_at: string | null
          created_by: string
          expires_at: string | null
          game_id: string
          id: string
          max_uses: number | null
          uses: number | null
        }
        Insert: {
          code: string
          created_at?: string | null
          created_by: string
          expires_at?: string | null
          game_id: string
          id?: string
          max_uses?: number | null
          uses?: number | null
        }
        Update: {
          code?: string
          created_at?: string | null
          created_by?: string
          expires_at?: string | null
          game_id?: string
          id?: string
          max_uses?: number | null
          uses?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'game_invites_game_id_fkey'
            columns: ['game_id']
            isOneToOne: false
            referencedRelation: 'games'
            referencedColumns: ['id']
          },
        ]
      }
      game_members: {
        Row: {
          game_id: string
          id: string
          joined_at: string | null
          role: string
          user_id: string
        }
        Insert: {
          game_id: string
          id?: string
          joined_at?: string | null
          role: string
          user_id: string
        }
        Update: {
          game_id?: string
          id?: string
          joined_at?: string | null
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'game_members_game_id_fkey'
            columns: ['game_id']
            isOneToOne: false
            referencedRelation: 'games'
            referencedColumns: ['id']
          },
        ]
      }
      games: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      mechs: {
        Row: {
          appearance: string | null
          cargo: Json | null
          chassis_ability: string | null
          chassis_id: string | null
          created_at: string | null
          current_damage: number | null
          current_ep: number | null
          current_heat: number | null
          id: string
          modules: string[] | null
          notes: string | null
          pattern: string | null
          pilot_id: string | null
          quirk: string | null
          systems: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          appearance?: string | null
          cargo?: Json | null
          chassis_ability?: string | null
          chassis_id?: string | null
          created_at?: string | null
          current_damage?: number | null
          current_ep?: number | null
          current_heat?: number | null
          id?: string
          modules?: string[] | null
          notes?: string | null
          pattern?: string | null
          pilot_id?: string | null
          quirk?: string | null
          systems?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          appearance?: string | null
          cargo?: Json | null
          chassis_ability?: string | null
          chassis_id?: string | null
          created_at?: string | null
          current_damage?: number | null
          current_ep?: number | null
          current_heat?: number | null
          id?: string
          modules?: string[] | null
          notes?: string | null
          pattern?: string | null
          pilot_id?: string | null
          quirk?: string | null
          systems?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'mechs_pilot_id_fkey'
            columns: ['pilot_id']
            isOneToOne: true
            referencedRelation: 'pilots'
            referencedColumns: ['id']
          },
        ]
      }
      pilots: {
        Row: {
          abilities: string[] | null
          advanced_class_id: string | null
          appearance: string | null
          background: string | null
          background_used: boolean | null
          callsign: string
          class_id: string | null
          crawler_id: string | null
          created_at: string | null
          current_ap: number | null
          current_damage: number | null
          current_tp: number | null
          equipment: string[] | null
          id: string
          keepsake: string | null
          keepsake_used: boolean | null
          legendary_ability_id: string | null
          max_ap: number | null
          max_hp: number | null
          motto: string | null
          motto_used: boolean | null
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          abilities?: string[] | null
          advanced_class_id?: string | null
          appearance?: string | null
          background?: string | null
          background_used?: boolean | null
          callsign: string
          class_id?: string | null
          crawler_id?: string | null
          created_at?: string | null
          current_ap?: number | null
          current_damage?: number | null
          current_tp?: number | null
          equipment?: string[] | null
          id?: string
          keepsake?: string | null
          keepsake_used?: boolean | null
          legendary_ability_id?: string | null
          max_ap?: number | null
          max_hp?: number | null
          motto?: string | null
          motto_used?: boolean | null
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          abilities?: string[] | null
          advanced_class_id?: string | null
          appearance?: string | null
          background?: string | null
          background_used?: boolean | null
          callsign?: string
          class_id?: string | null
          crawler_id?: string | null
          created_at?: string | null
          current_ap?: number | null
          current_damage?: number | null
          current_tp?: number | null
          equipment?: string[] | null
          id?: string
          keepsake?: string | null
          keepsake_used?: boolean | null
          legendary_ability_id?: string | null
          max_ap?: number | null
          max_hp?: number | null
          motto?: string | null
          motto_used?: boolean | null
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'pilots_crawler_id_fkey'
            columns: ['crawler_id']
            isOneToOne: false
            referencedRelation: 'crawlers'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_game_invite: {
        Args: { p_expires_at?: string; p_game_id: string; p_max_uses?: number }
        Returns: {
          code: string
          created_at: string | null
          created_by: string
          expires_at: string | null
          game_id: string
          id: string
          max_uses: number | null
          uses: number | null
        }
        SetofOptions: {
          from: '*'
          to: 'game_invites'
          isOneToOne: true
          isSetofReturn: false
        }
      }
      expire_invite: { Args: { p_invite_id: string }; Returns: undefined }
      generate_invite_code: { Args: never; Returns: string }
      get_game_members: {
        Args: { p_game_id: string }
        Returns: {
          id: string
          role: string
          user_email: string
          user_id: string
          user_name: string
        }[]
      }
      is_game_mediator: {
        Args: { game_uuid: string; user_uuid: string }
        Returns: boolean
      }
      is_game_member: {
        Args: { game_uuid: string; user_uuid: string }
        Returns: boolean
      }
      redeem_invite_code: { Args: { invite_code: string }; Returns: string }
      test_auth_uid: {
        Args: never
        Returns: {
          jwt_role: string
          jwt_sub: string
          uid: string
        }[]
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

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
