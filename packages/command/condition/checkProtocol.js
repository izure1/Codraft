export default {
  id: 'b5e135fa-4dc3-40db-bae9-424dc8d476b2',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '환경',
  title: '프로토콜을 비교합니다',
  description: '현재 프로토콜이 {{ protocol }}(일) 경우 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {
    'protocol': {
      type: 'radio',
      default_value: 'https',
      items: [
        {
          preview: 'https',
          value: 'https:'
        },
        {
          preview: 'http',
          value: 'http'
        }
      ]
    }
  },
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    if (location.protocol === this.protocol) {
      return next(data)
    }
    else {
      return stop()
    }
  }
}