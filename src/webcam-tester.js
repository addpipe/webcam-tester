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
    tests: ["getUserMedia", "secureContext", "permissionsPolicy", "cameraPermissions", "micPermissions", "devices", "capture", "resolutions", "lighting", "otherApis"],
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

      html += `<div class="copyright">Made by the <a href="https://addpipe.com/" target="_blank">Pipe recording platform</div>`;

      if (this.config.showResults) {
        html += `<div class="results-section" id="results-section-${this.containerId}"></div>`;
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

      if (typeof window !== "undefined") {
        window.addEventListener("beforeunload", () => {
          if (this.currentStream) {
            this.currentStream.getTracks().forEach((track) => track.stop());
          }
        });
      }
    }

    async handleStartTest() {
      const needsCameraSelection = this.config.allowCameraSelection && this.config.tests.includes("cameraPermissions");
      const needsMicSelection = this.config.allowMicSelection && this.config.tests.includes("micPermissions");

      if (needsCameraSelection) {
        await this.showCameraSelection();
      } else if (needsMicSelection) {
        await this.showMicrophoneSelection();
      } else {
        await this.startTest();
      }
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
          alert("No cameras found on your device.");
          return;
        }

        if (this.availableCameras.length === 1) {
          this.selectedCameraId = this.availableCameras[0].deviceId;
          this.setLoadingState("", false);

          const needsMicSelection = this.config.allowMicSelection && this.config.tests.includes("micPermissions");
          if (needsMicSelection) {
            await this.showMicrophoneSelection();
          } else {
            await this.startTest();
          }
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
      } catch (error) {
        this.setLoadingState("", false);
        console.error("Error detecting cameras:", error);
        alert("Failed to detect cameras. Please check your permissions and try again.");
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

      const needsMicSelection = this.config.allowMicSelection && this.config.tests.includes("micPermissions");
      if (needsMicSelection) {
        await this.showMicrophoneSelection();
      } else {
        await this.startTest();
      }
    }

    cancelCameraSelection() {
      const selectionDiv = document.getElementById(`camera-selection-${this.containerId}`);
      const mainButton = document.getElementById(`main-button-${this.containerId}`);

      if (selectionDiv && mainButton) {
        selectionDiv.classList.remove("active");
        mainButton.style.display = "inline-block";
      }
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
          alert("No microphones found on your device.");
          return;
        }

        if (this.availableMicrophones.length === 1) {
          this.selectedMicrophoneId = this.availableMicrophones[0].deviceId;
          this.setLoadingState("", false);
          await this.startTest();
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
      } catch (error) {
        this.setLoadingState("", false);
        console.error("Error detecting microphones:", error);
        alert("Failed to detect microphones. Please check your permissions and try again.");
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

      await this.startTest();
    }

    cancelMicrophoneSelection() {
      const selectionDiv = document.getElementById(`mic-selection-${this.containerId}`);
      const mainButton = document.getElementById(`main-button-${this.containerId}`);

      if (selectionDiv && mainButton) {
        selectionDiv.classList.remove("active");
        mainButton.style.display = "inline-block";
      }
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
        cameraPermissions: () => this.testCameraPermissions(),
        micPermissions: () => this.testMicPermissions(),
        devices: () => this.testDeviceEnumeration(),
        capture: () => this.testMediaCapture(),
        resolutions: () => this.testResolutions(),
        lighting: () => this.testLighting(),
        otherApis: () => this.testOtherApisCapabilities(),
      };

      for (const testName of this.config.tests) {
        if (testMap[testName]) {
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
          status = "❌";
          statusText = "Blocked by policy";
        }

        policyInfo += `<div class="capability-item"><span class="capability-status">${status}</span>${result.name}: ${statusText}</div>`;
      });

      // Determine result type and message
      if (hasIssues) {
        this.addTestResult("permissionsPolicy", "⚠️", "Some features blocked by Permissions Policy", "warning", `Policies: ${policies.join(", ")}`, true, policyInfo);
      } else {
        this.addTestResult("permissionsPolicy", "✅", "Camera & Microphone allowed by Permissions Policy", "success", `Policies: ${policies.join(", ")}`, true, policyInfo);
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
