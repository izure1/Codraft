export default {
  id: '0c1cedc1-1713-4fe9-ae7d-9aa8a27778fb',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '대화상자',
  title: '대화상자를 띄웁니다',
  description: '대화상자에 내용{{ message }}(를)을 보여줍니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {
    'message': {
      type: 'string',
      default_value: 'Hello, World!'
    }
  },
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }

    alert(this.message)
    next(data)
  }
}