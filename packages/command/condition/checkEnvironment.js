const id = 'def3d7b6-8541-4361-a748-8d1c7ee37b9e'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '환경'
const title = '작동 환경을 비교합니다'
const description = '현재 작동 환경이 {{ kind }}일 경우에 작동합니다.'

const variables = {
  'kind': {
    type: 'radio',
    default_value: 0,
    items: [
      {
        preview: '브라우저',
        value: 0
      },
      {
        preview: 'Node.js',
        value: 1
      }
    ]
  }
}
const fn = function(data, next, stop) {
  let kind = -1

  // Node.js
  if (typeof process === 'object') {
    kind = 1
  }
  else {
    kind = 0
  }

  if (this.kind === kind) {
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