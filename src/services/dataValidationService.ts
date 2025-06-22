
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

class DataValidationService {
  validateRaceData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields validation
    if (!data.season || !Number.isInteger(data.season) || data.season < 1950) {
      errors.push('Invalid or missing season');
    }

    if (!data.round || !Number.isInteger(data.round) || data.round < 1) {
      errors.push('Invalid or missing round number');
    }

    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Invalid or missing race name');
    }

    if (!data.race_date || !this.isValidDate(data.race_date)) {
      errors.push('Invalid or missing race date');
    }

    // Optional field validation
    if (data.race_time && !this.isValidTime(data.race_time)) {
      warnings.push('Invalid race time format');
    }

    if (data.total_laps && (!Number.isInteger(data.total_laps) || data.total_laps < 1)) {
      warnings.push('Invalid total laps count');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateDriverData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.first_name || typeof data.first_name !== 'string' || data.first_name.trim().length === 0) {
      errors.push('Invalid or missing first name');
    }

    if (!data.last_name || typeof data.last_name !== 'string' || data.last_name.trim().length === 0) {
      errors.push('Invalid or missing last name');
    }

    // Optional but important fields
    if (data.driver_number && (!Number.isInteger(data.driver_number) || data.driver_number < 1 || data.driver_number > 99)) {
      warnings.push('Invalid driver number (should be 1-99)');
    }

    if (data.date_of_birth && !this.isValidDate(data.date_of_birth)) {
      warnings.push('Invalid date of birth');
    }

    if (data.nationality && (typeof data.nationality !== 'string' || data.nationality.length !== 3)) {
      warnings.push('Invalid nationality code (should be 3-letter ISO code)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateTeamData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      errors.push('Invalid or missing team name');
    }

    // Color validation
    if (data.primary_color && !this.isValidHexColor(data.primary_color)) {
      warnings.push('Invalid primary color format (should be hex color)');
    }

    if (data.secondary_color && !this.isValidHexColor(data.secondary_color)) {
      warnings.push('Invalid secondary color format (should be hex color)');
    }

    // Numeric validation
    if (data.founded_year && (!Number.isInteger(data.founded_year) || data.founded_year < 1900 || data.founded_year > new Date().getFullYear())) {
      warnings.push('Invalid founded year');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  validateLapTimeData(data: any): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Required fields
    if (!data.race_id || typeof data.race_id !== 'string') {
      errors.push('Invalid or missing race ID');
    }

    if (!data.driver_id || typeof data.driver_id !== 'string') {
      errors.push('Invalid or missing driver ID');
    }

    if (!data.lap_number || !Number.isInteger(data.lap_number) || data.lap_number < 1) {
      errors.push('Invalid or missing lap number');
    }

    // Lap time validation
    if (data.lap_time && !this.isValidLapTime(data.lap_time)) {
      warnings.push('Invalid lap time format (should be MM:SS.sss)');
    }

    // Sector time validation
    ['sector_1_time', 'sector_2_time', 'sector_3_time'].forEach(sector => {
      if (data[sector] && !this.isValidSectorTime(data[sector])) {
        warnings.push(`Invalid ${sector} format (should be SS.sss)`);
      }
    });

    // Position validation
    if (data.position && (!Number.isInteger(data.position) || data.position < 1)) {
      warnings.push('Invalid position (should be positive integer)');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  sanitizeRaceData(data: any): any {
    return {
      season: this.sanitizeInteger(data.season),
      round: this.sanitizeInteger(data.round),
      name: this.sanitizeString(data.name),
      circuit_id: this.sanitizeString(data.circuit_id),
      race_date: this.sanitizeDate(data.race_date),
      race_time: this.sanitizeTime(data.race_time),
      qualifying_date: this.sanitizeDate(data.qualifying_date),
      qualifying_time: this.sanitizeTime(data.qualifying_time),
      sprint_date: this.sanitizeDate(data.sprint_date),
      sprint_time: this.sanitizeTime(data.sprint_time),
      status: this.sanitizeEnum(data.status, ['scheduled', 'practice', 'qualifying', 'race', 'completed', 'cancelled']),
      weather_condition: this.sanitizeEnum(data.weather_condition, ['dry', 'wet', 'intermediate', 'mixed']),
      air_temperature_c: this.sanitizeInteger(data.air_temperature_c),
      track_temperature_c: this.sanitizeInteger(data.track_temperature_c),
      humidity_percent: this.sanitizeInteger(data.humidity_percent),
      wind_speed_kmh: this.sanitizeInteger(data.wind_speed_kmh),
      is_sprint_weekend: this.sanitizeBoolean(data.is_sprint_weekend),
      total_laps: this.sanitizeInteger(data.total_laps),
      race_distance_km: this.sanitizeFloat(data.race_distance_km)
    };
  }

  private isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
  }

  private isValidTime(timeString: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;
    return timeRegex.test(timeString);
  }

  private isValidHexColor(color: string): boolean {
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(color);
  }

  private isValidLapTime(time: string): boolean {
    const lapTimeRegex = /^[0-9]{1,2}:[0-5][0-9]\.[0-9]{3}$/;
    return lapTimeRegex.test(time);
  }

  private isValidSectorTime(time: string): boolean {
    const sectorTimeRegex = /^[0-9]{1,2}\.[0-9]{3}$/;
    return sectorTimeRegex.test(time);
  }

  private sanitizeString(value: any): string | null {
    if (typeof value === 'string') {
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }
    return null;
  }

  private sanitizeInteger(value: any): number | null {
    const num = parseInt(value);
    return isNaN(num) ? null : num;
  }

  private sanitizeFloat(value: any): number | null {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }

  private sanitizeBoolean(value: any): boolean {
    return Boolean(value);
  }

  private sanitizeDate(value: any): string | null {
    if (typeof value === 'string' && this.isValidDate(value)) {
      return value;
    }
    return null;
  }

  private sanitizeTime(value: any): string | null {
    if (typeof value === 'string' && this.isValidTime(value)) {
      return value;
    }
    return null;
  }

  private sanitizeEnum(value: any, allowedValues: string[]): string | null {
    if (typeof value === 'string' && allowedValues.includes(value)) {
      return value;
    }
    return null;
  }
}

export const dataValidationService = new DataValidationService();
