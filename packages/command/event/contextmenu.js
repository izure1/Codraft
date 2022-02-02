export default {
  id: 'a3a94a3c-c1e2-48f9-b9cc-9884a07b0c4c',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '우클릭했을 때',
  description: '우클릭했을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {},
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    document.addEventListener('contextmenu', (e) => {
      data.event = e
      next(e)
    })
  }
}