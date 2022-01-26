const id = '9363be2f-3491-454f-9b29-5f4276dba174'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '마우스'
const title = '마우스 휠을 굴렸을 때'
const description = '마우스 휠을 굴렸을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.'

const variables = {}
const fn = function(data, next, stop) {
  if (typeof process === 'object') {
    return stop(new Error('브라우저 환경에서만 작동합니다.'))
  }
  document.addEventListener('wheel', (e) => {
    data.event = e
    next(e)
  })
}

export default {
  id,
  version,
  url,
  author,
  group,
  title,
  description,
  variables,
  fn
}