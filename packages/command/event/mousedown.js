export default {
  id: 'a462f912-189e-4db4-9be8-a14d91c30dc6',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '마우스 버튼을 눌렀을 때',
  description: '마우스 버튼을 눌렀을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {},
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    document.addEventListener('mousedown', (e) => {
      data.event = e
      next(e)
    })
  }
}