"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Html5Qrcode = /*#__PURE__*/function () {
  
  function Html5Qrcode(elementId) {
    _classCallCheck(this, Html5Qrcode);

    if (!qrcode) {
      throw 'qrcode is not defined, use the minified/html5-qrcode.min.js for proper support';
    }

    this._elementId = elementId;
    this._foreverScanTimeout = null;
    this._localMediaStream = null;
    this._shouldScan = true;
    this._url = window.URL || window.webkitURL || window.mozURL || window.msURL;
    this._userMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    this._isScanning = false;
  }


  _createClass(Html5Qrcode, [{
    key: "start",
    value: function start(cameraId, configuration, qrCodeSuccessCallback, qrCodeErrorCallback) {
      var _this = this;

      if (!cameraId) {
        throw "cameraId is required";
      }

      if (!qrCodeSuccessCallback || typeof qrCodeSuccessCallback != "function") {
        throw "qrCodeSuccessCallback is required and should be a function.";
      }

      if (!qrCodeErrorCallback) {
        qrCodeErrorCallback = console.log;
      }


      this._clearElement();

      var $this = this;

      var config = configuration ? configuration : {};
      config.fps = config.fps ? config.fps : Html5Qrcode.SCAN_DEFAULT_FPS; // qr shaded box

      var isShadedBoxEnabled = config.qrbox != undefined;
      var element = document.getElementById(this._elementId);
      var width = element.clientWidth ? element.clientWidth : Html5Qrcode.DEFAULT_WIDTH;
      element.style.position = "relative";
      this._shouldScan = true;
      this._element = element;
      qrcode.callback = qrCodeSuccessCallback;

      if (isShadedBoxEnabled) {
        var qrboxSize = config.qrbox;

        if (qrboxSize < Html5Qrcode.MIN_QR_BOX_SIZE) {
          throw "minimum size of 'config.qrbox' is ".concat(Html5Qrcode.MIN_QR_BOX_SIZE, "px.");
        }

        if (qrboxSize > width) {
          throw "'config.qrbox' should not be greater than the " + "width of the HTML element.";
        }
      }

      var setupUi = function setupUi(width, height) {
        var qrboxSize = config.qrbox;

        if (qrboxSize > height) {
          console.warn("[Html5Qrcode] config.qrboxsize is greater " + "than video height. Shading will be ignored");
        }

        var shouldShadingBeApplied = isShadedBoxEnabled && qrboxSize <= height;
        var defaultQrRegion = {
          x: 0,
          y: 0,
          width: width,
          height: height
        };
        var qrRegion = shouldShadingBeApplied ? _this._getShadedRegionBounds(width, height, qrboxSize) : defaultQrRegion;

        var canvasElement = _this._createCanvasElement(qrRegion.width, qrRegion.height);

        var context = canvasElement.getContext('2d');
        context.canvas.width = qrRegion.width;
        context.canvas.height = qrRegion.height; // Insert the canvas

        element.append(canvasElement);

        if (shouldShadingBeApplied) {
          _this._possiblyInsertShadingElement(element, height, qrRegion);
        }


        $this._qrRegion = qrRegion;
        $this._context = context;
        $this._canvasElement = canvasElement;
      };


      var foreverScan = function foreverScan() {
        if (!$this._shouldScan) {
          return;
        }

        if ($this._localMediaStream) {
          var videoElement = $this._videoElement;
          var widthRatio = videoElement.videoWidth / videoElement.clientWidth;
          var heightRatio = videoElement.videoHeight / videoElement.clientHeight;
          var sWidthOffset = $this._qrRegion.width * widthRatio;
          var sHeightOffset = $this._qrRegion.height * heightRatio;

          $this._context.drawImage($this._videoElement,
         
          $this._qrRegion.x,
          
          $this._qrRegion.y,
          
          sWidthOffset,
         
          sHeightOffset,
        
          0,
          
          0,
          
          $this._qrRegion.width,
          
          $this._qrRegion.height);

          try {
            qrcode.decode();

            _this._possiblyUpdateShaders(
            
            true);
          } catch (exception) {
            _this._possiblyUpdateShaders(
            
            false);

            qrCodeErrorCallback("QR code parse error, error = ".concat(exception));
          }
        }

        $this._foreverScanTimeout = setTimeout(foreverScan, Html5Qrcode._getTimeoutFps(config.fps));
      };


      var onMediaStreamReceived = function onMediaStreamReceived(mediaStream) {
        return new Promise(function (resolve, reject) {
          var setupVideo = function setupVideo() {
            var videoElement = _this._createVideoElement(width);

            $this._element.append(videoElement); // Attach listeners to video.


            videoElement.onabort = reject;
            videoElement.onerror = reject;

            videoElement.onplaying = function () {
              var videoWidth = videoElement.clientWidth;
              var videoHeight = videoElement.clientHeight;
              setupUi(videoWidth, videoHeight);

              foreverScan();
              resolve();
            };

            videoElement.srcObject = mediaStream;
            videoElement.play();

            $this._videoElement = videoElement;
          };

          $this._localMediaStream = mediaStream;
          setupVideo();
        });
      };]


      return new Promise(function (resolve, reject) {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          var videoConstraints = {
            deviceId: {
              exact: cameraId
            }
          };
          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: videoConstraints
          }).then(function (stream) {
            onMediaStreamReceived(stream).then(function (_) {
              $this._isScanning = true;
              resolve();
            })["catch"](reject);
          })["catch"](function (err) {
            reject("Error getting userMedia, error = ".concat(err));
          });
        } else if (navigator.getUserMedia) {
          var getCameraConfig = {
            video: {
              optional: [{
                sourceId: cameraId
              }]
            }
          };
          navigator.getUserMedia(getCameraConfig, function (stream) {
            onMediaStreamReceived(stream).then(function (_) {
              $this._isScanning = true;
              resolve();
            })["catch"](reject);
          }, function (err) {
            reject("Error getting userMedia, error = ".concat(err));
          });
        } else {
          reject("Web camera streaming not supported by the browser.");
        }
      });
    }

  }, {
    key: "stop",
    value: function stop() {
     
      this._shouldScan = false;
      clearTimeout(this._foreverScanTimeout);
      var $this = this;
      return new Promise(function (resolve,
      
      reject) {
        qrcode.callback = null;

        var tracksToClose = $this._localMediaStream.getVideoTracks().length;

        var tracksClosed = 0;

        var removeQrRegion = function removeQrRegion() {
          while ($this._element.getElementsByClassName(Html5Qrcode.SHADED_REGION_CLASSNAME).length) {
            var shadedChild = $this._element.getElementsByClassName(Html5Qrcode.SHADED_REGION_CLASSNAME)[0];

            $this._element.removeChild(shadedChild);
          }
        };

        var onAllTracksClosed = function onAllTracksClosed() {
          $this._localMediaStream = null;

          $this._element.removeChild($this._videoElement);

          $this._element.removeChild($this._canvasElement);

          removeQrRegion();
          $this._isScanning = false;

          if ($this._qrRegion) {
            $this._qrRegion = null;
          }

          if ($this._context) {
            $this._context = null;
          }

          resolve(true);
        };

        $this._localMediaStream.getVideoTracks().forEach(function (videoTrack) {
          videoTrack.stop();
          ++tracksClosed;

          if (tracksClosed >= tracksToClose) {
            onAllTracksClosed();
          }
        });
      });
    }

  }, {
    key: "scanFile",
    value: function scanFile(imageFile,
    
    showImage) {
      var $this = this;

      if (!imageFile || !(imageFile instanceof File)) {
        throw "imageFile argument is mandatory and should be instance " + "of File. Use 'event.target.files[0]'";
      }

      showImage = showImage === undefined ? true : showImage;

      if ($this._isScanning) {
        throw "Close ongoing scan before scanning a file.";
      }

      var computeCanvasDrawConfig = function computeCanvasDrawConfig(imageWidth, imageHeight, containerWidth, containerHeight) {
        if (imageWidth <= containerWidth && imageHeight <= containerHeight) {
          
          var xoffset = (containerWidth - imageWidth) / 2;
          var yoffset = (containerHeight - imageHeight) / 2;
          return {
            x: xoffset,
            y: yoffset,
            width: imageWidth,
            height: imageHeight
          };
        } else {
          var formerImageWidth = imageWidth;
          var formerImageHeight = imageHeight;

          if (imageWidth > containerWidth) {
            imageHeight = containerWidth / imageWidth * imageHeight;
            imageWidth = containerWidth;
          }

          if (imageHeight > containerHeight) {
            imageWidth = containerHeight / imageHeight * imageWidth;
            imageHeight = containerHeight;
          }

          Html5Qrcode._log("Image downsampled from ".concat(formerImageWidth, "X").concat(formerImageHeight) + " to ".concat(imageWidth, "X").concat(imageHeight, "."));

          return computeCanvasDrawConfig(imageWidth, imageHeight, containerWidth, containerHeight);
        }
      };

      return new Promise(function (resolve, reject) {
        $this._possiblyCloseLastScanImageFile();

        $this._clearElement();

        $this._lastScanImageFile = imageFile;
        var inputImage = new Image();

        inputImage.onload = function () {
          var imageWidth = inputImage.width;
          var imageHeight = inputImage.height;
          var element = document.getElementById($this._elementId);
          var containerWidth = element.clientWidth ? element.clientWidth : Html5Qrcode.DEFAULT_WIDTH; // No default height anymore.

          var containerHeight = element.clientHeight ? element.clientHeight : imageHeight;
          var config = computeCanvasDrawConfig(imageWidth, imageHeight, containerWidth, containerHeight);

          if (showImage) {
            var visibleCanvas = $this._createCanvasElement(containerWidth, containerHeight, 'qr-canvas-visible');

            visibleCanvas.style.display = "inline-block";
            element.appendChild(visibleCanvas);

            var _context = visibleCanvas.getContext('2d');

            _context.canvas.width = containerWidth;
            _context.canvas.height = containerHeight;

            _context.drawImage(inputImage,
            
            0,
            
            0,
            
            imageWidth,
            
            imageHeight,
            
            config.x,
            
            config.y,
            
            config.width,
            
            config.height);
          }

          var hiddenCanvas = $this._createCanvasElement(config.width, config.height);

          element.appendChild(hiddenCanvas);
          var context = hiddenCanvas.getContext('2d');
          context.canvas.width = config.width;
          context.canvas.height = config.height;
          context.drawImage(inputImage,
          
          0,
          
          0,
          
          imageWidth,
          
          imageHeight,
          
          0,
          
          0,
          
          config.width,
          
          config.height);

          try {
            resolve(qrcode.decode());
          } catch (exception) {
            reject("QR code parse error, error = ".concat(exception));
          }
        };

        inputImage.onerror = reject;
        inputImage.onabort = reject;
        inputImage.onstalled = reject;
        inputImage.onsuspend = reject;
        inputImage.src = URL.createObjectURL(imageFile);
      });
    }
    

  }, {
    key: "clear",
    value: function clear() {
      this._clearElement();
    }
    

  }, {
    key: "_clearElement",
    value: function _clearElement() {
      if (this._isScanning) {
        throw 'Cannot clear while scan is ongoing, close it first.';
      }

      var element = document.getElementById(this._elementId);
      element.innerHTML = "";
    }
  }, {
    key: "_createCanvasElement",
    value: function _createCanvasElement(width, height, customId) {
      var canvasWidth = width;
      var canvasHeight = height;
      var canvasElement = document.createElement('canvas');
      canvasElement.style.width = "".concat(canvasWidth, "px");
      canvasElement.style.height = "".concat(canvasHeight, "px");
      canvasElement.style.display = "none"; // This id is set by lazarsoft/jsqrcode

      canvasElement.id = customId == undefined ? 'qr-canvas' : customId;
      return canvasElement;
    }
  }, {
    key: "_createVideoElement",
    value: function _createVideoElement(width) {
      var videoElement = document.createElement('video');
      videoElement.style.width = "".concat(width, "px");
      videoElement.muted = true;
      videoElement.playsInline = true;
      return videoElement;
    }
  }, {
    key: "_getShadedRegionBounds",
    value: function _getShadedRegionBounds(width, height, qrboxSize) {
      if (qrboxSize > width || qrboxSize > height) {
        throw "'config.qrbox' should not be greater than the " + "width and height of the HTML element.";
      }

      return {
        x: (width - qrboxSize) / 2,
        y: (height - qrboxSize) / 2,
        width: qrboxSize,
        height: qrboxSize
      };
    }
  }, {
    key: "_possiblyInsertShadingElement",
    value: function _possiblyInsertShadingElement(element, height, qrRegion) {
      var _this2 = this;

      if (qrRegion.x == 0 && qrRegion.y == 0) {
        // No shading
        return;
      }

      var shaders = {};
      shaders[Html5Qrcode.SHADED_LEFT] = this._createShadedElement(height, qrRegion, Html5Qrcode.SHADED_LEFT);
      shaders[Html5Qrcode.SHADED_RIGHT] = this._createShadedElement(height, qrRegion, Html5Qrcode.SHADED_RIGHT);
      shaders[Html5Qrcode.SHADED_TOP] = this._createShadedElement(height, qrRegion, Html5Qrcode.SHADED_TOP);
      shaders[Html5Qrcode.SHADED_BOTTOM] = this._createShadedElement(height, qrRegion, Html5Qrcode.SHADED_BOTTOM);
      Object.keys(shaders).forEach(function (key) {
        return element.append(shaders[key]);
      });

      if (qrRegion.x < 10 || qrRegion.y < 10) {
        this.hasBorderShaders = false;
      } else {
        Object.keys(shaders).forEach(function (key) {
          return _this2._insertShaderBorders(shaders[key], qrRegion, key);
        });
        this.hasBorderShaders = true;
      }
    }
  }, {
    key: "_createShadedElement",
    value: function _createShadedElement(height, qrRegion, shadingPosition) {
      var elem = document.createElement('div');
      elem.style.position = "absolute";
      elem.style.height = "".concat(height, "px");
      elem.className = Html5Qrcode.SHADED_REGION_CLASSNAME;
      elem.id = "".concat(Html5Qrcode.SHADED_REGION_CLASSNAME, "_").concat(shadingPosition); // TODO(mebjas): maken this configurable

      elem.style.background = "#0000007a";

      switch (shadingPosition) {
        case Html5Qrcode.SHADED_LEFT:
          elem.style.top = "0px";
          elem.style.left = "0px";
          elem.style.width = "".concat(qrRegion.x, "px");
          elem.style.height = "".concat(height, "px");
          break;

        case Html5Qrcode.SHADED_RIGHT:
          elem.style.top = "0px";
          elem.style.right = "0px";
          elem.style.width = "".concat(qrRegion.x, "px");
          elem.style.height = "".concat(height, "px");
          break;

        case Html5Qrcode.SHADED_TOP:
          elem.style.top = "0px";
          elem.style.left = "".concat(qrRegion.x, "px");
          elem.style.width = "".concat(qrRegion.width, "px");
          elem.style.height = "".concat(qrRegion.y, "px");
          break;

        case Html5Qrcode.SHADED_BOTTOM:
          var top = qrRegion.y + qrRegion.height;
          elem.style.top = "".concat(top, "px");
          elem.style.left = "".concat(qrRegion.x, "px");
          elem.style.width = "".concat(qrRegion.width, "px");
          elem.style.height = "".concat(qrRegion.y, "px");
          break;

        default:
          throw "Unsupported shadingPosition";
      }

      return elem;
    }
  }, {
    key: "_insertShaderBorders",
    value: function _insertShaderBorders(shaderElem, qrRegion, shadingPosition) {
      shadingPosition = parseInt(shadingPosition);
      var $this = this;
      var borderOffset = 5;
      var smallSize = 5;
      var largeSize = 40;

      var createBorder = function createBorder() {
        var elem = document.createElement("div");
        elem.style.position = "absolute";
        elem.style.backgroundColor = Html5Qrcode.BORDER_SHADER_DEFAULT_COLOR;

        switch (shadingPosition) {
          case Html5Qrcode.SHADED_LEFT: // intentional

          case Html5Qrcode.SHADED_RIGHT:
            var height = largeSize + borderOffset;
            elem.style.width = "".concat(smallSize, "px");
            elem.style.height = "".concat(height, "px");
            break;

          case Html5Qrcode.SHADED_TOP: // intentional

          case Html5Qrcode.SHADED_BOTTOM:
            var width = largeSize + borderOffset;
            elem.style.width = "".concat(width, "px");
            elem.style.height = "".concat(smallSize, "px");
            break;

          default:
            throw "Unsupported shadingPosition";
        }

        return elem;
      };

      var insertBorder = function insertBorder(top, left) {
        if (!(top !== null && left !== null)) {
          throw "Shaders should have defined positions";
        }

        var borderElem = createBorder();
        borderElem.style.top = "".concat(top, "px");
        borderElem.style.left = "".concat(left, "px");
        shaderElem.appendChild(borderElem);

        if (!$this.borderShaders) {
          $this.borderShaders = [];
        }

        $this.borderShaders.push(borderElem);
      };

      var firstTop = null;
      var firstLeft = null;
      var secondTop = null;
      var secondLeft = null;

      switch (shadingPosition) {
        case Html5Qrcode.SHADED_LEFT:
          firstTop = qrRegion.y - borderOffset;
          firstLeft = qrRegion.x - smallSize;
          secondTop = qrRegion.y + qrRegion.height - largeSize;
          secondLeft = firstLeft;
          break;

        case Html5Qrcode.SHADED_RIGHT:
          firstTop = qrRegion.y - borderOffset;
          firstLeft = 0;
          secondTop = qrRegion.y + qrRegion.height - largeSize;
          secondLeft = firstLeft;
          break;

        case Html5Qrcode.SHADED_TOP:
          firstTop = qrRegion.y - borderOffset;
          firstLeft = -smallSize;
          secondTop = firstTop;
          secondLeft = qrRegion.width - largeSize;
          break;

        case Html5Qrcode.SHADED_BOTTOM:
          firstTop = 0;
          firstLeft = -smallSize;
          secondTop = firstTop;
          secondLeft = qrRegion.width - largeSize;
          break;

        default:
          throw "Unsupported shadingPosition";
      }

      insertBorder(firstTop, firstLeft);
      insertBorder(secondTop, secondLeft);
    }
  }, {
    key: "_possiblyUpdateShaders",
    value: function _possiblyUpdateShaders(qrMatch) {
      if (this.qrMatch === qrMatch) {
        return;
      }

      if (this.hasBorderShaders && this.borderShaders && this.borderShaders.length) {
        this.borderShaders.forEach(function (shader) {
          shader.style.backgroundColor = qrMatch ? Html5Qrcode.BORDER_SHADER_MATCH_COLOR : Html5Qrcode.BORDER_SHADER_DEFAULT_COLOR;
        });
      }

      this.qrMatch = qrMatch;
    }
  }, {
    key: "_possiblyCloseLastScanImageFile",
    value: function _possiblyCloseLastScanImageFile() {
      if (this._lastScanImageFile) {
        URL.revokeObjectURL(this._lastScanImageFile);
        this._lastScanImageFile = null;
      }
    }
  }], [{
    key: "getCameras",
    value: function getCameras() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices && navigator.mediaDevices.getUserMedia) {
          _this3._log("navigator.mediaDevices used");

          navigator.mediaDevices.getUserMedia({
            audio: false,
            video: true
          }).then(function (_) {
            navigator.mediaDevices.enumerateDevices().then(function (devices) {
              var results = [];

              for (var i = 0; i < devices.length; i++) {
                var device = devices[i];

                if (device.kind == "videoinput") {
                  results.push({
                    id: device.deviceId,
                    label: device.label
                  });
                }
              }

              _this3._log("".concat(results.length, " results found"));

              resolve(results);
            })["catch"](function (err) {
              reject("".concat(err.name, " : ").concat(err.message));
            });
          })["catch"](function (err) {
            reject("".concat(err.name, " : ").concat(err.message));
          });
        } else if (MediaStreamTrack && MediaStreamTrack.getSources) {
          _this3._log("MediaStreamTrack.getSources used");

          var callback = function callback(sourceInfos) {
            var results = [];

            for (var i = 0; i !== sourceInfos.length; ++i) {
              var sourceInfo = sourceInfos[i];

              if (sourceInfo.kind === 'video') {
                results.push({
                  id: sourceInfo.id,
                  label: sourceInfo.label
                });
              }
            }

            _this3._log("".concat(results.length, " results found"));

            resolve(results);
          };

          MediaStreamTrack.getSources(callback);
        } else {
          _this3._log("unable to query supported devices.");

          reject("unable to query supported devices.");
        }
      });
    }
  }, {
    key: "_getTimeoutFps",
    value: function _getTimeoutFps(fps) {
      return 1000 / fps;
    }
  }, {
    key: "_log",
    value: function _log(message) {
      if (Html5Qrcode.VERBOSE) {
        console.log(message);
      }
    }
  }]);

  return Html5Qrcode;
}();

_defineProperty(Html5Qrcode, "DEFAULT_WIDTH", 300);

_defineProperty(Html5Qrcode, "DEFAULT_WIDTH_OFFSET", 2);

_defineProperty(Html5Qrcode, "SCAN_DEFAULT_FPS", 2);

_defineProperty(Html5Qrcode, "MIN_QR_BOX_SIZE", 50);

_defineProperty(Html5Qrcode, "SHADED_LEFT", 1);

_defineProperty(Html5Qrcode, "SHADED_RIGHT", 2);

_defineProperty(Html5Qrcode, "SHADED_TOP", 3);

_defineProperty(Html5Qrcode, "SHADED_BOTTOM", 4);

_defineProperty(Html5Qrcode, "SHADED_REGION_CLASSNAME", "qr-shaded-region");

_defineProperty(Html5Qrcode, "VERBOSE", false);

_defineProperty(Html5Qrcode, "BORDER_SHADER_DEFAULT_COLOR", "#ffffff");

_defineProperty(Html5Qrcode, "BORDER_SHADER_MATCH_COLOR", "rgb(90, 193, 56)");