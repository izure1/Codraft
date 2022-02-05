export default {
  id: '62970bd0-16be-4df1-8c43-ad39afec161e',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '시간',
  title: '대기합니다',
  description: '{{ duration }}ms만큼 대기합니다.',
  variables: {
    'duration': {
      type: 'number',
      default_value: 0
    }
  },
  fn: function(data, next, stop) {
    setTimeout(() => next(data), this.duration)
  }
}