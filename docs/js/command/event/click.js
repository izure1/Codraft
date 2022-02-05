export default {
  id: 'd6d1a1b7-7e9f-4011-b6d4-c5427c8e75fd',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '좌클릭했을 때',
  description: '좌클릭했을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {},
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    document.addEventListener('click', (e) => {
      data.event = e
      next(data)
    })
  }
}