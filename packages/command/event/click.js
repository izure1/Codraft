const id = 'd6d1a1b7-7e9f-4011-b6d4-c5427c8e75fd'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '마우스'
const title = '좌클릭했을 때'
const description = '좌클릭했을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.'

const variables = {}
const fn = function(data, next, stop) {
  if (typeof process === 'object') {
    return stop(new Error('브라우저 환경에서만 작동합니다.'))
  }
  document.addEventListener('click', (e) => {
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