import { supabase } from './supabase'
import { Team, Pokemon } from '../types/pokemon'

export class DatabaseService {
    
  static async createTeam(name: string): Promise<Team | null> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .insert([{ name, pokemon: [] }])
        .select()
        .single()

      if (error) {
        console.error('Error creating team:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Error creating team:', error)
      return null
    }
  }

  static async getAllTeams(): Promise<Team[]> {
    try {
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching teams:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('Error fetching teams:', error)
      return []
    }
  }

  static async updateTeam(team: Team): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ 
          name: team.name, 
          pokemon: team.pokemon,
          updated_at: new Date().toISOString() 
        })
        .eq('id', team.id)

      if (error) {
        console.error('Error updating team:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error updating team:', error)
      return false
    }
  }

  static async renameTeam(teamId: string, name: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('teams')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', teamId)

      if (error) {
        console.error('Error renaming team:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error renaming team:', error)
      return false
    }
  }

  static async deleteTeam(teamId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)

      if (error) {
        console.error('Error deleting team:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Error deleting team:', error)
      return false
    }
  }

  static async addPokemonToTeam(team: Team, pokemon: Pokemon): Promise<Team | null> {
    const updatedTeam = {
      ...team,
      pokemon: [...team.pokemon, pokemon]
    }

    const success = await this.updateTeam(updatedTeam)
    return success ? updatedTeam : null
  }

  static async removePokemonFromTeam(team: Team, pokemonId: number): Promise<Team | null> {
    const updatedTeam = {
      ...team,
      pokemon: team.pokemon.filter(p => p.id !== pokemonId)
    }

    const success = await this.updateTeam(updatedTeam)
    return success ? updatedTeam : null
  }
}