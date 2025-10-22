/**
 * Type definitions for @addpipe/webcam-tester
 * Copyright (c) 2025 Addpipe
 * License: AGPL-3.0
 */
// Type definitions for @addpipe/webcam-tester

export type TestType = 'success' | 'error' | 'warning' | 'info';

export type TestName = 
  | 'getUserMedia' 
  | 'secureContext' 
  | 'cameraPermissions' 
  | 'micPermissions' 
  | 'devices' 
  | 'capture' 
  | 'resolutions' 
  | 'lighting' 
  | 'otherApis';

export interface TestResult {
  id: string;
  icon: string;
  message: string;
  type: TestType;
  details: string | null;
  result: boolean;
  timestamp: Date;
  deviceId: string | null;
  deviceLabel: string | null;
}

export interface DeviceInfo {
  deviceId: string | null;
  deviceLabel: string | null;
}

export interface TesterConfig {
  /**
   * Show privacy notice
   * @default true
   */
  showPrivacyNotice?: boolean;

  /**
   * Show test result logs
   * @default true
   */
  showResults?: boolean;

  /**
   * Show camera preview
   * @default true
   */
  showCameraPreview?: boolean;

  /**
   * Show individual redo buttons
   * @default true
   */
  showRedoButtons?: boolean;

  /**
   * Show loading animations
   * @default true
   */
  showLoadingText?: boolean;

  /**
   * Allow restarting entire test suite
   * @default true
   */
  allowRestart?: boolean;

  /**
   * Allow camera device selection
   * @default true
   */
  allowCameraSelection?: boolean;

  /**
   * Allow microphone device selection
   * @default true
   */
  allowMicSelection?: boolean;

  /**
   * Use dark theme
   * @default false
   */
  darkTheme?: boolean;

  /**
   * Run without UI (UI-less mode)
   * @default false
   */
  uiLess?: boolean;

  /**
   * Custom title
   * @default 'Webcam Tester'
   */
  title?: string;

  /**
   * Specific tests to run
   * @default ['getUserMedia', 'secureContext', 'cameraPermissions', 'micPermissions', 'devices', 'capture', 'resolutions', 'lighting', 'otherApis']
   */
  tests?: TestName[];

  /**
   * Event callbacks
   */
  callbacks?: {
    /**
     * Fired when testing starts
     */
    onTestStart?: () => void;

    /**
     * Fired after each individual test completes
     * @param result - The test result object
     */
    onTestComplete?: (result: TestResult) => void;

    /**
     * Fired when all tests finish
     * @param results - Object containing all test results
     */
    onAllTestsComplete?: (results: Record<string, TestResult>) => void;

    /**
     * Fired when a test encounters an error
     * @param testName - Name of the test that failed
     * @param error - The error object
     */
    onError?: (testName: string, error: Error) => void;
  };
}

export interface MediaDeviceTester {
  /**
   * Start tests programmatically (useful in UI-less mode)
   */
  start(): Promise<void>;

  /**
   * Get all test results
   * @returns Object containing all test results
   */
  getTestResults(): Record<string, TestResult>;

  /**
   * Check if tests are currently running
   * @returns True if tests are running
   */
  isRunning(): boolean;

  /**
   * Get the current media stream
   * @returns The current MediaStream or null
   */
  getCurrentStream(): MediaStream | null;

  /**
   * Get selected camera information
   * @returns Camera device ID and label
   */
  getSelectedCameraInfo(): DeviceInfo;

  /**
   * Get selected microphone information
   * @returns Microphone device ID and label
   */
  getSelectedMicrophoneInfo(): DeviceInfo;

  /**
   * Toggle expandable info section for a test
   * @param testId - ID of the test
   */
  toggleInfo(testId: string): void;

  /**
   * Redo a specific test
   * @param testId - ID of the test to redo
   */
  redoTest(testId: string): Promise<void>;

  /**
   * Clean up resources and remove from DOM
   */
  destroy(): void;
}

/**
 * Initialize the webcam tester library
 * @param containerId - ID of the container element
 * @param config - Configuration options
 * @returns MediaDeviceTester instance
 */
export function insertWebcamTestLibrary(
  containerId: string,
  config?: TesterConfig
): MediaDeviceTester;

export { MediaDeviceTester as MediaDeviceTesterClass };