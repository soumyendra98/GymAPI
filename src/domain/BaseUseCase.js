module.exports = class BaseUseCase {
  constructor(request, response) {
    this.request = request;
    this.response = response;
  }

  error(message) {
    return this.response.status(400).json({ success: false, message });
  }

  success({ data = undefined, message = undefined }) {
    return this.response.status(200).json({ success: true, data, message });
  }
};
