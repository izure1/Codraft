const id = '44409b97-a477-47a8-a334-e8394e35b20a'
const version = '1.0.0'
const url = 'https://github.com/izure1/Codraft'
const author = 'izure1'
const group = '콘솔'
const title = '콘솔에 메세지를 남깁니다'
const description = '콘솔에 {{ type }} 메세지 {{ message }}(를)을 남깁니다.'

const variables = {
  'type': {
    type: 'radio',
    default_value: 0,
    items: [
      {
        preview: '일반',
        value: 0
      },
      {
        preview: '에러',
        value: 1
      }
    ]
  },
  'message': {
    type: 'string',
    default_value: 'Hello World'
  }
}
const fn = function(data, next, stop) {
  switch (this.type) {
    case 0: {
      console.log(this.message)
      break
    }
    case 1: {
      console.error(this.message)
      break
    }
  }
  next(data)
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