export default {
  id: 'f0af4937-a795-4c7c-9534-60e1e8adc2a6',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '변수',
  title: '변수에 값을 저장합니다.',
  description: '{{ var_type }} {{ var_scope }}변수 {{ var_name }}에 {{ var_content }}(이)란 값을 저장합니다.',
  variables: {
    'var_scope': {
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
    },
    'var_content': {
      type: 'dynamic',
      default_value: 'null'
    }
  },
  fn: function(data, next, stop) {
    const varTarget = data[this.var_type]
    varTarget[this.var_name] = this.var_content

    next(data)
  }
}