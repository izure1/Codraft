export default {
  id: '6c8d7010-96fe-4854-8429-31a5a0370afb',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '변수',
  title: '변수를 삭제합니다.',
  description: '{{ var_type }}변수 {{ var_name }}(를)을 삭제합니다.',
  variables: {
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
    const varTarget = data[this.var_type]
    delete varTarget[this.var_name]

    next(data)
  }
}