const id = 'b5e135fa-4dc3-40db-bae9-424dc8d476b2'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '환경'
const title = '프로토콜을 비교합니다'
const description = '현재 프로토콜이 {{ protocol }}(일) 경우 작동합니다. 이 명령어는 브라우저에서만 작동합니다.'

const variables = {
  'protocol': {
    type: 'radio',
    default_value: 'https',
    items: [
      {
        preview: 'https',
        value: 'https:'
      },
      {
        preview: 'http',
        value: 'http'
      }
    ]
  }
}
const fn = function(data, next, stop) {
  if (typeof process === 'object') {
    return stop(new Error('브라우저 환경에서만 작동합니다.'))
  }
  if (location.protocol === this.protocol) {
    return next(data)
  }
  else {
    return stop()
  }
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