module.exports = class Validator {
  errors = [];

  constructor(data, checks) {
    this.data = data;
    this.checks = checks;

    for (const checksKey in checks) {
      for (const checksKeyElement of checks[checksKey]) {
        if (checksKeyElement.includes(":"))
          this[checksKeyElement.match(/^(.+?):/)[1]](data[checksKeyElement.match(/:(.+?):/)[1]], data[checksKeyElement.match(/:.+(:(.+))$/)[2]]);
        else
          this[checksKeyElement](data[checksKey]);
      }
    }
  }
};