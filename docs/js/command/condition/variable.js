export default {
  id: 'd1e1b5a4-7913-450e-a38e-1b8f2f8eb4ea',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '변수',
  title: '변수 값을 비교합니다',
  description: '{{ var_type }}변수 {{ var_name }}의 값이 {{ var_value }} {{ compare }}(일) 경우 작동합니다.',
  variables: {
    'var_type': {
      type: 'string',
      default_value: 'localOrGlobal',
      items: [
        {
          preview: '지역',
          value: 'local'
        },
        {
          preview: '전역',
          value: 'global'
        },
        {
          preview: '지역 또는 전역',
          value: 'localOrGlobal'
        }
      ]
    },
    'var_name': {
      type: 'string',
      default_value: '변수명'
    },
    'var_value': {
      type: 'string',
      default_value: '변수값'
    },
    'compare': {
      type: 'string',
      default_value: 'eq',
      items: [
        {
          preview: '같음',
          value: 'eq'
        },
        {
          preview: '같지 않음',
          value: 'not'
        },
        {
          preview: '이상',
          value: 'gte'
        },
        {
          preview: '이하',
          value: 'lte'
        },
        {
          preview: '초과',
          value: 'gt'
        },
        {
          preview: '미만',
          value: 'lt'
        }
      ]
    }
  },
  fn: function(data, next, stop) {
    let target = null
    switch (this.var_type) {
      case 'local': {
        target = data.local
        break
      }
      case 'global': {
        target = data.global
        break
      }
    }

    let value = undefined
    if (target === null) {
      if (this.var_name in data.local) {
        value = data.local[this.var_name]
      }
      else if (this.var_name in data.global) {
        value = data.global[this.var_name]
      }
      else {
        return stop(new Error(`'${this.var_name}' 변수는 존재하지 않습니다.`))
      }
    }
    else {
      value = target[this.var_name]
    }

    let success = false
    switch (this.compare) {
      case 'eq': {
        success = value === this.var_value
        break
      }
      case 'not': {
        success = value !== this.var_value
        break
      }
      case 'gte': {
        success = value >= this.var_value
        break
      }
      case 'lte': {
        success = value <= this.var_value
        break
      }
      case 'gt': {
        success = value > this.var_value
        break
      }
      case 'lt': {
        success = value < this.var_value
        break
      }
    }

    if (!success) {
      return stop()
    }

    next(data)
  }
}