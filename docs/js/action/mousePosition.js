export default {
  id: 'b3de30ce-65d3-43b5-9ddb-21857fd76f28',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '변수',
  title: '마우스 좌표를 변수에 담습니다',
  description: '현재 마우스의 {{ pos_type }}(를)을 {{ var_type }}변수 {{ var_name }}에 담습니다. 이 명령어는 이벤트가 마우스 이벤트일 경우에만 작동합니다.',
  variables: {
    'pos_type': {
      type: 'radio',
      default_value: 'screenX',
      items: [
        {
          preview: 'screenX',
          value: 'screenX'
        },
        {
          preview: 'screenY',
          value: 'screenY'
        },
        {
          preview: 'pageX',
          value: 'pageX'
        },
        {
          preview: 'pageY',
          value: 'pageY'
        },
        {
          preview: 'clientX',
          value: 'clientX'
        },
        {
          preview: 'clientY',
          value: 'clientY'
        },
        {
          preview: 'offsetX',
          value: 'offsetX'
        },
        {
          preview: 'offsetY',
          value: 'offsetY'
        },
      ]
    },
    'var_type': {
      type: 'radio',
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

    const varTarget = data[this.var_type]
    const value = data.event[this.pos_type]

    varTarget[this.var_name] = value

    next(data)
  }
}