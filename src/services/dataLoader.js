// src/services/dataLoader.js
import Papa from 'papaparse';
import { formatUtils } from '../utils/formatUtils';

class DataLoaderService {
  constructor() {
    this.cache = {};
    this.basePaths = {
      main: "family_phone_analysis_csv/",
      timeline: "bla_timeline_analysis_csv/",
    };
  }

  async loadCSV(path) {
    if (this.cache[path]) {
      console.log(`Loading ${path} from cache`);
      return this.cache[path];
    }

    return new Promise((resolve, reject) => {
      Papa.parse(path, {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim(),
        transform: (value) => {
          if (value === "" || value === null) return null;
          if (typeof value === "string") return value.trim();
          return value;
        },
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            console.warn(`Parsing warnings for ${path}:`, results.errors);
          }
          console.log(`Loaded ${path}: ${results.data.length} records`);
          this.cache[path] = results.data;
          resolve(results.data);
        },
        error: (error) => {
          console.error(`Failed to load ${path}:`, error);
          reject(error);
        },
      });
    });
  }

  async loadFamilySizeData() {
    const path = this.basePaths.main + "02_family_size_analysis.csv";
    const data = await this.loadCSV(path);
    return this.processFamilySizeData(data);
  }

  async loadBLAActivityData() {
    const path = this.basePaths.main + "04_bla_daily_activity.csv";
    const data = await this.loadCSV(path);
    return this.processBLAActivityData(data);
  }

  async loadBLAPerformanceData() {
    const path = this.basePaths.timeline + "02_bla_performance_summary.csv";
    const data = await this.loadCSV(path);
    return this.processBLAPerformanceData(data);
  }

  async loadTimelineData() {
    const path = this.basePaths.timeline + "01_family_creation_timeline.csv";
    const data = await this.loadCSV(path);
    return this.processTimelineData(data);
  }

  processFamilySizeData(data) {
    return data.map((record) => ({
      ...record,
      ac_no: String(record.ac_no || "").padStart(3, "0"),
      booth_no: String(record.booth_no || ""),
      family_size: formatUtils.parseInt(record.family_size),
      total_families: formatUtils.parseInt(record.total_families),
      families_with_verified: formatUtils.parseInt(
        record.families_with_verified
      ),
      families_with_unverified: formatUtils.parseInt(
        record.families_with_unverified
      ),
      is_small_family: formatUtils.parseInt(record.is_small_family),
      is_large_family: formatUtils.parseInt(record.is_large_family),
    }));
  }

  processBLAActivityData(data) {
    return data.map((record) => ({
      ...record,
      ac_no: String(record.ac_no || "").padStart(3, "0"),
      date: record.date,
      bla_id: String(record.bla_id || ""),
      bla_name: String(record.bla_name || ""),
      unique_phone_numbers_added: formatUtils.parseInt(
        record.unique_phone_numbers_added
      ),
      phone_numbers: String(record.phone_numbers || ""),
    }));
  }

  processBLAPerformanceData(data) {
    return data.map((record) => ({
      ...record,
      bla_id: String(record.bla_id || ""),
      bla_name: String(record.bla_name || ""),
      total_families_created: formatUtils.parseInt(
        record.total_families_created
      ),
      avg_duration_minutes: formatUtils.parseNumber(
        record.avg_duration_minutes
      ),
      median_duration_minutes: formatUtils.parseNumber(
        record.median_duration_minutes
      ),
      min_duration_minutes: formatUtils.parseNumber(
        record.min_duration_minutes
      ),
      max_duration_minutes: formatUtils.parseNumber(
        record.max_duration_minutes
      ),
      avg_family_size: formatUtils.parseNumber(record.avg_family_size),
      total_verified_members: formatUtils.parseInt(
        record.total_verified_members
      ),
      acs_worked: formatUtils.parseInt(record.acs_worked),
      booths_worked: formatUtils.parseInt(record.booths_worked),
    }));
  }

  // src/services/dataLoader.js - processTimelineData method
  processTimelineData(data) {
    return data.map((record) => ({
      ...record,
      ac_no: String(record.ac_no || "").padStart(3, "0"),
      booth_no: String(record.booth_no || ""),
      family_id: String(record.family_id || ""),
      family_size: formatUtils.parseInt(record.family_size),
      verified_count: formatUtils.parseInt(record.verified_count),
      bla_id: String(record.bla_id || ""),
      bla_name: String(record.bla_name || ""),
      // Store dates as ISO strings instead of Date objects
      first_member_time: record.first_member_time
        ? record.first_member_time
        : null,
      last_member_time: record.last_member_time
        ? record.last_member_time
        : null,
      creation_duration_minutes: formatUtils.parseNumber(
        record.creation_duration_minutes
      ),
      date: record.date,
      start_hour: formatUtils.parseInt(record.start_hour),
    }));
  }

  clearCache() {
    this.cache = {};
    console.log("Data cache cleared");
  }
}

export const dataLoaderService = new DataLoaderService();
