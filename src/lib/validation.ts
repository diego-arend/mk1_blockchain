/**
 * Validation class
 */
export default class Validation {
  success: boolean;
  message: string;

  /**
   * Create a new validation object
   * @param success If the validation was sucessful. Default is true
   * @param message The validation error message. Default is ""
   */
  constructor(success: boolean = true, message: string = "") {
    this.success = success;
    this.message = message;
  }
}
