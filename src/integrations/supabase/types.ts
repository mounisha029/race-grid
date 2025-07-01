export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      championships: {
        Row: {
          entity_id: string
          fastest_laps: number | null
          id: string
          podiums: number | null
          points: number | null
          poles: number | null
          position: number
          season: number
          type: string
          updated_at: string | null
          wins: number | null
        }
        Insert: {
          entity_id: string
          fastest_laps?: number | null
          id?: string
          podiums?: number | null
          points?: number | null
          poles?: number | null
          position: number
          season: number
          type: string
          updated_at?: string | null
          wins?: number | null
        }
        Update: {
          entity_id?: string
          fastest_laps?: number | null
          id?: string
          podiums?: number | null
          points?: number | null
          poles?: number | null
          position?: number
          season?: number
          type?: string
          updated_at?: string | null
          wins?: number | null
        }
        Relationships: []
      }
      circuits: {
        Row: {
          country: string
          created_at: string | null
          drs_zones: number | null
          elevation_m: number | null
          id: string
          lap_record_holder_id: string | null
          lap_record_time: string | null
          lap_record_year: number | null
          location: string
          name: string
          number_of_turns: number | null
          timezone: string | null
          track_layout_url: string | null
          track_length_km: number | null
          updated_at: string | null
        }
        Insert: {
          country: string
          created_at?: string | null
          drs_zones?: number | null
          elevation_m?: number | null
          id?: string
          lap_record_holder_id?: string | null
          lap_record_time?: string | null
          lap_record_year?: number | null
          location: string
          name: string
          number_of_turns?: number | null
          timezone?: string | null
          track_layout_url?: string | null
          track_length_km?: number | null
          updated_at?: string | null
        }
        Update: {
          country?: string
          created_at?: string | null
          drs_zones?: number | null
          elevation_m?: number | null
          id?: string
          lap_record_holder_id?: string | null
          lap_record_time?: string | null
          lap_record_year?: number | null
          location?: string
          name?: string
          number_of_turns?: number | null
          timezone?: string | null
          track_layout_url?: string | null
          track_length_km?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "circuits_lap_record_holder_id_fkey"
            columns: ["lap_record_holder_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
        ]
      }
      comment_likes: {
        Row: {
          comment_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          comment_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          comment_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "race_comments"
            referencedColumns: ["id"]
          },
        ]
      }
      community_polls: {
        Row: {
          created_at: string
          created_by: string
          ends_at: string
          id: string
          options: Json
          question: string
          race_id: string | null
          total_votes: number | null
          updated_at: string
          votes: Json | null
        }
        Insert: {
          created_at?: string
          created_by: string
          ends_at: string
          id?: string
          options: Json
          question: string
          race_id?: string | null
          total_votes?: number | null
          updated_at?: string
          votes?: Json | null
        }
        Update: {
          created_at?: string
          created_by?: string
          ends_at?: string
          id?: string
          options?: Json
          question?: string
          race_id?: string | null
          total_votes?: number | null
          updated_at?: string
          votes?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "community_polls_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      drivers: {
        Row: {
          biography: string | null
          championships: number | null
          created_at: string | null
          date_of_birth: string | null
          debut_year: number | null
          dnfs: number | null
          driver_number: number | null
          fastest_laps: number | null
          first_name: string
          height_cm: number | null
          helmet_image_url: string | null
          id: string
          is_active: boolean | null
          last_name: string
          nationality: string | null
          place_of_birth: string | null
          podiums: number | null
          points: number | null
          pole_positions: number | null
          position: number | null
          profile_image_url: string | null
          status: Database["public"]["Enums"]["driver_status"] | null
          team_id: string | null
          updated_at: string | null
          weight_kg: number | null
          wins: number | null
        }
        Insert: {
          biography?: string | null
          championships?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          debut_year?: number | null
          dnfs?: number | null
          driver_number?: number | null
          fastest_laps?: number | null
          first_name: string
          height_cm?: number | null
          helmet_image_url?: string | null
          id?: string
          is_active?: boolean | null
          last_name: string
          nationality?: string | null
          place_of_birth?: string | null
          podiums?: number | null
          points?: number | null
          pole_positions?: number | null
          position?: number | null
          profile_image_url?: string | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          team_id?: string | null
          updated_at?: string | null
          weight_kg?: number | null
          wins?: number | null
        }
        Update: {
          biography?: string | null
          championships?: number | null
          created_at?: string | null
          date_of_birth?: string | null
          debut_year?: number | null
          dnfs?: number | null
          driver_number?: number | null
          fastest_laps?: number | null
          first_name?: string
          height_cm?: number | null
          helmet_image_url?: string | null
          id?: string
          is_active?: boolean | null
          last_name?: string
          nationality?: string | null
          place_of_birth?: string | null
          podiums?: number | null
          points?: number | null
          pole_positions?: number | null
          position?: number | null
          profile_image_url?: string | null
          status?: Database["public"]["Enums"]["driver_status"] | null
          team_id?: string | null
          updated_at?: string | null
          weight_kg?: number | null
          wins?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      lap_times: {
        Row: {
          created_at: string | null
          driver_id: string
          id: string
          lap_number: number
          lap_time: string | null
          pit_stop: boolean | null
          position: number | null
          race_id: string
          sector_1_time: string | null
          sector_2_time: string | null
          sector_3_time: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          tyre_age: number | null
          tyre_compound: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          id?: string
          lap_number: number
          lap_time?: string | null
          pit_stop?: boolean | null
          position?: number | null
          race_id: string
          sector_1_time?: string | null
          sector_2_time?: string | null
          sector_3_time?: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          tyre_age?: number | null
          tyre_compound?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          id?: string
          lap_number?: number
          lap_time?: string | null
          pit_stop?: boolean | null
          position?: number | null
          race_id?: string
          sector_1_time?: string | null
          sector_2_time?: string | null
          sector_3_time?: string | null
          session_type?: Database["public"]["Enums"]["session_type"]
          tyre_age?: number | null
          tyre_compound?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lap_times_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lap_times_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      live_session_data: {
        Row: {
          current_lap: number | null
          current_position: number | null
          driver_id: string
          drs_enabled: boolean | null
          gap_to_ahead: string | null
          gap_to_leader: string | null
          id: string
          in_pit: boolean | null
          last_lap_time: string | null
          race_id: string
          sector_1_time: string | null
          sector_2_time: string | null
          sector_3_time: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          speed_trap_kmh: number | null
          timestamp: string | null
          tyre_age: number | null
          tyre_compound: string | null
        }
        Insert: {
          current_lap?: number | null
          current_position?: number | null
          driver_id: string
          drs_enabled?: boolean | null
          gap_to_ahead?: string | null
          gap_to_leader?: string | null
          id?: string
          in_pit?: boolean | null
          last_lap_time?: string | null
          race_id: string
          sector_1_time?: string | null
          sector_2_time?: string | null
          sector_3_time?: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          speed_trap_kmh?: number | null
          timestamp?: string | null
          tyre_age?: number | null
          tyre_compound?: string | null
        }
        Update: {
          current_lap?: number | null
          current_position?: number | null
          driver_id?: string
          drs_enabled?: boolean | null
          gap_to_ahead?: string | null
          gap_to_leader?: string | null
          id?: string
          in_pit?: boolean | null
          last_lap_time?: string | null
          race_id?: string
          sector_1_time?: string | null
          sector_2_time?: string | null
          sector_3_time?: string | null
          session_type?: Database["public"]["Enums"]["session_type"]
          speed_trap_kmh?: number | null
          timestamp?: string | null
          tyre_age?: number | null
          tyre_compound?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_session_data_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "live_session_data_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      pit_stops: {
        Row: {
          created_at: string | null
          driver_id: string
          id: string
          lap_number: number
          pit_time: string | null
          race_id: string
          stop_number: number
          tyre_compound_new: string | null
          tyre_compound_old: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id: string
          id?: string
          lap_number: number
          pit_time?: string | null
          race_id: string
          stop_number: number
          tyre_compound_new?: string | null
          tyre_compound_old?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string
          id?: string
          lap_number?: number
          pit_time?: string | null
          race_id?: string
          stop_number?: number
          tyre_compound_new?: string | null
          tyre_compound_old?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pit_stops_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pit_stops_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      poll_votes: {
        Row: {
          created_at: string
          id: string
          poll_id: string
          selected_option: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          poll_id: string
          selected_option: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          poll_id?: string
          selected_option?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "poll_votes_poll_id_fkey"
            columns: ["poll_id"]
            isOneToOne: false
            referencedRelation: "community_polls"
            referencedColumns: ["id"]
          },
        ]
      }
      race_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          likes_count: number | null
          race_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          likes_count?: number | null
          race_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          likes_count?: number | null
          race_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "race_comments_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      races: {
        Row: {
          air_temperature_c: number | null
          circuit_id: string
          created_at: string | null
          humidity_percent: number | null
          id: string
          is_sprint_weekend: boolean | null
          name: string
          qualifying_date: string | null
          qualifying_time: string | null
          race_date: string
          race_distance_km: number | null
          race_time: string | null
          round: number
          season: number
          sprint_date: string | null
          sprint_time: string | null
          status: Database["public"]["Enums"]["race_status"] | null
          total_laps: number | null
          track_temperature_c: number | null
          updated_at: string | null
          weather_condition:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_direction: string | null
          wind_speed_kmh: number | null
        }
        Insert: {
          air_temperature_c?: number | null
          circuit_id: string
          created_at?: string | null
          humidity_percent?: number | null
          id?: string
          is_sprint_weekend?: boolean | null
          name: string
          qualifying_date?: string | null
          qualifying_time?: string | null
          race_date: string
          race_distance_km?: number | null
          race_time?: string | null
          round: number
          season: number
          sprint_date?: string | null
          sprint_time?: string | null
          status?: Database["public"]["Enums"]["race_status"] | null
          total_laps?: number | null
          track_temperature_c?: number | null
          updated_at?: string | null
          weather_condition?:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Update: {
          air_temperature_c?: number | null
          circuit_id?: string
          created_at?: string | null
          humidity_percent?: number | null
          id?: string
          is_sprint_weekend?: boolean | null
          name?: string
          qualifying_date?: string | null
          qualifying_time?: string | null
          race_date?: string
          race_distance_km?: number | null
          race_time?: string | null
          round?: number
          season?: number
          sprint_date?: string | null
          sprint_time?: string | null
          status?: Database["public"]["Enums"]["race_status"] | null
          total_laps?: number | null
          track_temperature_c?: number | null
          updated_at?: string | null
          weather_condition?:
            | Database["public"]["Enums"]["weather_condition"]
            | null
          wind_direction?: string | null
          wind_speed_kmh?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "races_circuit_id_fkey"
            columns: ["circuit_id"]
            isOneToOne: false
            referencedRelation: "circuits"
            referencedColumns: ["id"]
          },
        ]
      }
      session_results: {
        Row: {
          best_lap_number: number | null
          best_lap_time: string | null
          created_at: string | null
          dnf_reason: string | null
          driver_id: string
          fastest_lap: boolean | null
          final_time: string | null
          gap_to_ahead: string | null
          gap_to_leader: string | null
          grid_position: number | null
          id: string
          laps_completed: number | null
          points_awarded: number | null
          position: number | null
          race_id: string
          session_type: Database["public"]["Enums"]["session_type"]
          status: Database["public"]["Enums"]["result_status"] | null
          team_id: string
          updated_at: string | null
        }
        Insert: {
          best_lap_number?: number | null
          best_lap_time?: string | null
          created_at?: string | null
          dnf_reason?: string | null
          driver_id: string
          fastest_lap?: boolean | null
          final_time?: string | null
          gap_to_ahead?: string | null
          gap_to_leader?: string | null
          grid_position?: number | null
          id?: string
          laps_completed?: number | null
          points_awarded?: number | null
          position?: number | null
          race_id: string
          session_type: Database["public"]["Enums"]["session_type"]
          status?: Database["public"]["Enums"]["result_status"] | null
          team_id: string
          updated_at?: string | null
        }
        Update: {
          best_lap_number?: number | null
          best_lap_time?: string | null
          created_at?: string | null
          dnf_reason?: string | null
          driver_id?: string
          fastest_lap?: boolean | null
          final_time?: string | null
          gap_to_ahead?: string | null
          gap_to_leader?: string | null
          grid_position?: number | null
          id?: string
          laps_completed?: number | null
          points_awarded?: number | null
          position?: number | null
          race_id?: string
          session_type?: Database["public"]["Enums"]["session_type"]
          status?: Database["public"]["Enums"]["result_status"] | null
          team_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "session_results_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_results_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_results_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      social_posts: {
        Row: {
          comments_count: number | null
          content: string
          created_at: string
          id: string
          image_url: string | null
          likes_count: number | null
          race_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comments_count?: number | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          race_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comments_count?: number | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
          likes_count?: number | null
          race_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "social_posts_race_id_fkey"
            columns: ["race_id"]
            isOneToOne: false
            referencedRelation: "races"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          base_location: string | null
          championship_titles: number | null
          chassis: string | null
          created_at: string | null
          founded_year: number | null
          full_name: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          points: number | null
          position: number | null
          power_unit: string | null
          primary_color: string | null
          secondary_color: string | null
          team_principal: string | null
          updated_at: string | null
        }
        Insert: {
          base_location?: string | null
          championship_titles?: number | null
          chassis?: string | null
          created_at?: string | null
          founded_year?: number | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          points?: number | null
          position?: number | null
          power_unit?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          team_principal?: string | null
          updated_at?: string | null
        }
        Update: {
          base_location?: string | null
          championship_titles?: number | null
          chassis?: string | null
          created_at?: string | null
          founded_year?: number | null
          full_name?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          points?: number | null
          position?: number | null
          power_unit?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          team_principal?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_achievements: {
        Row: {
          achievement_data: Json | null
          achievement_type: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          achievement_data?: Json | null
          achievement_type: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          achievement_data?: Json | null
          achievement_type?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          activity_data: Json | null
          activity_type: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_data?: Json | null
          activity_type: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_data?: Json | null
          activity_type?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          bio: string | null
          created_at: string | null
          dark_mode: boolean | null
          display_name: string | null
          email_notifications: boolean | null
          favorite_driver_id: string | null
          favorite_drivers: string[] | null
          favorite_team_id: string | null
          id: string
          language: string | null
          notifications_enabled: boolean | null
          onboarding_completed: boolean | null
          privacy_settings: Json | null
          profile_picture_url: string | null
          push_notifications: boolean | null
          timezone: string | null
          two_factor_enabled: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          display_name?: string | null
          email_notifications?: boolean | null
          favorite_driver_id?: string | null
          favorite_drivers?: string[] | null
          favorite_team_id?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          privacy_settings?: Json | null
          profile_picture_url?: string | null
          push_notifications?: boolean | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string | null
          dark_mode?: boolean | null
          display_name?: string | null
          email_notifications?: boolean | null
          favorite_driver_id?: string | null
          favorite_drivers?: string[] | null
          favorite_team_id?: string | null
          id?: string
          language?: string | null
          notifications_enabled?: boolean | null
          onboarding_completed?: boolean | null
          privacy_settings?: Json | null
          profile_picture_url?: string | null
          push_notifications?: boolean | null
          timezone?: string | null
          two_factor_enabled?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_favorite_driver_id_fkey"
            columns: ["favorite_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_preferences_favorite_team_id_fkey"
            columns: ["favorite_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          favorite_driver_id: string | null
          favorite_team_id: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          favorite_driver_id?: string | null
          favorite_team_id?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          favorite_driver_id?: string | null
          favorite_team_id?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_favorite_driver_id_fkey"
            columns: ["favorite_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_favorite_team_id_fkey"
            columns: ["favorite_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      user_statistics: {
        Row: {
          join_date: string | null
          races_viewed: number | null
          total_achievements: number | null
          total_comments: number | null
          total_predictions: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      award_achievement: {
        Args: {
          p_user_id: string
          p_achievement_type: string
          p_achievement_data?: Json
        }
        Returns: boolean
      }
      log_user_activity: {
        Args: {
          p_user_id: string
          p_activity_type: string
          p_activity_data?: Json
        }
        Returns: string
      }
    }
    Enums: {
      driver_status: "active" | "retired" | "reserve"
      race_status:
        | "scheduled"
        | "practice"
        | "qualifying"
        | "race"
        | "completed"
        | "cancelled"
      result_status: "finished" | "dnf" | "dns" | "dsq"
      session_type:
        | "practice1"
        | "practice2"
        | "practice3"
        | "sprint_qualifying"
        | "qualifying"
        | "sprint"
        | "race"
      weather_condition: "dry" | "wet" | "intermediate" | "mixed"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      driver_status: ["active", "retired", "reserve"],
      race_status: [
        "scheduled",
        "practice",
        "qualifying",
        "race",
        "completed",
        "cancelled",
      ],
      result_status: ["finished", "dnf", "dns", "dsq"],
      session_type: [
        "practice1",
        "practice2",
        "practice3",
        "sprint_qualifying",
        "qualifying",
        "sprint",
        "race",
      ],
      weather_condition: ["dry", "wet", "intermediate", "mixed"],
    },
  },
} as const
