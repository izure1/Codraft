export default {
  id: '44409b97-a477-47a8-a334-e8394e35b20a',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '콘솔',
  title: '콘솔에 메세지를 남깁니다',
  description: '콘솔에 {{ type }} 메세지 {{ message }}(를)을 남깁니다.',
  variables: {
    'type': {
      type: 'number',
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
      type: 'dynamic',
      default_value: 'Hello World'
    }
  },
  fn: function(data, next, stop) {
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
}