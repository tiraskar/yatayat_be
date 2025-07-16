class DynamicMessages {
  static createMessage(name) {
    return `${name} created successfully`;
  }

  static fetched(name) {
    return `${name} fetched successfully`;
  }

  static deleteMessage(name) {
    return `${name} deleted successfully`;
  }

  static updateMessage(name) {
    return `${name} updated successfully`;
  }

  static notFoundMessage(name) {
    return `${name} not found`;
  }

  static doesNotExistMessage(name) {
    return `${name} does not exist`;
  }

  static alreadyExistMessage(name) {
    return `${name} already exist`;
  }

  static invalid(name) {
    return ` Invalid ${name}`;
  }
}

module.exports = DynamicMessages;
