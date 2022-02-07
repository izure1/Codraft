export default {
  id: 'f656e4f3-3f50-4467-9df5-3416841c55d0',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '변수',
  title: 'DOM 속성값을 변수에 담습니다',
  description: '마우스 이벤트를 발생시킨 DOM 엘리먼트의 {{ attribute }}속성값을 {{ var_type }}변수 {{ var_name }}에 담습니다. 이 명령어는 이벤트가 마우스 이벤트일 경우에만 작동합니다.',
  variables: {
    'attribute': {
      type: 'string',
      default_value: 'id'
    },
    'var_type': {
      type: 'string',
      default_value: 'local',
      items: [
        {
          preview: '지역',
          value: 'local'
        },
        {
          preview: '전역',
          value: 'global'
        }
      ]
    },
    'var_name': {
      type: 'string',
      default_value: '변수명'
    }
  },
  fn: function(data, next, stop) {
    if (!(data.event instanceof MouseEvent)) {
      return stop(new Error('이벤트가 마우스 이벤트일 경우에만 작동합니다.'))
    }
    
    if (data.event.currentTarget instanceof HTMLElement) {
      const varTarget = data[this.var_type]
      const value = data.event.currentTarget.getAttribute(this.attribute)

      varTarget[this.var_name] = value
    }
    else {
      return stop(new Error('이벤트 대상이 HTMLElement 인스턴스가 아닙니다.'))
    }

    next(data)
  }
}