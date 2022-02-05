export default {
  id: 'a7aca1a6-3678-4234-97ed-ef912b681947',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '연결',
  title: '새로운 인터넷 탭을 엽니다',
  description: '주소 {{ url }}(를)을 새로운 탭으로 엽니다. 이 명령어는 브라우저에서만 작동합니다.',
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
    window.open(this.url, '_blank')
    next(data)
  }
}