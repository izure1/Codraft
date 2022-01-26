const id = '82b0915e-b405-445d-9695-0e62bc6f9b8e'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '키보드'
const title = '키보드 키를 눌렀을 때'
const description = '키보드 키를 눌렀을 때 작동합니다. 이 명령어는 브라우저에서만 작동합니다.'

const variables = {}
const fn = function(data, next, stop) {
  if (typeof process === 'object') {
    return stop(new Error('브라우저 환경에서만 작동합니다.'))
  }
  document.addEventListener('keydown', (e) => {
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