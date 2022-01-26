const id = 'b792d0ee-7658-45a9-8fc5-19bd4d6c8103'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '페이지'
const title = '페이지가 준비 되었을 때'
const description = '페이지가 준비되었을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.'

const variables = {}
const fn = function(data, next, stop) {
  if (typeof process === 'object') {
    return stop(new Error('브라우저 환경에서만 작동합니다.'))
  }
  document.addEventListener('ready', (e) => {
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