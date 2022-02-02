export default {
  id: '9363be2f-3491-454f-9b29-5f4276dba174',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '마우스 휠을 굴렸을 때',
  description: '마우스 휠을 굴렸을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {},
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    document.addEventListener('wheel', (e) => {
      data.event = e
      next(e)
    })
  }
}