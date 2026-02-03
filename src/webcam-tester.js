/**
 * Webcam Tester Library
 * Copyright (c) 2025 Addpipe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
// ============================================
// FILE: src/webcam-tester.js
// ============================================

(function (global, factory) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    // AMD
    define(factory);
  } else {
    // Browser globals
    var exports = factory();
    global.insertWebcamTestLibrary = exports.insertWebcamTestLibrary;
    global.WebcamDeviceTester = exports.WebcamDeviceTester;
  }
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const libraryCSS = `
    .media-tester {
        --bg-primary: #ffffff;
        --bg-secondary: #f8f9fa;
        --bg-tertiary: #e9ecef;
        --text-primary: #212529;
        --text-secondary: #6c757d;
        --text-muted: #adb5bd;
        --border-color: #dee2e6;
        --success-bg: #d1edff;
        --success-color: #0969da;
        --success-border: #0969da;
        --error-bg: #ffebe9;
        --error-color: #cf222e;
        --error-border: #cf222e;
        --warning-bg: #fff8dc;
        --warning-color: #bf8700;
        --warning-border: #bf8700;
        --info-bg: #e7f3ff;
        --info-color: #0550ae;
        --info-border: #0550ae;
        --button-bg: #2da44e;
        --button-hover: #2c974b;
        --button-disabled: #6c757d;
        
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        background-color: var(--bg-primary);
        color: var(--text-primary);
        line-height: 1.6;
        max-width: 600px;
        margin: 0 auto;
    }

    .media-tester.dark-theme {
        --bg-primary: #0d1117;
        --bg-secondary: #161b22;
        --bg-tertiary: #21262d;
        --text-primary: #f0f6fc;
        --text-secondary: #8b949e;
        --text-muted: #6e7681;
        --border-color: #30363d;
        --success-bg: #1a2332;
        --success-color: #3fb950;
        --success-border: #238636;
        --error-bg: #2d1b1e;
        --error-color: #f85149;
        --error-border: #da3633;
        --warning-bg: #2d2a1e;
        --warning-color: #f2cc60;
        --warning-border: #bf8700;
        --info-bg: #1c2541;
        --info-color: #79c0ff;
        --info-border: #1f6feb;
        --button-bg: #238636;
        --button-hover: #2ea043;
        --button-disabled: #484f58;
    }

    .media-tester * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    .media-tester h1 {
        text-align: center;
        margin-bottom: 30px;
        font-size: 28px;
        font-weight: 600;
    }

    .media-tester .privacy-notice,
    .media-tester .copyright {
        font-size: 12px;
        color: var(--text-muted);
        text-align: center;
        margin-bottom: 15px;
        padding: 8px;
        background-color: var(--bg-secondary);
        border-radius: 6px;
    }

    .media-tester .copyright {
      background-color: unset;
    }

    .media-tester .copyright > a {
      color: var(--text-muted);
    }

    .media-tester .camera-preview {
        width: 200px;
        height: 150px;
        margin: 0 auto 20px;
        border-radius: 12px;
        overflow: hidden;
        background-color: var(--bg-tertiary);
        border: 2px solid var(--border-color);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--text-secondary);
        text-align: center;
    }

    .media-tester .camera-preview video {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .media-tester .control-section {
        text-align: center;
        margin-bottom: 30px;
    }

    .media-tester .main-button {
        background: var(--button-bg);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: background-color 0.2s;
    }

    .media-tester .main-button:hover:not(:disabled) {
        background: var(--button-hover);
    }

    .media-tester .main-button:disabled {
        background: var(--button-disabled);
        cursor: not-allowed;
    }

    .media-tester .camera-selection {
        display: none;
        margin: 20px 0;
        padding: 15px;
        background: var(--bg-secondary);
        border-radius: 8px;
        border: 1px solid var(--border-color);
    }

    .media-tester .camera-selection.active {
        display: block;
    }

    .media-tester .camera-selection h3 {
        margin-bottom: 10px;
        font-size: 16px;
        color: var(--text-primary);
    }

    .media-tester .camera-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 15px;
    }

    .media-tester .camera-option {
        display: flex;
        align-items: center;
        padding: 8px;
        background: var(--bg-primary);
        border: 1px solid var(--border-color);
        border-radius: 6px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .media-tester .camera-option:hover {
        background: var(--bg-tertiary);
    }

    .media-tester .camera-option input[type="radio"] {
        margin-right: 10px;
    }

    .media-tester .camera-option label {
        cursor: pointer;
        flex: 1;
        font-size: 14px;
    }

    .media-tester .camera-actions {
        display: flex;
        gap: 10px;
        justify-content: center;
    }

    .media-tester .secondary-button {
        background: transparent;
        color: var(--text-secondary);
        border: 1px solid var(--border-color);
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        transition: all 0.2s;
    }

    .media-tester .secondary-button:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }

    .media-tester .loading-state {
        display: none;
        align-items: center;
        justify-content: center;
        margin: 20px 0;
        font-size: 14px;
        color: var(--text-secondary);
    }

    .media-tester .loading-state.active {
        display: flex;
    }

    .media-tester .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid var(--border-color);
        border-top: 2px solid var(--text-primary);
        border-radius: 50%;
        animation: media-tester-spin 1s linear infinite;
        margin-right: 10px;
    }

    @keyframes media-tester-spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .media-tester .results-section {
        margin-top: 30px;
    }

    .media-tester .test-result {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 8px 0;
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        border: 1px solid;
        opacity: 0;
        transform: translateY(10px);
        animation: media-tester-slideIn 0.3s ease-out forwards;
    }

    @keyframes media-tester-slideIn {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .media-tester .test-result.success {
        background: var(--success-bg);
        color: var(--success-color);
        border-color: var(--success-border);
    }

    .media-tester .test-result.error {
        background: var(--error-bg);
        color: var(--error-color);
        border-color: var(--error-border);
    }

    .media-tester .test-result.warning {
        background: var(--warning-bg);
        color: var(--warning-color);
        border-color: var(--warning-border);
    }

    .media-tester .test-result.info {
        background: var(--info-bg);
        color: var(--info-color);
        border-color: var(--info-border);
    }

    .media-tester .test-content {
        display: flex;
        align-items: center;
        flex: 1;
    }

    .media-tester .test-icon {
        margin-right: 8px;
        font-weight: bold;
    }

    .media-tester .redo-button,
    .media-tester .info-button {
        background: transparent;
        border: 1px solid currentColor;
        color: currentColor;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 11px;
        cursor: pointer;
        opacity: 0.7;
        transition: opacity 0.2s;
        margin-left: 4px;
    }

    .media-tester .redo-button:hover,
    .media-tester .info-button:hover {
        opacity: 1;
    }

    .media-tester .test-actions {
        display: flex;
        align-items: center;
    }

    .media-tester .resolution-details {
        font-size: 12px;
        margin-top: 4px;
        opacity: 0.8;
    }

    .media-tester .expandable-info {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease-out;
        font-size: 12px;
        margin-top: 8px;
        padding: 0 12px;
        opacity: 0.9;
    }

    .media-tester .expandable-info.expanded {
        max-height: 400px;
    }

    .media-tester .device-list {
        margin: 6px 0;
    }

    .media-tester .device-category {
        font-weight: 600;
        margin: 8px 0 4px 0;
    }

    .media-tester .device-item {
        margin: 2px 0;
        padding-left: 8px;
    }

    .media-tester .resolution-item {
        margin: 2px 0;
        display: flex;
        align-items: center;
    }

    .media-tester .resolution-status {
        margin-right: 6px;
        font-weight: bold;
    }

    .media-tester .capability-item {
        margin: 2px 0;
        display: flex;
        align-items: center;
    }

    .media-tester .capability-status {
        margin-right: 6px;
        font-weight: bold;
    }

    .media-tester .export-section {
        display: none;
        margin-top: 20px;
        padding: 15px;
        background: var(--bg-secondary);
        border-radius: 8px;
        border: 1px solid var(--border-color);
    }

    .media-tester .export-section.active {
        display: block;
    }

    .media-tester .export-section h4 {
        margin-bottom: 12px;
        font-size: 14px;
        color: var(--text-primary);
        font-weight: 600;
    }

    .media-tester .export-controls {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
    }

    .media-tester .export-select {
        flex: 1;
        min-width: 120px;
        max-width: 200px;
        padding: 8px 12px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        background: var(--bg-primary);
        color: var(--text-primary);
        font-size: 14px;
        cursor: pointer;
        appearance: none;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236c757d' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 10px center;
        padding-right: 30px;
    }

    .media-tester.dark-theme .export-select {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238b949e' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    }

    .media-tester .export-select:focus {
        outline: none;
        border-color: var(--button-bg);
    }

    .media-tester .export-button {
        background: var(--button-bg);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: background-color 0.2s;
        white-space: nowrap;
    }

    .media-tester .export-button:hover {
        background: var(--button-hover);
    }

    .media-tester .export-button:active {
        transform: scale(0.98);
    }

    @media (max-width: 480px) {
        .media-tester .export-controls {
            flex-direction: column;
            align-items: stretch;
        }

        .media-tester .export-select {
            max-width: none;
        }

        .media-tester .export-button {
            width: 100%;
        }
    }
  `;

  const defaultConfig = {
    showPrivacyNotice: false,
    showResults: true,
    showCameraPreview: true,
    showRedoButtons: true,
    showLoadingText: true,
    allowRestart: true,
    allowCameraSelection: true,
    allowMicSelection: true,
    darkTheme: false,
    uiLess: false,
    title: "Webcam Tester",
    tests: ["getUserMedia", "secureContext", "permissionsPolicy", "cameraPermissions", "micPermissions", "permissionsApi", "devices", "capture", "resolutions", "lighting", "otherApis"],
    callbacks: {
      onTestStart: null,
      onTestComplete: null,
      onAllTestsComplete: null,
      onError: null,
    },
  };

  class WebcamDeviceTester {
    constructor(containerId, config = {}, instanceId) {
      this.containerId = containerId;
      this.config = { ...defaultConfig, ...config };
      this.container = null;
      this.currentStream = null;
      this.isTestRunning = false;
      this.testResults = {};
      this.callbacks = this.config.callbacks || {};
      this.instanceId = instanceId;
      this.availableCameras = [];
      this.availableMicrophones = [];
      this.selectedCameraId = null;
      this.selectedMicrophoneId = null;
      this.cameraSelectionResolver = null;
      this.microphoneSelectionResolver = null;

      this.resolutions = [
        { name: "144p", width: 256, height: 144 },
        { name: "240p", width: 426, height: 240 },
        { name: "360p", width: 640, height: 360 },
        { name: "480p", width: 854, height: 480 },
        { name: "720p", width: 1280, height: 720 },
        { name: "1080p", width: 1920, height: 1080 },
        { name: "1440p", width: 2560, height: 1440 },
        { name: "4K", width: 3840, height: 2160 },
      ];

      this.init();
    }

    init() {
      this.injectCSS();
      if (!this.config.uiLess) {
        const elementExists = !!document.getElementById(this.containerId);
        const timeout = elementExists ? 0 : 1000;
        setTimeout(() => {
          this.createHTML();
          this.bindEvents();
        }, timeout);
      }
    }

    injectCSS() {
      if (typeof document === "undefined") return;
      if (!document.querySelector("#media-tester-styles")) {
        const style = document.createElement("style");
        style.id = "media-tester-styles";
        style.textContent = libraryCSS;
        document.head.appendChild(style);
      }
    }

    createHTML() {
      if (typeof document === "undefined") return;

      const targetElement = document.getElementById(this.containerId);
      if (!targetElement) {
        console.error(`Element with ID "${this.containerId}" not found`);
        return;
      }

      this.container = document.createElement("div");
      this.container.className = `media-tester${this.config.darkTheme ? " dark-theme" : ""}`;

      let html = `<h1>${this.config.title}</h1>`;

      if (this.config.showPrivacyNotice) {
        html += `
          <div class="privacy-notice">
              <strong>Your privacy matters to us.</strong> We do not store or transmit any data from this activity. Your personal information remains secure throughout the process.
          </div>
        `;
      }

      if (this.config.showCameraPreview) {
        html += `
          <div class="camera-preview" id="camera-preview-${this.containerId}">
              <span>Camera preview</span>
          </div>
        `;
      }

      html += `
        <div class="control-section">
            <button class="main-button" id="main-button-${this.containerId}">Start Test</button>
        </div>
      `;

      if (this.config.allowCameraSelection) {
        html += `
          <div class="camera-selection" id="camera-selection-${this.containerId}">
              <h3>📹 Select Camera</h3>
              <div class="camera-list" id="camera-list-${this.containerId}">
              </div>
              <div class="camera-actions">
                  <button class="main-button" id="proceed-camera-button-${this.containerId}">Proceed with Selected Camera</button>
                  <button class="secondary-button" id="cancel-camera-button-${this.containerId}">Cancel</button>
              </div>
          </div>
        `;
      }

      if (this.config.allowMicSelection) {
        html += `
          <div class="camera-selection" id="mic-selection-${this.containerId}">
              <h3>🎤 Select Microphone</h3>
              <div class="camera-list" id="mic-list-${this.containerId}">
              </div>
              <div class="camera-actions">
                  <button class="main-button" id="proceed-mic-button-${this.containerId}">Proceed with Selected Microphone</button>
                  <button class="secondary-button" id="cancel-mic-button-${this.containerId}">Cancel</button>
              </div>
          </div>
        `;
      }

      if (this.config.showLoadingText) {
        html += `
          <div class="loading-state" id="loading-state-${this.containerId}">
              <div class="spinner"></div>
              <span id="loading-text-${this.containerId}">Initializing...</span>
          </div>
        `;
      }

      html += `<div class="copyright">Made by the <a href="https://addpipe.com/" target="_blank">Pipe recording platform</a></div>`;

      if (this.config.showResults) {
        html += `<div class="results-section" id="results-section-${this.containerId}"></div>`;
        html += `
          <div class="export-section" id="export-section-${this.containerId}">
              <h4>Export Results</h4>
              <div class="export-controls">
                  <select class="export-select" id="export-format-${this.containerId}">
                      <option value="markdown" selected>Markdown (.md)</option>
                      <option value="json">JSON (.json)</option>
                      <option value="csv">CSV (.csv)</option>
                      <option value="xml">XML (.xml)</option>
                  </select>
                  <button class="export-button" id="export-button-${this.containerId}">Export</button>
              </div>
          </div>
        `;
      }

      this.container.innerHTML = html;
      targetElement.parentNode.replaceChild(this.container, targetElement);
    }

    bindEvents() {
      if (typeof document === "undefined") return;

      const button = document.getElementById(`main-button-${this.containerId}`);
      if (button) {
        button.addEventListener("click", () => this.handleStartTest());
      }

      if (this.config.allowCameraSelection) {
        const proceedButton = document.getElementById(`proceed-camera-button-${this.containerId}`);
        const cancelButton = document.getElementById(`cancel-camera-button-${this.containerId}`);

        if (proceedButton) {
          proceedButton.addEventListener("click", () => this.proceedWithSelectedCamera());
        }

        if (cancelButton) {
          cancelButton.addEventListener("click", () => this.cancelCameraSelection());
        }
      }

      if (this.config.allowMicSelection) {
        const proceedButton = document.getElementById(`proceed-mic-button-${this.containerId}`);
        const cancelButton = document.getElementById(`cancel-mic-button-${this.containerId}`);

        if (proceedButton) {
          proceedButton.addEventListener("click", () => this.proceedWithSelectedMicrophone());
        }

        if (cancelButton) {
          cancelButton.addEventListener("click", () => this.cancelMicrophoneSelection());
        }
      }

      if (this.config.showResults) {
        const exportButton = document.getElementById(`export-button-${this.containerId}`);
        if (exportButton) {
          exportButton.addEventListener("click", () => this.handleExport());
        }
      }

      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
          if (this.currentStream) {
            this.currentStream.getTracks().forEach((track) => track.stop());
          }
        });
      }
    }

    async handleStartTest() {
      // Run initial tests first (no stream required)
      await this.startTest();
    }

    async showCameraSelection() {
      this.setLoadingState("Detecting cameras...");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream && stream.getTracks().forEach((track) => track.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.availableCameras = devices.filter((device) => device.kind === "videoinput");

        if (this.availableCameras.length === 0) {
          this.setLoadingState("", false);
          return;
        }

        if (this.availableCameras.length === 1) {
          this.selectedCameraId = this.availableCameras[0].deviceId;
          this.setLoadingState("", false);
          return;
        }

        this.populateCameraList();

        const selectionDiv = document.getElementById(`camera-selection-${this.containerId}`);
        const mainButton = document.getElementById(`main-button-${this.containerId}`);

        if (selectionDiv && mainButton) {
          mainButton.style.display = "none";
          selectionDiv.classList.add("active");
        }

        this.setLoadingState("", false);

        // Wait for user to make selection
        await new Promise((resolve) => {
          this.cameraSelectionResolver = resolve;
        });
      } catch (error) {
        this.setLoadingState("", false);
        console.error("Error detecting cameras:", error);
      }
    }

    populateCameraList() {
      const cameraList = document.getElementById(`camera-list-${this.containerId}`);
      if (!cameraList) return;

      cameraList.innerHTML = "";

      this.availableCameras.forEach((camera, index) => {
        const cameraOption = document.createElement("div");
        cameraOption.className = "camera-option";

        const label = camera.label || `Camera ${index + 1}`;
        const radioId = `camera-${index}-${this.containerId}`;

        cameraOption.innerHTML = `
          <input type="radio" id="${radioId}" name="camera-selection-${this.containerId}" value="${camera.deviceId}" ${index === 0 ? "checked" : ""}>
          <label for="${radioId}">${label}</label>
        `;

        cameraList.appendChild(cameraOption);
      });

      if (this.availableCameras.length > 0) {
        this.selectedCameraId = this.availableCameras[0].deviceId;
      }

      const radioButtons = cameraList.querySelectorAll('input[type="radio"]');
      radioButtons.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          this.selectedCameraId = e.target.value;
        });
      });
    }

    async proceedWithSelectedCamera() {
      const selectionDiv = document.getElementById(`camera-selection-${this.containerId}`);
      if (selectionDiv) {
        selectionDiv.classList.remove("active");
      }

      // Resolve the promise to continue test execution
      if (this.cameraSelectionResolver) {
        this.cameraSelectionResolver();
        this.cameraSelectionResolver = null;
      }
    }

    cancelCameraSelection() {
      const selectionDiv = document.getElementById(`camera-selection-${this.containerId}`);
      const mainButton = document.getElementById(`main-button-${this.containerId}`);

      if (selectionDiv && mainButton) {
        selectionDiv.classList.remove("active");
        mainButton.style.display = "inline-block";
      }

      // Resolve the promise with cancellation (stops test execution)
      if (this.cameraSelectionResolver) {
        this.cameraSelectionResolver();
        this.cameraSelectionResolver = null;
      }

      // Stop test execution
      this.isTestRunning = false;
      this.setLoadingState("", false);
    }

    async showMicrophoneSelection() {
      this.setLoadingState("Detecting microphones...");

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream && stream.getTracks().forEach((track) => track.stop());
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.availableMicrophones = devices.filter((device) => device.kind === "audioinput");

        if (this.availableMicrophones.length === 0) {
          this.setLoadingState("", false);
          return;
        }

        if (this.availableMicrophones.length === 1) {
          this.selectedMicrophoneId = this.availableMicrophones[0].deviceId;
          this.setLoadingState("", false);
          return;
        }

        this.populateMicrophoneList();

        const selectionDiv = document.getElementById(`mic-selection-${this.containerId}`);
        const mainButton = document.getElementById(`main-button-${this.containerId}`);

        if (selectionDiv && mainButton) {
          mainButton.style.display = "none";
          selectionDiv.classList.add("active");
        }

        this.setLoadingState("", false);

        // Wait for user to make selection
        await new Promise((resolve) => {
          this.microphoneSelectionResolver = resolve;
        });
      } catch (error) {
        this.setLoadingState("", false);
        console.error("Error detecting microphones:", error);
      }
    }

    populateMicrophoneList() {
      const micList = document.getElementById(`mic-list-${this.containerId}`);
      if (!micList) return;

      micList.innerHTML = "";

      this.availableMicrophones.forEach((mic, index) => {
        const micOption = document.createElement("div");
        micOption.className = "camera-option";

        const label = mic.label || `Microphone ${index + 1}`;
        const radioId = `mic-${index}-${this.containerId}`;

        micOption.innerHTML = `
          <input type="radio" id="${radioId}" name="mic-selection-${this.containerId}" value="${mic.deviceId}" ${index === 0 ? "checked" : ""}>
          <label for="${radioId}">${label}</label>
        `;

        micList.appendChild(micOption);
      });

      if (this.availableMicrophones.length > 0) {
        this.selectedMicrophoneId = this.availableMicrophones[0].deviceId;
      }

      const radioButtons = micList.querySelectorAll('input[type="radio"]');
      radioButtons.forEach((radio) => {
        radio.addEventListener("change", (e) => {
          this.selectedMicrophoneId = e.target.value;
        });
      });
    }

    async proceedWithSelectedMicrophone() {
      const selectionDiv = document.getElementById(`mic-selection-${this.containerId}`);
      if (selectionDiv) {
        selectionDiv.classList.remove("active");
      }

      // Resolve the promise to continue test execution
      if (this.microphoneSelectionResolver) {
        this.microphoneSelectionResolver();
        this.microphoneSelectionResolver = null;
      }
    }

    cancelMicrophoneSelection() {
      const selectionDiv = document.getElementById(`mic-selection-${this.containerId}`);
      const mainButton = document.getElementById(`main-button-${this.containerId}`);

      if (selectionDiv && mainButton) {
        selectionDiv.classList.remove("active");
        mainButton.style.display = "inline-block";
      }

      // Resolve the promise with cancellation (stops test execution)
      if (this.microphoneSelectionResolver) {
        this.microphoneSelectionResolver();
        this.microphoneSelectionResolver = null;
      }

      // Stop test execution
      this.isTestRunning = false;
      this.setLoadingState("", false);
    }

    setLoadingState(text, active = true) {
      if (!this.config.showLoadingText || this.config.uiLess) return;
      if (typeof document === "undefined") return;

      const loadingState = document.getElementById(`loading-state-${this.containerId}`);
      const loadingText = document.getElementById(`loading-text-${this.containerId}`);

      if (loadingState && loadingText) {
        if (active) {
          loadingText.textContent = text;
          loadingState.classList.add("active");
        } else {
          loadingState.classList.remove("active");
        }
      }
    }

    addTestResult(id, icon, message, type, details = null, hasInfo = false, infoContent = "") {
      this.testResults[id] = {
        id,
        icon,
        message,
        type,
        details,
        result: type === "success",
        timestamp: new Date(),
        deviceId: id.includes("camera") || id.includes("video") ? this.selectedCameraId : id.includes("mic") || id.includes("audio") ? this.selectedMicrophoneId : null,
        deviceLabel: id.includes("camera") || id.includes("video") ? this.getSelectedCameraLabel() : id.includes("mic") || id.includes("audio") ? this.getSelectedMicrophoneLabel() : null,
      };

      if (this.callbacks.onTestComplete) {
        this.callbacks.onTestComplete(this.testResults[id]);
      }

      if (!this.config.showResults || this.config.uiLess) return;
      if (typeof document === "undefined") return;

      const existingResult = this.container.querySelector(`[data-test-id="${id}"]`);
      if (existingResult) {
        existingResult.remove();
      }

      const resultsSection = document.getElementById(`results-section-${this.containerId}`);
      if (!resultsSection) return;

      const resultDiv = document.createElement("div");
      resultDiv.className = `test-result ${type}`;
      resultDiv.setAttribute("data-test-id", id);

      const infoButton = hasInfo ? `<button class="info-button" onclick="window.${this.instanceId}.toggleInfo('${id}')">i</button>` : "";
      const redoButton = this.config.showRedoButtons ? `<button class="redo-button" onclick="window.${this.instanceId}.redoTest('${id}')">redo</button>` : "";

      resultDiv.innerHTML = `
        <div class="test-content">
            <span class="test-icon">${icon}</span>
            <div style="flex: 1;">
                <div>${message}</div>
                ${details ? `<div class="resolution-details">${details}</div>` : ""}
                ${hasInfo ? `<div class="expandable-info" id="info-${id}-${this.containerId}">${infoContent}</div>` : ""}
            </div>
        </div>
        <div class="test-actions">
            ${infoButton}
            ${redoButton}
        </div>
      `;

      resultsSection.appendChild(resultDiv);
    }

    getSelectedCameraLabel() {
      if (!this.selectedCameraId || !this.availableCameras) return null;

      const selectedCamera = this.availableCameras.find((camera) => camera.deviceId === this.selectedCameraId);
      return selectedCamera ? selectedCamera.label : null;
    }

    getSelectedMicrophoneLabel() {
      if (!this.selectedMicrophoneId || !this.availableMicrophones) return null;

      const selectedMic = this.availableMicrophones.find((mic) => mic.deviceId === this.selectedMicrophoneId);
      return selectedMic ? selectedMic.label : null;
    }

    toggleInfo(testId) {
      if (typeof document === "undefined") return;
      const infoDiv = document.getElementById(`info-${testId}-${this.containerId}`);
      if (infoDiv) {
        infoDiv.classList.toggle("expanded");
      }
    }

    async start() {
      await this.startTest();
    }

    async startTest() {
      if (this.isTestRunning) return;

      this.isTestRunning = true;

      if (typeof document !== "undefined") {
        const button = document.getElementById(`main-button-${this.containerId}`);
        if (button) {
          button.disabled = true;
        }

        const resultsSection = document.getElementById(`results-section-${this.containerId}`);
        if (resultsSection) {
          resultsSection.innerHTML = "";
        }

        // Hide export section when restarting tests
        const exportSection = document.getElementById(`export-section-${this.containerId}`);
        if (exportSection) {
          exportSection.classList.remove("active");
        }
      }

      this.testResults = {};

      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track) => track.stop());
        this.currentStream = null;
      }

      if (this.callbacks.onTestStart) {
        this.callbacks.onTestStart();
      }

      try {
        await this.runAllTests();
      } finally {
        this.isTestRunning = false;
        this.setLoadingState("", false);

        if (typeof document !== "undefined") {
          const button = document.getElementById(`main-button-${this.containerId}`);
          if (button) {
            button.disabled = false;
            button.style.display = "inline-block";
            if (this.config.allowRestart) {
              button.textContent = "Restart Test";
            }
          }

          // Show export section after tests complete
          if (this.config.showResults) {
            const exportSection = document.getElementById(`export-section-${this.containerId}`);
            if (exportSection) {
              exportSection.classList.add("active");
            }
          }
        }

        if (this.callbacks.onAllTestsComplete) {
          this.callbacks.onAllTestsComplete(this.testResults);
        }
      }
    }

    async runAllTests() {
      const testMap = {
        getUserMedia: () => this.testGetUserMedia(),
        secureContext: () => this.testSecureContext(),
        permissionsPolicy: () => this.testPermissionsPolicy(),
        permissionsApi: () => this.testPermissionsApi(),
        cameraPermissions: () => this.testCameraPermissions(),
        micPermissions: () => this.testMicPermissions(),
        devices: () => this.testDeviceEnumeration(),
        capture: () => this.testMediaCapture(),
        resolutions: () => this.testResolutions(),
        lighting: () => this.testLighting(),
        otherApis: () => this.testOtherApisCapabilities(),
      };

      // Tests that don't require stream access (run first)
      const initialTests = ["getUserMedia", "secureContext", "permissionsPolicy", "permissionsApi"];
      // Tests that require stream access (run after device selection)
      const streamTests = ["cameraPermissions", "micPermissions", "devices", "capture", "resolutions", "lighting", "otherApis"];

      // Run initial tests first
      for (const testName of this.config.tests) {
        if (initialTests.includes(testName) && testMap[testName]) {
          try {
            await testMap[testName]();
          } catch (error) {
            if (this.callbacks.onError) {
              this.callbacks.onError(testName, error);
            }
          }
        }
      }

      // Check if initial tests failed critically
      const hasGetUserMediaError = this.testResults.getUserMedia && this.testResults.getUserMedia.type === "error";
      const hasSecureContextError = this.testResults.secureContext && this.testResults.secureContext.type === "error";
      const hasPermissionsPolicyError = this.testResults.permissionsPolicy && this.testResults.permissionsPolicy.type === "error";
      const hasPermissionsAPIError = this.testResults.permissionsApi && this.testResults.permissionsApi.type === "error";

      // Stop if critical initial tests failed
      if (hasGetUserMediaError || hasSecureContextError || hasPermissionsPolicyError || hasPermissionsAPIError) {
        this.addTestResult("critical-failure", "❌", "Critical requirements not met. Cannot proceed with remaining tests.", "error");
        return;
      }

      // Show device selection if needed (only before stream tests)
      const needsCameraSelection = !this.config.uiLess && this.config.allowCameraSelection && this.config.tests.some(test => streamTests.includes(test) && test === "cameraPermissions");
      const needsMicSelection = !this.config.uiLess && this.config.allowMicSelection && this.config.tests.some(test => streamTests.includes(test) && test === "micPermissions");

      if (needsCameraSelection) {
        await this.showCameraSelection();
      } 
      
      if (needsMicSelection) {
        await this.showMicrophoneSelection();
      }

      // Check if user cancelled during device selection
      if (!this.isTestRunning) {
        return;
      }

      // Run remaining tests that require stream access
      for (const testName of this.config.tests) {
        if (streamTests.includes(testName) && testMap[testName]) {
          try {
            await testMap[testName]();
          } catch (error) {
            if (this.callbacks.onError) {
              this.callbacks.onError(testName, error);
            }
          }
        }
      }
    }

    async testGetUserMedia() {
      this.setLoadingState("Checking browser support...");
      await this.sleep(500);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia) {
          this.addTestResult("getUserMedia", "⚠️", "Legacy getUserMedia found - limited functionality", "warning");
        } else {
          this.addTestResult("getUserMedia", "❌", "getUserMedia not supported in this browser", "error");
        }
      } else {
        this.addTestResult("getUserMedia", "✅", "getUserMedia API is available", "success");
      }
    }

    async testSecureContext() {
      this.setLoadingState("Checking security context...");
      await this.sleep(300);

      if (window.isSecureContext) {
        this.addTestResult("secureContext", "✅", "Running in secure context (HTTPS, localhost, file://, etc.)", "success");
      } else {
        this.addTestResult("secureContext", "❌", "Not in secure context - HTTPS required", "error");
      }
    }

    async testPermissionsPolicy() {
      this.setLoadingState("Checking permissions policy...");
      await this.sleep(400);

      const policies = [];
      const policyResults = [];
      let hasIssues = false;

      // Check if Permissions Policy API is supported
      if (!document.featurePolicy && !document.permissionsPolicy) {
        this.addTestResult("permissionsPolicy", "⚠️", "Permissions Policy API not supported in this browser", "warning");
        return;
      }

      const policy = document.permissionsPolicy || document.featurePolicy;

      let micNotAllowed = false;
      let camNotAllowed = false;

      // Check camera policy
      try {
        const cameraAllowed = policy.allowsFeature("camera");
        if (cameraAllowed) {
          policies.push("Camera allowed");
          policyResults.push({ name: "camera", allowed: true });
        } else {
          policies.push("Camera blocked by policy");
          policyResults.push({ name: "camera", allowed: false });
          hasIssues = true;
          camNotAllowed = true;
        }
      } catch (error) {
        policyResults.push({ name: "camera", allowed: null, error: true });
      }

      // Check microphone policy
      try {
        const micAllowed = policy.allowsFeature("microphone");
        if (micAllowed) {
          policies.push("Microphone allowed");
          policyResults.push({ name: "microphone", allowed: true });
          micNotAllowed = true;
        } else {
          policies.push("Microphone blocked by policy");
          policyResults.push({ name: "microphone", allowed: false });
          hasIssues = true;
        }
      } catch (error) {
        policyResults.push({ name: "microphone", allowed: false, error: true });
      }

      // Check display-capture (screen sharing) policy
      // try {
      //   const displayCaptureAllowed = policy.allowsFeature("display-capture");
      //   if (displayCaptureAllowed) {
      //     policies.push("Screen capture allowed");
      //     policyResults.push({ name: "display-capture", allowed: true });
      //   } else {
      //     policyResults.push({ name: "display-capture", allowed: false });
      //   }
      // } catch (error) {
      //   policyResults.push({ name: "display-capture", allowed: null, error: true });
      // }

      // Create detailed policy info for expandable section
      let policyInfo = "<div><strong>Feature Policies:</strong></div>";
      policyResults.forEach((result) => {
        let status = "❓";
        let statusText = "Unknown";

        if (result.error) {
          status = "⚠️";
          statusText = "Unable to check";
        } else if (result.allowed === true) {
          status = "✅";
          statusText = "Allowed";
        } else if (result.allowed === false) {
          status = "";
          statusText = "Blocked by policy";
        }

        policyInfo += `<div class="capability-item"><span class="capability-status">${status}</span>${result.name}: ${statusText}</div>`;
      });

      // Determine result type and message
      if (hasIssues) {
        if (camNotAllowed) {
          this.addTestResult("permissionsPolicy", "❌", "Some features blocked by Permissions Policy", "error", `Policies: ${policies.join(", ")}`, true, policyInfo);
        } else {
          this.addTestResult("permissionsPolicy", "⚠️", "Some features blocked by Permissions Policy", "warning", `Policies: ${policies.join(", ")}`, true, policyInfo);
        }
      } else {
        this.addTestResult("permissionsPolicy", "✅", "Camera & Microphone allowed by Permissions Policy", "success", `Policies: ${policies.join(", ")}`, true, policyInfo);
      }
    }

    async testPermissionsApi() {
      this.setLoadingState("Checking browser permission states...");
      await this.sleep(400);

      const permissionResults = [];
      let allGranted = true;
      let hasPrompt = false;
      let hasDenied = false;
      let apiSupported = true;

      // Check if Permissions API is available
      if (!navigator.permissions || typeof navigator.permissions.query !== "function") {
        const infoContent = `
          <div><strong>Permissions API Check:</strong></div>
          <div class="capability-item"><span class="capability-status">⚠️</span>navigator.permissions: Not available</div>
          <div style="margin-top: 8px;">The Permissions API allows checking the current permission state without prompting the user. This browser does not support this feature, but camera and microphone access may still work.</div>
        `;
        this.addTestResult(
          "permissionsApi",
          "⚠️",
          "Permissions API not supported in this browser",
          "warning",
          "Permission states cannot be queried",
          true,
          infoContent
        );
        return;
      }

      // Check camera permission
      try {
        const cameraPermission = await navigator.permissions.query({ name: "camera" });
        permissionResults.push({
          name: "camera",
          state: cameraPermission.state,
          supported: true,
        });

        if (cameraPermission.state === "granted") {
          // Good
        } else if (cameraPermission.state === "prompt") {
          allGranted = false;
          hasPrompt = true;
        } else if (cameraPermission.state === "denied") {
          allGranted = false;
          hasDenied = true;
        }
      } catch (error) {
        // Some browsers don't support querying camera permission
        permissionResults.push({
          name: "camera",
          state: "unsupported",
          supported: false,
          error: error.message,
        });
        apiSupported = false;
      }

      // Check microphone permission
      try {
        const micPermission = await navigator.permissions.query({ name: "microphone" });
        permissionResults.push({
          name: "microphone",
          state: micPermission.state,
          supported: true,
        });

        if (micPermission.state === "granted") {
          // Good
        } else if (micPermission.state === "prompt") {
          allGranted = false;
          hasPrompt = true;
        } else if (micPermission.state === "denied") {
          allGranted = false;
          hasDenied = true;
        }
      } catch (error) {
        // Some browsers don't support querying microphone permission
        permissionResults.push({
          name: "microphone",
          state: "unsupported",
          supported: false,
          error: error.message,
        });
        apiSupported = false;
      }

      // Build expandable info content
      let infoContent = "<div><strong>Permission States:</strong></div>";
      permissionResults.forEach((result) => {
        let status = "❓";
        let stateText = "Unknown";

        if (!result.supported) {
          status = "⚠️";
          stateText = `Cannot query (${result.error || "not supported"})`;
        } else if (result.state === "granted") {
          status = "✅";
          stateText = "Granted - Permission was previously allowed";
        } else if (result.state === "prompt") {
          status = "⏳";
          stateText = "Prompt - User will be asked for permission";
        } else if (result.state === "denied") {
          status = "❌";
          stateText = "Denied - Permission was blocked by user or browser";
        }

        infoContent += `<div class="capability-item"><span class="capability-status">${status}</span>${result.name}: ${stateText}</div>`;
      });

      infoContent += `
        <div style="margin-top: 8px;"><strong>What this means:</strong></div>
        <div style="margin-top: 4px;">
          <div>• <strong>Granted:</strong> Access was previously allowed and will work immediately</div>
          <div>• <strong>Prompt:</strong> The browser will ask for permission when access is requested</div>
          <div>• <strong>Denied:</strong> Access was blocked - user must change browser/site settings</div>
        </div>
      `;

      // Determine overall result
      if (!apiSupported) {
        // Some permissions couldn't be queried
        const supported = permissionResults.filter((r) => r.supported);
        if (supported.length === 0) {
          this.addTestResult(
            "permissionsApi",
            "⚠️",
            "Could not query permission states for camera/microphone",
            "warning",
            "Browser may not support permission queries for media devices",
            true,
            infoContent
          );
        } else {
          // Partial support
          this.addTestResult(
            "permissionsApi",
            "⚠️",
            "Partial Permissions API support",
            "warning",
            `Only some permissions could be queried`,
            true,
            infoContent
          );
        }
      } else if (hasDenied) {
        this.addTestResult(
          "permissionsApi",
          "❌",
          "Camera or microphone permission is denied",
          "error",
          "User must allow permissions in browser settings to proceed",
          true,
          infoContent
        );
      } else if (hasPrompt) {
        this.addTestResult(
          "permissionsApi",
          "⚠️",
          "Camera or microphone permission not yet granted",
          "warning",
          "User will be prompted to allow access when requested",
          true,
          infoContent
        );
      } else if (allGranted) {
        this.addTestResult(
          "permissionsApi",
          "✅",
          "Camera and microphone permissions previously allowed",
          "success",
          "Both permissions were previously allowed",
          true,
          infoContent
        );
      }
    }

    async testCameraPermissions() {
      this.setLoadingState("Requesting camera permissions...");

      try {
        const constraints = {
          video: this.selectedCameraId ? { deviceId: { exact: this.selectedCameraId } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!this.selectedCameraId) {
          this.selectedCameraId = stream.getVideoTracks()[0].getSettings().deviceId;
        }

        if (this.config.showCameraPreview && !this.config.uiLess && typeof document !== "undefined") {
          const preview = document.getElementById(`camera-preview-${this.containerId}`);
          if (preview) {
            const video = document.createElement("video");
            video.srcObject = stream;
            video.autoplay = true;
            video.muted = true;
            video.playsInline = true;
            preview.innerHTML = "";
            preview.appendChild(video);
          }
        }

        if (!this.currentStream) {
          this.currentStream = stream;
        } else {
          const videoTrack = stream.getVideoTracks()[0];
          this.currentStream.addTrack(videoTrack);
          stream.getVideoTracks().forEach((t) => {
            if (t !== videoTrack) t.stop();
          });
        }

        this.addTestResult("cameraPermissions", "✅", "Camera permissions granted", "success");
      } catch (error) {
        let message = "Camera permission denied: ";
        switch (error.name) {
          case "NotAllowedError":
            message += "User denied access or browser blocked";
            break;
          case "NotFoundError":
            message += "No camera found";
            break;
          case "SecurityError":
            message += "Security error (HTTPS required)";
            break;
          default:
            message += error.message;
        }
        this.addTestResult("cameraPermissions", "❌", message, "error");
      }
    }

    async testMicPermissions() {
      this.setLoadingState("Requesting microphone permissions...");

      try {
        const constraints = {
          audio: this.selectedMicrophoneId ? { deviceId: { exact: this.selectedMicrophoneId } } : true,
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        if (!this.selectedMicrophoneId) {
          this.selectedMicrophoneId = stream.getAudioTracks()[0].getSettings().deviceId;
        }

        if (!this.currentStream) {
          this.currentStream = stream;
        } else {
          const audioTrack = stream.getAudioTracks()[0];
          this.currentStream.addTrack(audioTrack);
          stream.getAudioTracks().forEach((t) => {
            if (t !== audioTrack) t.stop();
          });
        }

        this.addTestResult("micPermissions", "✅", "Microphone permissions granted", "success");
      } catch (error) {
        let message = "Microphone permission denied: ";
        switch (error.name) {
          case "NotAllowedError":
            message += "User denied access or browser blocked";
            break;
          case "NotFoundError":
            message += "No microphone found";
            break;
          case "SecurityError":
            message += "Security error (HTTPS required)";
            break;
          default:
            message += error.message;
        }
        this.addTestResult("micPermissions", "❌", message, "error");
      }
    }

    async testDeviceEnumeration() {
      this.setLoadingState("Detecting devices...");
      await this.sleep(400);

      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputs = devices.filter((d) => d.kind === "audioinput");
        const videoInputs = devices.filter((d) => d.kind === "videoinput");
        const audioOutputs = devices.filter((d) => d.kind === "audiooutput");

        let deviceInfo = "";

        if (audioInputs.length > 0) {
          deviceInfo += '<div class="device-category">🎤 Audio Inputs:</div><div class="device-list">';
          audioInputs.forEach((device, index) => {
            const isSelected = device.deviceId === this.selectedMicrophoneId ? " (Selected)" : "";
            deviceInfo += `<div class="device-item">${device.label || `Microphone ${index + 1}`}${isSelected}</div>`;
          });
          deviceInfo += "</div>";
        }

        if (videoInputs.length > 0) {
          deviceInfo += '<div class="device-category">📹 Video Inputs:</div><div class="device-list">';
          videoInputs.forEach((device, index) => {
            const isSelected = device.deviceId === this.selectedCameraId ? " (Selected)" : "";
            deviceInfo += `<div class="device-item">${device.label || `Camera ${index + 1}`}${isSelected}</div>`;
          });
          deviceInfo += "</div>";
        }

        if (audioOutputs.length > 0) {
          deviceInfo += '<div class="device-category">🔊 Audio Outputs:</div><div class="device-list">';
          audioOutputs.forEach((device, index) => {
            deviceInfo += `<div class="device-item">${device.label || `Speaker ${index + 1}`}</div>`;
          });
          deviceInfo += "</div>";
        }

        this.addTestResult("devices", "✅", `Found ${audioInputs.length} microphone(s) and ${videoInputs.length} camera(s)`, "success", null, true, deviceInfo);
      } catch (error) {
        this.addTestResult("devices", "❌", `Device enumeration failed: ${error.message}`, "error");
      }
    }

    async testMediaCapture() {
      if (!this.currentStream) {
        this.addTestResult("capture", "❌", "Media capture failed - no permissions", "error");
        return;
      }

      this.setLoadingState("Testing media capture...");
      await this.sleep(300);

      const videoTracks = this.currentStream.getVideoTracks();
      const audioTracks = this.currentStream.getAudioTracks();

      if (videoTracks.length > 0 && audioTracks.length > 0) {
        const videoSettings = videoTracks[0].getSettings();
        this.addTestResult("capture", "✅", `Video (${videoSettings.width}x${videoSettings.height}) and Audio capture active`, "success");
      } else if (videoTracks.length > 0) {
        const videoSettings = videoTracks[0].getSettings();
        this.addTestResult("capture", "✅", `Video capture is active: ${videoSettings.width}x${videoSettings.height}`, "success");
      } else if (audioTracks.length > 0) {
        this.addTestResult("capture", "✅", "Audio capture is active", "success");
      } else {
        this.addTestResult("capture", "⚠️", "Partial media capture - missing tracks", "warning");
      }
    }

    async testResolutions() {
      if (!this.currentStream || this.currentStream.getVideoTracks().length === 0) {
        this.addTestResult("resolutions", "❌", "Resolution testing failed - no video stream", "error");
        return;
      }

      this.setLoadingState("Testing video resolutions...");

      const originalConstraints = {
        video: this.selectedCameraId ? { deviceId: { exact: this.selectedCameraId }, width: 640, height: 480 } : { width: 640, height: 480 },
      };

      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track) => track.stop());
        this.currentStream = null;
      }

      const supportedResolutions = [];
      const resolutionResults = [];
      let totalFrameRate = 0;
      let supportedCount = 0;

      let videoPreview = null;
      if (this.config.showCameraPreview && !this.config.uiLess && typeof document !== "undefined") {
        const preview = document.getElementById(`camera-preview-${this.containerId}`);
        if (preview) {
          videoPreview = preview.querySelector("video");
        }
      }

      for (const resolution of this.resolutions) {
        try {
          const constraints = {
            video: {
              width: { exact: resolution.width },
              height: { exact: resolution.height },
            },
          };

          if (this.selectedCameraId) {
            constraints.video.deviceId = { exact: this.selectedCameraId };
          }

          const testStream = await navigator.mediaDevices.getUserMedia(constraints);

          if (videoPreview) {
            videoPreview.srcObject = testStream;
          }

          const track = testStream.getVideoTracks()[0];
          const settings = track.getSettings();
          const frameRate = Math.round(settings.frameRate || 30);

          supportedResolutions.push(`${resolution.name} (${frameRate}fps)`);
          resolutionResults.push({
            name: resolution.name,
            supported: true,
            frameRate: frameRate,
          });
          totalFrameRate += frameRate;
          supportedCount++;

          testStream.getTracks().forEach((t) => t.stop());
        } catch (error) {
          resolutionResults.push({
            name: resolution.name,
            supported: false,
            frameRate: 0,
          });
        }
      }

      try {
        this.currentStream = await navigator.mediaDevices.getUserMedia(originalConstraints);

        if (videoPreview) {
          videoPreview.srcObject = this.currentStream;
        }
      } catch (error) {
        console.error("Failed to restore original stream:", error);
      }

      const avgFrameRate = supportedCount > 0 ? Math.round(totalFrameRate / supportedCount) : 0;
      const details = `Supported: ${supportedResolutions.join(", ")} | Average FPS: ${avgFrameRate}`;

      let resolutionInfo = "";
      resolutionResults.forEach((result) => {
        const status = result.supported ? "✅" : "❌";
        const fps = result.supported ? ` (${result.frameRate}fps)` : "";
        resolutionInfo += `<div class="resolution-item"><span class="resolution-status">${status}</span>${result.name}${fps}</div>`;
      });

      if (supportedCount > 0) {
        this.addTestResult("resolutions", "✅", `Resolution testing completed (${supportedCount}/${this.resolutions.length} supported)`, "success", details, true, resolutionInfo);
      } else {
        this.addTestResult("resolutions", "❌", "No standard resolutions supported", "error");
      }
    }

    async testLighting() {
      if (!this.currentStream || this.currentStream.getVideoTracks().length === 0) {
        this.addTestResult("lighting", "❌", "Lighting test failed - no video stream", "error");
        return;
      }

      this.setLoadingState("Analyzing lighting conditions...");
      await this.sleep(500);

      try {
        let video = null;

        if (!this.config.uiLess && typeof document !== "undefined") {
          video = this.container.querySelector(`#camera-preview-${this.containerId} video`);
        }

        if (!video && typeof document !== "undefined") {
          video = document.createElement("video");
          video.srcObject = this.currentStream;
          video.autoplay = true;
          video.playsInline = true;
          video.muted = true;
          await new Promise((resolve) => {
            video.onloadedmetadata = resolve;
          });
          await this.sleep(500);
        }

        if (!video) {
          this.addTestResult("lighting", "⚠️", "Could not analyze lighting conditions", "warning");
          return;
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        let brightness = 0;
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          brightness += r * 0.299 + g * 0.587 + b * 0.114;
        }

        brightness = brightness / (canvas.width * canvas.height);
        const roundedBrightness = Math.round(brightness);

        const lightingInfo = `
          <div><strong>Brightness Scale (0-255):</strong></div>
          <div>• 0-50: Very dark (poor visibility)</div>
          <div>• 50-100: Dark (suboptimal lighting)</div>
          <div>• 100-180: Good (optimal range)</div>
          <div>• 180-220: Bright (acceptable)</div>
          <div>• 220-255: Very bright (overexposure risk)</div>
          <div style="margin-top: 8px;"><strong>Your brightness: ${roundedBrightness}</strong></div>
        `;

        if (brightness < 50) {
          this.addTestResult("lighting", "🌙", `Lighting is quite dark - consider better lighting (brightness: ${roundedBrightness})`, "warning", null, true, lightingInfo);
        } else if (brightness > 200) {
          this.addTestResult("lighting", "☀️", `Lighting is very bright - might cause overexposure (brightness: ${roundedBrightness})`, "warning", null, true, lightingInfo);
        } else {
          this.addTestResult("lighting", "✅", `Lighting conditions are good (brightness: ${roundedBrightness})`, "success", null, true, lightingInfo);
        }
      } catch (error) {
        this.addTestResult("lighting", "⚠️", "Could not analyze lighting conditions", "warning");
      }
    }

    async testOtherApisCapabilities() {
      this.setLoadingState("Testing other APIs...");
      await this.sleep(400);

      const capabilities = [];
      const capabilityResults = [];

      if (typeof MediaRecorder !== "undefined") {
        capabilities.push("Recording");

        const mimeTypes = ["video/mp4;codecs=av01.0.08M.08", "video/mp4;codecs=hvc1.1.6.L93.B0", "video/mp4;codecs=hev1.1.6.L93.B0", "video/mp4;codecs=hev1.1.6.L93.B0", "video/webm;codecs=vp9.0", "video/mp4;codecs=avc1.42001E", "video/mp4;codecs=avc1.4D001E", "video/mp4;codecs=avc1.58001E", "video/mp4;codecs=avc1.64001E", "video/mp4;codecs=avc3.42001E", "video/mp4;codecs=avc1.42001E", "video/mp4;codecs=avc1.4D001E", "video/mp4;codecs=avc1.58001E", "video/mp4;codecs=avc1.64001E", "video/mp4;codecs=avc3.42001E", "video/webm;codecs=avc1", "video/x-matroska;codecs=avc1.4d000c", "video/x-matroska;codecs=avc1.42000c", "video/webm;codecs=vp8", "video/webm", "video/mp4"];

        const supportedTypes = mimeTypes.filter((type) => MediaRecorder.isTypeSupported(type));

        capabilityResults.push({ name: `MediaStream Recording API - <span title="${supportedTypes.join(", ")}">Supported recording formats: ${supportedTypes.length || 0}</span>`, supported: true });
      } else {
        capabilityResults.push({ name: "MediaStream Recording API", supported: false });
      }

      if (typeof ImageCapture !== "undefined") {
        capabilities.push("Photo capture");
        capabilityResults.push({ name: "MediaStream Image Capture API", supported: true });
      } else {
        capabilityResults.push({ name: "MediaStream Image Capture API", supported: false });
      }

      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        capabilities.push("Screen sharing");
        capabilityResults.push({ name: "Screen Capture API", supported: true });
      } else {
        capabilityResults.push({ name: "Screen Capture API", supported: false });
      }

      if (typeof AudioContext !== "undefined" || typeof webkitAudioContext !== "undefined") {
        capabilities.push("Audio processing");
        capabilityResults.push({ name: "Web Audio API", supported: true });
      } else {
        capabilityResults.push({ name: "Web Audio API", supported: false });
      }

      let capabilityInfo = "";
      capabilityResults.forEach((result) => {
        const status = result.supported ? "✅" : "❌";
        capabilityInfo += `<div class="capability-item"><span class="capability-status">${status}</span>${result.name}</div>`;
      });

      if (capabilities.length > 0) {
        this.addTestResult("otherApis", "✅", `Other APIs: ${capabilities.join(", ")}`, "success", null, true, capabilityInfo);
      } else {
        this.addTestResult("otherApis", "⚠️", "Limited other APIs available", "warning", null, true, capabilityInfo);
      }
    }

    async redoTest(testId) {
      const testMap = {
        getUserMedia: () => this.testGetUserMedia(),
        secureContext: () => this.testSecureContext(),
        permissionsPolicy: () => this.testPermissionsPolicy(),
        permissionsApi: () => this.testPermissionsApi(),
        cameraPermissions: () => this.testCameraPermissions(),
        micPermissions: () => this.testMicPermissions(),
        devices: () => this.testDeviceEnumeration(),
        capture: () => this.testMediaCapture(),
        resolutions: () => this.testResolutions(),
        lighting: () => this.testLighting(),
        otherApis: () => this.testOtherApisCapabilities(),
      };

      if (testMap[testId]) {
        try {
          await testMap[testId]();
          this.setLoadingState("", false);
        } catch (error) {
          this.setLoadingState("", false);
          if (this.callbacks.onError) {
            this.callbacks.onError(testId, error);
          }
        }
      }
    }

    sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    getTestResults() {
      return { ...this.testResults };
    }

    isRunning() {
      return this.isTestRunning;
    }

    getCurrentStream() {
      return this.currentStream;
    }

    getSelectedCameraInfo() {
      return {
        deviceId: this.selectedCameraId,
        deviceLabel: this.getSelectedCameraLabel(),
      };
    }

    getSelectedMicrophoneInfo() {
      return {
        deviceId: this.selectedMicrophoneId,
        deviceLabel: this.getSelectedMicrophoneLabel(),
      };
    }

    handleExport() {
      const formatSelect = document.getElementById(`export-format-${this.containerId}`);
      const format = formatSelect ? formatSelect.value : "markdown";

      const exportData = this.prepareExportData();

      let content = "";
      let filename = "";
      let mimeType = "";

      const timestamp = this.formatTimestamp(new Date());
      const fileTimestamp = timestamp.replace(/[: ]/g, "-").replace(/,/g, "");

      switch (format) {
        case "json":
          content = this.exportToJson(exportData);
          filename = `webcam-test-results-${fileTimestamp}.json`;
          mimeType = "application/json";
          break;
        case "csv":
          content = this.exportToCsv(exportData);
          filename = `webcam-test-results-${fileTimestamp}.csv`;
          mimeType = "text/csv";
          break;
        case "xml":
          content = this.exportToXml(exportData);
          filename = `webcam-test-results-${fileTimestamp}.xml`;
          mimeType = "application/xml";
          break;
        case "markdown":
        default:
          content = this.exportToMarkdown(exportData);
          filename = `webcam-test-results-${fileTimestamp}.md`;
          mimeType = "text/markdown";
          break;
      }

      this.downloadFile(content, filename, mimeType);
    }

    prepareExportData() {
      const browserInfo = this.getBrowserInfo();
      const timestamp = new Date();

      return {
        meta: {
          title: "Webcam Test Results by webcam-tester.js",
          version: "1.3.5",
          timestamp: timestamp.toISOString(),
          timestampFormatted: this.formatTimestamp(timestamp),
          browser: browserInfo,
          selectedCamera: {
            deviceId: this.selectedCameraId,
            label: this.getSelectedCameraLabel(),
          },
          selectedMicrophone: {
            deviceId: this.selectedMicrophoneId,
            label: this.getSelectedMicrophoneLabel(),
          },
        },
        results: Object.values(this.testResults).map((result) => ({
          id: result.id,
          status: result.type,
          icon: result.icon,
          message: result.message,
          details: result.details || null,
          timestamp: result.timestamp ? result.timestamp.toISOString() : null,
        })),
        summary: {
          total: Object.keys(this.testResults).length,
          passed: Object.values(this.testResults).filter((r) => r.type === "success").length,
          warnings: Object.values(this.testResults).filter((r) => r.type === "warning").length,
          failed: Object.values(this.testResults).filter((r) => r.type === "error").length,
          info: Object.values(this.testResults).filter((r) => r.type === "info").length,
        },
      };
    }

    getBrowserInfo() {
      const ua = navigator.userAgent;
      let browserName = "Unknown";
      let browserVersion = "Unknown";
      let os = "Unknown";

      // Detect browser
      if (ua.indexOf("Firefox") > -1) {
        browserName = "Firefox";
        browserVersion = ua.match(/Firefox\/(\d+(\.\d+)?)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Edg") > -1) {
        browserName = "Microsoft Edge";
        browserVersion = ua.match(/Edg\/(\d+(\.\d+)?)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Chrome") > -1) {
        browserName = "Chrome";
        browserVersion = ua.match(/Chrome\/(\d+(\.\d+)?)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Safari") > -1) {
        browserName = "Safari";
        browserVersion = ua.match(/Version\/(\d+(\.\d+)?)/)?.[1] || "Unknown";
      } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
        browserName = "Opera";
        browserVersion = ua.match(/(?:Opera|OPR)\/(\d+(\.\d+)?)/)?.[1] || "Unknown";
      }

      // Detect OS
      if (ua.indexOf("Windows") > -1) {
        os = "Windows";
        if (ua.indexOf("Windows NT 10.0") > -1) os = "Windows 10/11";
        else if (ua.indexOf("Windows NT 6.3") > -1) os = "Windows 8.1";
        else if (ua.indexOf("Windows NT 6.2") > -1) os = "Windows 8";
        else if (ua.indexOf("Windows NT 6.1") > -1) os = "Windows 7";
      } else if (ua.indexOf("Mac OS X") > -1) {
        os = "macOS";
        const version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace("_", ".");
        if (version) os = `macOS ${version}`;
      } else if (ua.indexOf("Linux") > -1) {
        os = "Linux";
        if (ua.indexOf("Android") > -1) {
          os = "Android";
          const version = ua.match(/Android (\d+(\.\d+)?)/)?.[1];
          if (version) os = `Android ${version}`;
        }
      } else if (ua.indexOf("iPhone") > -1 || ua.indexOf("iPad") > -1) {
        os = "iOS";
        const version = ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace("_", ".");
        if (version) os = `iOS ${version}`;
      }

      return {
        name: browserName,
        version: browserVersion,
        os: os,
        userAgent: ua,
        language: navigator.language || "Unknown",
        cookiesEnabled: navigator.cookieEnabled,
        online: navigator.onLine,
      };
    }

    formatTimestamp(date) {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
    }

    exportToMarkdown(data) {
      let md = `# ${data.meta.title} - version ${data.meta.version}\n\n`;
      md += `**Generated:** ${data.meta.timestampFormatted}\n\n`;

      md += `## Environment\n\n`;
      md += `| Property | Value |\n`;
      md += `|----------|-------|\n`;
      md += `| Browser | ${data.meta.browser.name} ${data.meta.browser.version} |\n`;
      md += `| Operating System | ${data.meta.browser.os} |\n`;
      md += `| Language | ${data.meta.browser.language} |\n`;
      md += `| Online | ${data.meta.browser.online ? "Yes" : "No"} |\n`;
      md += `| User Agent | ${data.meta.browser.userAgent} |\n\n`;

      md += `## Selected Devices\n\n`;
      md += `| Device | Name |\n`;
      md += `|--------|------|\n`;
      md += `| Camera | ${data.meta.selectedCamera.label || "Not selected"} |\n`;
      md += `| Microphone | ${data.meta.selectedMicrophone.label || "Not selected"} |\n\n`;

      md += `## Test Summary\n\n`;
      md += `| Status | Count |\n`;
      md += `|--------|-------|\n`;
      md += `| Total Tests | ${data.summary.total} |\n`;
      md += `| Passed | ${data.summary.passed} |\n`;
      md += `| Warnings | ${data.summary.warnings} |\n`;
      md += `| Failed | ${data.summary.failed} |\n\n`;

      md += `## Test Results\n\n`;
      md += `| Status | Test | Message | Details |\n`;
      md += `|--------|------|---------|--------|\n`;

      data.results.forEach((result) => {
        const statusEmoji = result.icon;
        const details = result.details ? result.details.replace(/\|/g, "\\|") : "-";
        const message = result.message.replace(/\|/g, "\\|");
        md += `| ${statusEmoji} | ${result.id} | ${message} | ${details} |\n`;
      });

      md += `\n---\n*Generated by Webcam Tester Library*\n`;

      return md;
    }

    exportToJson(data) {
      return JSON.stringify(data, null, 2);
    }

    exportToCsv(data) {
      const escapeCSV = (str) => {
        if (str === null || str === undefined) return "";
        const s = String(str);
        if (s.includes(",") || s.includes('"') || s.includes("\n")) {
          return `"${s.replace(/"/g, '""')}"`;
        }
        return s;
      };

      let csv = "";

      // Meta section
      csv += `${data.meta.title} - version ${data.meta.version}\n`;
      csv += `Generated,${escapeCSV(data.meta.timestampFormatted)}\n\n`;

      // Environment section
      csv += "ENVIRONMENT\n";
      csv += "Property,Value\n";
      csv += `Browser,${escapeCSV(data.meta.browser.name + " " + data.meta.browser.version)}\n`;
      csv += `Operating System,${escapeCSV(data.meta.browser.os)}\n`;
      csv += `Language,${escapeCSV(data.meta.browser.language)}\n`;
      csv += `Online,${data.meta.browser.online ? "Yes" : "No"}\n`;
      csv += `User Agent,${escapeCSV(data.meta.browser.userAgent)}\n\n`;

      // Devices section
      csv += "SELECTED DEVICES\n";
      csv += "Device,Name\n";
      csv += `Camera,${escapeCSV(data.meta.selectedCamera.label || "Not selected")}\n`;
      csv += `Microphone,${escapeCSV(data.meta.selectedMicrophone.label || "Not selected")}\n\n`;

      // Summary section
      csv += "SUMMARY\n";
      csv += "Metric,Count\n";
      csv += `Total Tests,${data.summary.total}\n`;
      csv += `Passed,${data.summary.passed}\n`;
      csv += `Warnings,${data.summary.warnings}\n`;
      csv += `Failed,${data.summary.failed}\n\n`;

      // Results section
      csv += "TEST RESULTS\n";
      csv += "Status,Test ID,Message,Details,Timestamp\n";

      data.results.forEach((result) => {
        csv += `${escapeCSV(result.status)},${escapeCSV(result.id)},${escapeCSV(result.message)},${escapeCSV(result.details || "")},${escapeCSV(result.timestamp || "")}\n`;
      });

      return csv;
    }

    exportToXml(data) {
      const escapeXml = (str) => {
        if (str === null || str === undefined) return "";
        return String(str)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&apos;");
      };

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<webcamTestResults>\n`;

      // Meta
      xml += `  <meta>\n`;
      xml += `    <title>${escapeXml(data.meta.title)}</title>\n`;
      xml += `    <version>${escapeXml(data.meta.version)}</version>\n`;
      xml += `    <timestamp>${escapeXml(data.meta.timestamp)}</timestamp>\n`;
      xml += `    <timestampFormatted>${escapeXml(data.meta.timestampFormatted)}</timestampFormatted>\n`;
      xml += `    <browser>\n`;
      xml += `      <name>${escapeXml(data.meta.browser.name)}</name>\n`;
      xml += `      <version>${escapeXml(data.meta.browser.version)}</version>\n`;
      xml += `      <os>${escapeXml(data.meta.browser.os)}</os>\n`;
      xml += `      <userAgent>${escapeXml(data.meta.browser.userAgent)}</userAgent>\n`;
      xml += `      <language>${escapeXml(data.meta.browser.language)}</language>\n`;
      xml += `      <cookiesEnabled>${data.meta.browser.cookiesEnabled}</cookiesEnabled>\n`;
      xml += `      <online>${data.meta.browser.online}</online>\n`;
      xml += `    </browser>\n`;
      xml += `    <selectedCamera>\n`;
      xml += `      <deviceId>${escapeXml(data.meta.selectedCamera.deviceId || "")}</deviceId>\n`;
      xml += `      <label>${escapeXml(data.meta.selectedCamera.label || "")}</label>\n`;
      xml += `    </selectedCamera>\n`;
      xml += `    <selectedMicrophone>\n`;
      xml += `      <deviceId>${escapeXml(data.meta.selectedMicrophone.deviceId || "")}</deviceId>\n`;
      xml += `      <label>${escapeXml(data.meta.selectedMicrophone.label || "")}</label>\n`;
      xml += `    </selectedMicrophone>\n`;
      xml += `  </meta>\n`;

      // Summary
      xml += `  <summary>\n`;
      xml += `    <total>${data.summary.total}</total>\n`;
      xml += `    <passed>${data.summary.passed}</passed>\n`;
      xml += `    <warnings>${data.summary.warnings}</warnings>\n`;
      xml += `    <failed>${data.summary.failed}</failed>\n`;
      xml += `    <info>${data.summary.info}</info>\n`;
      xml += `  </summary>\n`;

      // Results
      xml += `  <results>\n`;
      data.results.forEach((result) => {
        xml += `    <test>\n`;
        xml += `      <id>${escapeXml(result.id)}</id>\n`;
        xml += `      <status>${escapeXml(result.status)}</status>\n`;
        xml += `      <icon>${escapeXml(result.icon)}</icon>\n`;
        xml += `      <message>${escapeXml(result.message)}</message>\n`;
        xml += `      <details>${escapeXml(result.details || "")}</details>\n`;
        xml += `      <timestamp>${escapeXml(result.timestamp || "")}</timestamp>\n`;
        xml += `    </test>\n`;
      });
      xml += `  </results>\n`;

      xml += `</webcamTestResults>\n`;

      return xml;
    }

    downloadFile(content, filename, mimeType) {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    destroy() {
      if (this.currentStream) {
        this.currentStream.getTracks().forEach((track) => track.stop());
      }
      if (this.container && this.container.parentNode) {
        this.container.parentNode.removeChild(this.container);
      }
      if (typeof window !== "undefined" && window[this.instanceId]) {
        delete window[this.instanceId];
      }
    }
  }

  function insertWebcamTestLibrary(containerId, config = {}) {
    const instanceId = `mediaTesterInstance_${Math.random().toString(36).substr(2, 9)}`;
    const instance = new WebcamDeviceTester(containerId, config, instanceId);
    if (typeof window !== "undefined") {
      window[instanceId] = instance;
    }
    return instance;
  }

  return {
    insertWebcamTestLibrary,
    WebcamDeviceTester,
  };
});
