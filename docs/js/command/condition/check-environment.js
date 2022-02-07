export default {
  id: 'def3d7b6-8541-4361-a748-8d1c7ee37b9e',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '환경',
  title: '작동 환경을 비교합니다',
  description: '현재 작동 환경이 {{ kind }}일 경우에 작동합니다.',
  variables: {
    'kind': {
      type: 'number',
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
  },
  fn: function(data, next, stop) {
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
}