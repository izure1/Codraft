export default {
  id: 'a27d65e3-ccdf-4cbf-bf44-5cedd4422b09',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '대화상자',
  title: '사용자로부터 값을 입력받습니다',
  description: '사용자로부터 값을 입력받습니다. 질문글 {{ question }}(과)와, 미리보기 대답으로 {{ preview }}(를)을 보여줍니다. 그리고 사용자의 대답을 {{ var_type }}변수 변수명 {{ var_name }}에 저장합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {
    'question': {
      type: 'string',
      default_value: '당신의 이름은?'
    },
    'preview': {
      type: 'string',
      default_value: '홍길동'
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
      default_value: '이름'
    }
  },
  fn: function(data, next, stop) {
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }

    const answer = prompt(this.question, this.preview)
    const varTarget = data[this.var_type]
    varTarget[this.var_name] = answer

    next(data)
  }
}