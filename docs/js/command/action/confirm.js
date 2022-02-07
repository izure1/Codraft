export default {
  id: '7dca9a28-576f-4f27-8aba-ed3c8cf19ff4',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '대화상자',
  title: '사용자로부터 참/거짓 여부를 입력받습니다',
  description: '사용자로부터 참/거짓 여부를 입력받습니다. 질문글 {{ question }}(를)을 보여줍니다. 그리고 사용자의 대답을 {{ var_type }}변수 변수명 {{ var_name }}에 저장합니다. 이 명령어는 브라우저에서만 작동합니다.',
  variables: {
    'question': {
      type: 'string',
      default_value: '당신은 사람입니까?'
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
    if (typeof process === 'object') {
      return stop(new Error('브라우저 환경에서만 작동합니다.'))
    }

    const answer = confirm(this.question)
    const varTarget = data[this.var_type]
    varTarget[this.var_name] = !!answer

    next(data)
  }
}