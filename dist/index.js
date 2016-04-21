'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _requireAll = require('require-all');

var _requireAll2 = _interopRequireDefault(_requireAll);

var _fs = require('mz/fs');

var _fs2 = _interopRequireDefault(_fs);

var _agenda = require('agenda');

var _agenda2 = _interopRequireDefault(_agenda);

var _base = require('magnet-core/dist/base');

var _base2 = _interopRequireDefault(_base);

var _agenda3 = require('./config/agenda');

var _agenda4 = _interopRequireDefault(_agenda3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { return step("next", value); }, function (err) { return step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Scheduler = function (_Base) {
  _inherits(Scheduler, _Base);

  function Scheduler() {
    _classCallCheck(this, Scheduler);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(Scheduler).apply(this, arguments));
  }

  _createClass(Scheduler, [{
    key: 'setup',
    value: function () {
      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var _this2 = this;

        var config, schedulers, folderPath, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _loop, _iterator, _step;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                config = Object.assign(_agenda4.default, this.app.config.agenda);
                schedulers = {};


                config.db.address = config.db.host + ':' + config.db.port + '/' + config.db.database;
                if (config.db.username || config.db.password) {
                  config.db.address = config.db.username + ':' + config.db.password + '@' + address;
                }

                _context2.prev = 4;
                folderPath = process.cwd() + '/server/schedulers';
                _context2.next = 8;
                return _fs2.default.exists(folderPath);

              case 8:
                schedulers = (0, _requireAll2.default)(folderPath);
                _context2.next = 14;
                break;

              case 11:
                _context2.prev = 11;
                _context2.t0 = _context2['catch'](4);

                this.log.warn(_context2.t0);

              case 14:

                this.app.agenda = new _agenda2.default(config);

                this.app.agenda.on('fail', function (err) {
                  _this2.log.error(err);
                });

                // Prepare scheduler
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 19;

                _loop = function _loop() {
                  var key = _step.value;

                  var scheduler = schedulers[key].default || schedulers[key];
                  var name = scheduler.name || key;
                  var processArgs = [name];
                  if (scheduler.options) {
                    processArgs.push(scheduler.options);
                  }

                  if (scheduler.process) {
                    processArgs.push(function () {
                      var ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(data, done) {
                        return regeneratorRuntime.wrap(function _callee$(_context) {
                          while (1) {
                            switch (_context.prev = _context.next) {
                              case 0:
                                _context.prev = 0;
                                _context.next = 3;
                                return scheduler.process.call(_this2, _this2.app, data);

                              case 3:
                                _context.t0 = _context.sent;
                                done(null, _context.t0);
                                _context.next = 10;
                                break;

                              case 7:
                                _context.prev = 7;
                                _context.t1 = _context['catch'](0);

                                done(_context.t1);

                              case 10:
                              case 'end':
                                return _context.stop();
                            }
                          }
                        }, _callee, _this2, [[0, 7]]);
                      }));

                      return function (_x, _x2) {
                        return ref.apply(this, arguments);
                      };
                    }());
                  } else {
                    _this2.log.warn('No process for ' + name);
                  }

                  _this2.app.agenda.define.apply(_this2.app.agenda, processArgs);
                };

                for (_iterator = Object.keys(schedulers)[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _loop();
                }

                _context2.next = 28;
                break;

              case 24:
                _context2.prev = 24;
                _context2.t1 = _context2['catch'](19);
                _didIteratorError = true;
                _iteratorError = _context2.t1;

              case 28:
                _context2.prev = 28;
                _context2.prev = 29;

                if (!_iteratorNormalCompletion && _iterator.return) {
                  _iterator.return();
                }

              case 31:
                _context2.prev = 31;

                if (!_didIteratorError) {
                  _context2.next = 34;
                  break;
                }

                throw _iteratorError;

              case 34:
                return _context2.finish(31);

              case 35:
                return _context2.finish(28);

              case 36:
                this.app.agenda.on('ready', function () {
                  var _iteratorNormalCompletion2 = true;
                  var _didIteratorError2 = false;
                  var _iteratorError2 = undefined;

                  try {
                    for (var _iterator2 = Object.keys(schedulers)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                      var key = _step2.value;

                      var scheduler = schedulers[key].default || schedulers[key];
                      var name = scheduler.name || key;

                      if (scheduler.every) {
                        _this2.app.agenda.every(scheduler.every, name);
                      } else if (scheduler.schedule) {
                        _this2.app.agenda.schedule(scheduler.schedule, name);
                      } else {
                        _this2.log.warn('No time schedule for ' + name);
                      }
                    }
                  } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                  } finally {
                    try {
                      if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                      }
                    } finally {
                      if (_didIteratorError2) {
                        throw _iteratorError2;
                      }
                    }
                  }

                  _this2.app.agenda.start();
                });

              case 37:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this, [[4, 11], [19, 24, 28, 36], [29,, 31, 35]]);
      }));

      function setup() {
        return ref.apply(this, arguments);
      }

      return setup;
    }()
  }]);

  return Scheduler;
}(_base2.default);

exports.default = Scheduler;