export default {
  id: '82b0915e-b405-445d-9695-0e62bc6f9b8e',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '키보드',
  title: '키보드 키를 눌렀을 때',
  description: '키보드 키를 눌렀을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {},
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    document.addEventListener('keydown', (e) => {
      data.event = e
      next(data)
    })
  }
}