export default {
  id: '7eddc4ba-5164-4193-975e-99d5630e48e4',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '마우스 버튼을 비교합니다',
  description: '마우스 이벤트 대상이 {{ which }}버튼일 경우 작동합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {
    'which': {
      type: 'number',
      default_value: 1,
      items: [
        {
          preview: '좌',
          value: 1
        },
        {
          preview: '휠',
          value: 2
        },
        {
          preview: '우',
          value: 3
        }
      ]
    }
  },
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    if (data.event) {
      if (data.event.which === this.which) {
        return next(data)
      }
    }
    return stop(data)
  }
}