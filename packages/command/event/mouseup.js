const id = '3818d689-31f8-4884-94c5-e1b865a0f4ad'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '마우스'
const title = '마우스 버튼을 땠을 때'
const description = '마우스 버튼을 땠을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.'

const variables = {}
const fn = function(data, next, stop) {
  if (typeof process === 'object') {
    return stop(new Error('브라우저 환경에서만 작동합니다.'))
  }
  document.addEventListener('mouseup', (e) => {
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