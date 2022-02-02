export default {
  id: '3818d689-31f8-4884-94c5-e1b865a0f4ad',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '마우스 버튼을 땠을 때',
  description: '마우스 버튼을 땠을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {},
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    document.addEventListener('mouseup', (e) => {
      data.event = e
      next(e)
    })
  }
}