module.exports = class Validator {
  errors = [];

  constructor(data, checks) {
    this.data = data;
    this.checks = checks;

    for (const checksKey in checks) {
      for (const checksKeyElement of checks[checksKey]) {
        if (checksKeyElement.includes(":"))
          this[checksKeyElement.match(/^(.+?):/)[1]](data[checksKeyElement.match(/:(.+?):/)[1]], data[checksKeyElement.match(/:.+(:(.+))$/)[2]]);
        else if(checksKeyElement.includes("-"))
          this[checksKeyElement.split("-")[0]](data[checksKey], checksKeyElement.split("-")[1]);
        else
          this[checksKeyElement](data[checksKey]);
      }
    }
  }

  string(str){
    if (typeof str !== "string")
      this.errors.push("Error.notString");
  }

  number(num){
    if (typeof num !== "number")
      this.errors.push("Error.notNumber");
  }

  boolean(bool){
    if (typeof bool !== "boolean")
      this.errors.push("Error.notBoolean");
  }

  null(obj){
    if (typeof obj !== "undefined" && obj !== null)
      this.errors.push("Error.notNull");
  }

  notNull(obj){
    if (typeof obj === "undefined" || obj === null)
      this.errors.push("Error.Null");
  }

  min(element, min){
    switch (typeof element) {
      case "bigint":
      case "number":
        if (element < min)
          this.errors.push("Error.incorrectLength")
        break;
      case "string":
        if (element.length < min)
          this.errors.push("Error.incorrectLength")
        break;
      default:
        this.errors.push("Error.incorrectType")
    }
  }

  max(element, max){
    switch (typeof element) {
      case "bigint":
      case "number":
        if (element > max)
          this.errors.push("Error.incorrectLength")
        break;
      case "string":
        if (element.length > max)
          this.errors.push("Error.incorrectLength")
        break;
      default:
        this.errors.push("Error.incorrectType")
    }
  }

  email(email){
    if (typeof email !== "string")
      !this.errors.includes("Error.notString") ? this.errors.push("Error.notString") : this.errors;
    else if (!email.match(/^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/))
      this.errors.push("Error.emailNotCorrect");
  }

  url(url){
    if (typeof url !== "string")
      !this.errors.includes("Error.notString") ? this.errors.push("Error.notString") : this.errors;
    else if (!url.match(/https?:\/\/(?:www\.)?\S+\.\S+(?:\/[^\s]*)?/))
      this.errors.push("Error.urlNotCorrect");
  }
};