import axios from 'https://cdn.jsdelivr.net/npm/axios@0.26.0/dist/axios.min.js'

export default {
  id: '461f8e8e-0dbc-4bbd-bb6a-62635d5cf646',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '연결',
  title: '주소로 요청합니다',
  description: '웹페이지 {{ url }} 주소로 {{ method }} 방식으로 요청합니다. 요청 시 {{ body }} JSON 데이터를 함께 전송합니다. 응답 {{ res_status }}(를)을 반환 받았다면, {{ res_var_type }} 변수 {{ res_var_name }}에 응담값을 받습니다.',
  variables: {
    'url': {
      type: 'string',
      default_value: 'https://google.com'
    },
    'method': {
      type: 'string',
      default_value: 'get',
      items: [
        {
          preview: 'GET',
          value: 'get'
        },
        {
          preview: 'POST',
          value: 'post'
        },
        {
          preview: 'PUT',
          value: 'put'
        },
        {
          preview: 'DELETE',
          value: 'delete'
        }
      ]
    },
    'body': {
      type: 'dynamic',
      default_value: '{}'
    },
    'res_status': {
      type: 'number',
      default_value: 200
    },
    'res_var_type': {
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
    'res_var_name': {
      type: 'string',
      default_value: '변수명'
    }
  },
  fn: function(data, next, stop) {
    axios({
      method: this.method,
      url: this.url,
      data: this.body
    }).then((response) => {
      const { status, data: responseData } = response
      if (status === this.res_status) {
        const varTarget = data[this.res_var_type]
        varTarget[this.res_var_name] = responseData
        return next(data)
      }
      else {
        return stop(new Error(`서버에서 ${status} 상태를 반환했습니다.`))
      }
    }).catch(stop)
  }
}