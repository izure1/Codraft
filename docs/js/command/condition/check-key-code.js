// https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/code/code_values

export default {
  id: 'cc999660-e024-47a6-bc43-d228aaf9893e',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '키보드',
  title: '키보드 버튼을 비교합니다.',
  description: '키보드 이벤트 대상이 {{ code }}버튼일 경우 작동합니다. 입력할 수 있는 값은 https://keycode.info 웹페이지에서 키를 누른 후, event.code 결과값을 입력하십시오. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {
    'code': {
      type: 'string',
      default_value: 'KeyA',
    }
  },
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }
    if (data.event) {
      if (data.event.code === this.code) {
        return next(data)
      }
    }
    return stop(data)
  }
}