export default {
  id: '747da042-9e44-435e-871b-7cc152913136',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '연결',
  title: '새로운 주소로 이동합니다',
  description: '주소 {{ url }}(으)로 이동합니다. 이후의 모든 명령어는 무시됩니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {
    'url': {
      type: 'string',
      default_value: 'https://google.com'
    }
  },
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    location.replace(this.url)
    next(data)
  }
}