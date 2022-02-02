export default {
  id: 'b1502706-475e-41f5-a7da-db2394fdd514',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '키보드',
  title: '키보드 키를 땠을 때',
  description: '키보드 키를 땠을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {},
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    document.addEventListener('keyup', (e) => {
      data.event = e
      next(e)
    })
  }
}