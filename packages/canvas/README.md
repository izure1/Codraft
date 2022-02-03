# @codraft/canvas

자바스크립트 코드를 Gui 환경으로 작성하세요.
작성 내용을 저장하고, 불러올 수 있습니다.

`@codraft/canvas`는 웹 컴포넌트를 사용하므로, IE11 이하를 지원하지 않습니다. [자세한 내용](https://github.com/vuejs/vue-web-component-wrapper#compatibility)을 참고하세요.

## 설치

```bash
npm install @codraft/canvas
```

`@codraft/canvas`는 *shadow dom*과 *material icon*, *Vue*을 활용한 웹 컴포넌트입니다.  
사용하기 위해서 CSS 파일과 라이브러리를 불러와야 합니다.

### *Load CSS (필수)*

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@mdi/font@latest/css/materialdesignicons.min.css">
```

### *Load Library (필수)*

```html
<script src="https://cdn.jsdelivr.net/npm/@codraft/canvas@1.x.x/dist/codraft-canvas.min.js"></script>
```

### *CSS Style 오염 문제 (선택)*

부모 요소로부터 CSS를 상속받으면, `@codraft/canvas` 엘리먼트의 CSS Style이 오염될 수 있습니다. 이를 방지하기 위해서, `codraft-canvas` 엘리먼트에 `all:initial` style를 부여하여 해결할 수 있습니다.

```html
<codraft-canvas style="all:initial;">
```

## 사용법

`@codraft/canvas`는 컴포넌트와 소통하기 위한 메서드를 이벤트로 받아낼 수 있습니다.
이벤트는 `codraft-ready`와 `codraft-change` 2가지가 준비되어 있습니다.

### `codraft-ready`

컴포넌트가 사용 가능한 준비 상태가 되었을 때, 최초 1번 호출됩니다. 초기화를 위해 사용할 수 있습니다.

### `codraft-change`

사용자가 코드의 흐름, 작성, 지우기 등, 작업을 했을 때마다 호출됩니다. 데이터에 업데이트가 있을 때 마다 저장하고 싶을 때 사용할 수 있습니다.

```javascript
// js file
function onReady(e) {
  const {
    save,
    load,
    setEventCommands,
    setConditionCommands,
    setActionCommands
  } = e.detail
}

function onChange(e) {
  const {
    save,
    load,
    setEventCommands,
    setConditionCommands,
    setActionCommands
  } = e.detail
}
```

```html
  <!-- if using Vue component -->
  <codraft-canvas @codraft-ready="onReady" @codraft-change="onChange" style="all:initial;" />

  <!-- or not -->
  <codraft-canvas id="codraft-canvas" style="all:initial;" />
  <script>
    window.addEventListener('load', () => {
      const canvas = document.querySelector('#codraft-canvas')
      canvas.addEventListener('codraft-ready', onReady)
      canvas.addEventListener('codraft-change', onChange)
    })
  </script>
```

### 컴포넌트 함수

#### save(): `Codraft.SaveFormat`

작성한 코드를 저장하고 싶을 때 사용합니다. 이후 `JSON.stringify` 메서드를 이용해 문자열로 변환하여 저장할 수 있습니다.

#### load(saveFormat: `Codraft.SaveFormat`): `void`

저장된 코드를 컴포넌트에 불러오고 싶을 때 사용합니다. `save` 함수로 얻어낸 저장 데이터를 매개변수로 넘겨야 합니다.

#### setEventCommands(commands: `Codraft.MacroCommand[]`): `void`

이벤트에 사용할 명령어 포맷 목록을 컴포넌트에 등록합니다.

#### setConditionCommands(commands: `Codraft.MacroCommand[]`): `void`

조건에 사용할 명령어 포맷 목록을 컴포넌트에 등록합니다.

#### setActionCommands(commands: `Codraft.MacroCommand[]`): `void`

행동에 사용할 명령어 포맷 목록을 컴포넌트에 등록합니다.

## 명령어 (Command)

명령어는 자바스크립트 함수를 `Codraft`에서 사용할 수 있도록 작성한 포맷입니다.
구조는 아래와 같습니다.

```javascript
{
  id: string // 명령어 고유값. 절대 중복되어선 안됩니다.
  version: string // 명령어의 버전.
  url: string // 명령어에 대한 정보를 담고 있는 주소
  author: string // 명령어 작성자
  group: string // 명령어의 그룹. 사용자들에게 같은 그룹으로 모아서 보여집니다.
  title: string // 명령어의 이름. 사용자에게 보여집니다.
  description: string // 명령어의 설명. 이곳에 사용자가 변수를 대입하여 코딩할 수 있습니다.
  variables: { // description 에서 사용한 변수를 이곳에 선언해야 합니다.
    [key: string]: {
      type: 'string'|'number'|'radio',
      default_value: string|number,
      items?: [ // type이 radio일 시에만 등록해야 합니다.
        preview: string,
        value: string|number
      ]
    }

  },
  fn: Fn // 실제 작동 구현
}
```

```javascript
// action
const actionSample = {
  id: 'f0b2d0d7-de5e-472a-819a-ecf53d026c85',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '콘솔',
  title: '콘솔에 내용을 출력합니다',
  description: '윈도우 콘솔에 {{ input_content }} 내용을 출력합니다.',
  variables: {
    'input_content': {
      type: 'string',
      default_value: 'Hello, world!'
    }
  },
  fn(data, next, stop) {
    if (!console) {
      const err = new Error('console 객체가 없습니다')
      return stop(err) // 명령어 실행을 중단합니다. 등록된 다음 명령어는 작동하지 않습니다.
    }
    console.log(this.input_content)
    return next(data) // 등록된 다음 명령어를 실행합니다.
  }
}

// condition
const conditionSample = {
  id: '54e2479f-a51e-46e4-9996-ed4c4f393201',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '클릭한 마우스 버튼을 비교합니다.',
  description: '클릭한 마우스가 {{ which }}클릭일 경우 작동합니다.',
  variables: {
    'which': {
      type: 'radio',
      default_value: 1,
      items: [
        {
          preview: '좌',
          value: 1
        },
        {
          preview: '휠',
          value: 2
        },
        {
          preview: '우',
          value: 3
        }
      ]
    }
  },
  fn(data, next, stop) {
    if (data.event) {
      const err = new Error('등록된 이벤트가 없습니다')
      return stop(err)
    }
    if (!(data.event instanceof MouseEvent)) {
      const err = new Error('이벤트가 마우스 이벤트가 아닙니다')
      return stop(err)
    }

    if (data.event.which === this.which) {
      return next(data)
    }
    else {
      return stop()
    }
  }
}

// event
const eventSample = {
  id: 'fe69bf12-99f3-41b4-9285-8b6ad3d4913b',
  version: '1.0.0',
  url: 'https://github.com/izure1/Codraft',
  author: 'izure1',
  group: '마우스',
  title: '마우스를 클릭했을 때',
  description: '마우스를 클릭했을 때 작동합니다',
  variables: {},
  fn(data, next, stop) {
    if (!document) {
      const err = new Error('dom 오브젝트가 없습니다')
      return stop(err)
    }
    document.addEventListener('mousedown', (e) => {
      data.event = e // 이벤트 정보를 할당합니다.
      return next(data)
    })
  }
}
```

이렇게 생성한 명령어는 이후 `setEventCommands`, `setConditionCommands`, `setActionCommands` 함수로 컴포넌트에 등록할 수 있습니다.

```javascript
function onReady(e) {
  const {
    setEventCommands,
    setConditionCommands,
    setActionCommands
  } = e.detail

  setEventCommands([eventSample])
  setConditionCommands([conditionSample])
  setActionCommands([actionSample])
}
```

### 명령어의 `fn` 함수

`fn`함수는 명령어의 `fn` 함수는 실제 동작하는 부분입니다. `@codraft/core`에서 콜백함수로 작동합니다.

이 함수의 `this`는 명령어의 `variables`를 참조합니다. 따라서 `this`를 참조할 수 없는 [`arrow function`](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Functions/Arrow_functions)으로 작성해선 안됩니다.

```javascript
...
variables: {
  a: {
    type: 'number',
    default_value: 0
  },
  b: {
    type: 'string',
    default_value: 'hello'
  },
  c: {
    type: 'radio',
    default_value: 1,
    items: [
      {
        preview: 'one',
        value: 1
      },
      {
        preview: 'two',
        value: 2
      }
    ]
  }
},
fn(data, next, stop) {
  console.log(this.a) // 실제 기입한 값이 들어가 있습니다.

  console.log(typeof this.a) // 'number'
  console.log(typeof this.b) // 'string'
  console.log(typeof this.c) // 'number'
}
```

또한 이 함수는 `data`, `next`, `stop` 매개변수를 수신받습니다. 각 매개변수는 아래와 같습니다.

**data**: `MacroDataTransfer`

#### *data.event*: `any`

이벤트 정보를 담을 네임스페이스입니다. 이는 condition, action 타입의 명령어에서 사용하기 위해 있습니다. 기본값은 `null`입니다.

```javascript
// event 명령어
document.addEventListener('click', (e) => {
  data.event = e
  next(data)
})
```

#### *data.local*: `Record<string, any>`

스트림의 지역변수를 담을 네임스페이스입니다. 이 네임스페이스에 담긴 값은 다른 네임스페이스에서 공유되지 않습니다. 말 그대로 지역변수를 위한 공간이므로, 전역변수를 사용하기 위해서는 `global`을 사용해주십시오.

```javascript
const currentTime = Date.now()
data.local.startTime = currentTime
```

#### *data.global*: `GlobalThis`

전역변수를 담을 네임스페이스입니다. 기본값은 `@codraft/core` 라이브러리가 동작하는 환경에 따라 다릅니다. 브라우저에서 실행 중이라면, 이 값은 `window`가 될 것입니다. Node.js에서 실행 중이라면, 이 값은 `global`이 됩니다.

```javascript
const userAnswer = prompt('너의 이름은...')
data.global.userName = userAnswer
```

**next**: (data: `MacroDataTransfer`) => `void`

현재 명령어가 성공적으로 작동이 끝났을 때 사용합니다. 이 함수를 호출하면 `@codraft/core`에서 다음 명령어를 실행합니다. `data` 매개변수를 전송하면, 다음 명령어의 `fn` 함수에서 `data` 매개변수를 수신할 수 있습니다.

```javascript
if (ok) {
  return next(data)
}
```

**stop**: (reason?: `Error`) => `void`

현재 명령어에서 오류가 발생하였거나, 이후의 명령어의 작동을 중지해야할 때 사용합니다. 이 함수를 호출하면 `@codraft/core`에서 다음 명령어를 실행하지 않으며, 스트림이 중단됩니다. `reason` 매개변수를 사용하여 오류를 전송할 수 있으며, 이 메세지는 console에서 확인할 수 있습니다.

```javascript
if (hasError) {
  return stop(new Error('Somethings wrong.'))
}
```

## 변수 템플릿 사용

가끔 사용자는 값을 입력할 때 변수를 사용하고 싶은 경우가 있습니다. 가령 게임을 만들 경우, 플레이어의 이름을 변수에 대입하고, 사용하고 싶은 경우입니다.

변수 템플릿을 사용하면 `data.local`, `data.global` 내에 있는 변수를 사용할 수 있습니다. 가령 `data.local`에 `test`라는 변수로 `1`이란 값이 대입되어 있을 경우, 사용하고 싶다면 아래와 같이 입력할 수 있습니다.

```javascript
{{ test }} + 2 // 3
```

변수가 문자열이라면 이렇게 쓸 수 있습니다.

```javascript
안녕, 내 이름은 {{ userName }}이야.
```

만일 `userName`이 `홍길동`이었다면, 위 문장은 `안녕, 내 이름은 홍길동이야`로 치환됩니다.

### 변수의 우선순위

변수는 지역변수가 우선되고, 지역변수에 해당하는 변수가 없을 경우, 전역변수를 차선책으로 가져옵니다.

만약 `data.local.userName`과 `data.global.userName`이 있을 때, `{{ userName }}`을 사용한다면, `data.local.userName`이 우선됩니다.

오직 전역변수만을 사용하고 싶다면, `{{{ userName }}}`과 같이, 중괄호 3개를 사용하십시오.

### 변수의 우선순위는 `속성(key)`의 존재유무로 판단됩니다

`data.local.userName`에 `undefined`, `null`, `false`와 같은 값이 있다고 해서, `data.global.userName`을 사용하지 않습니다. `Codraft`에서는 변수명에 해당하는 `속성(key)`이 있는지 여부를 이용하여 판단합니다. 따라서 지역변수를 삭제하고 싶을 경우, 아래와 같이 속성을 삭제해야 합니다.

```javascript
delete data.local.userName
```

### 변수 템플릿은 [`math-expression-evaluator`](https://github.com/bugwheels94/math-expression-evaluator)을 사용합니다

`Codraft`에서는 변수 템플릿을 해석하기 위해 `math-expression-evaluator` 라이브러리에 의존합니다. 따라서 대입값을 수학 수식으로 입력한다면 이를 해석한 결과를 내보냅니다.

```javascript
// 수학 수식임
{{ test }} + 1 / 5
```

이러한 문자열은 수학 수식으로 판단되어, 계산된 결과가 보내집니다.

```javascript
// 수학 수식이 아님
안녕 내 이름은 {{ userName }}이야.
```

하지만 위와 같은 문자열은 수학 수식이 아니므로, 문자열로 반환됩니다.
어떠한 문자열이 수학 수식으로 판단되는지는, [`math-expression-evaluator` 공식 문서](http://bugwheels94.github.io/math-expression-evaluator/)를 참조하십시오.

## 작업 관리

### 저장하기

코드를 작성하고 저장이 필요하다면 `save` 함수를 이용하세요.

```javascript
function onChange(e) {
  const { save } = e.detail
  
  const rawData = save()
  const data = JSON.stringify(rawData) // object를 string으로 형변환합니다.

  localStorage.setItem('codraft-save', data) // 형변환된 저장 데이터는 localStorage에 저장합니다.
}
```

### 불러오기

코드를 불러오고 싶다면 `load` 함수를 이용하세요.

```javascript
function onReady(e) {
  const { load } = e.detail

  const rawData = localStorage.getItem('codraft-save')
  if (rawData) {
    // 저장된 데이터가 있다면 불러옵니다.
    const saveData = JSON.parse(rawData)
    load(saveData)
  }
}
```

## 실행

저장된 데이터를 직접 자바스크립트로 실행하고 싶다면, `@codraft/core` 패키지를 사용하십시오.

```javascript
import { Runner } from '@codraft/core'

const rawData = localStorage.getItem('codraft-save')
if (rawData) {
  const saveData = JSON.parse(rawData)

  // 사용했던 모든 명령어를 runner 인스턴스에 등록해야 합니다.
  const events = [eventSample]
  const conditions = [conditionSample]
  const actions = [actionSample]

  const runner = new Runner(events, conditions, actions, saveData)

  // runner 인스턴스를 실행합니다.
  runner.init()
}
```
