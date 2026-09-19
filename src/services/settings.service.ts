import APIBase from './httpBase'
import type { PublicSettings } from '@/types'

class SettingsService extends APIBase {
  async getPublic(): Promise<PublicSettings> {
    const { data } = await this.get<PublicSettings>('settings/public')
    return data
  }
}

export const settingsService = new SettingsService()
