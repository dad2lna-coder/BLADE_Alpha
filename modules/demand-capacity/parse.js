/**
 * Volume flight-list parse. Pure helpers + ExcelJS workbook reader.
 * Required headers (case-insensitive): DAY_OF_WEEK, ETD, CAPACITY, LOAD_FACTOR, PERCENT_ORIGINATING.
 */

export const REQUIRED_HEADERS = ["DAY_OF_WEEK", "ETD", "CAPACITY", "LOAD_FACTOR", "PERCENT_ORIGINATING"];
