# 명령어 (Command)

## 예시 모음


이 명령어는 `@codraft/canvas`, `@codraft/core` 라이브러리에서 사용할 수 있는 명령어입니다.

예시용의 목적으로 작성되었으므로, 많은 명령어를 지원하지 않으므로 참고하십시오.

## 명령어 자료 구조

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
      type: 'string'|'number'|'boolean'|'dynamic', // 입력된 값이 해석될 방식을 지정합니다.
      default_value: string|number|boolean,
      items?: [ // 이 값을 지정하면 radio 방식으로 주어진 값만을 입력할 수 있습니다.
        preview: string,
        value: string|number|boolean
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
      type: 'number',
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

### 명령어 변수의 자료형

`variables[key].type`은 기입한 변수의 자료형을 의미합니다.

기본적으로 지원되는 속성은 `string`, `number`, `boolean`, `dynamic`입니다. `Codraft`에서는 사용자가 입력한 값을 문자열로 저장하며, 이 속성은 해당 포맷을 어떻게 해석할 것인지 지정합니다.

다음은 입력값에 대한 각 속성이 해석한 결과 예시입니다.

#### 사용자가 `1`을 기입했을 경우

|속성|해석결과|
|---|---|
|`string`| `"1"`|
|`number`| `1`|
|`boolean`| `true`|
|`dynamic`|`1`|

#### 사용자가 `1+3`을 기입했을 경우

|속성|해석결과|
|---|---|
|`string`| `"1+3"`|
|`number`| `4`|
|`boolean`| `true`|
|`dynamic`|`4`|

#### 사용자가 `false`을 기입했을 경우

|속성|해석결과|
|---|---|
|`string`| `"false"`|
|`number`| `error`|
|`boolean`| `false`|
|`dynamic`|`false`|

#### 주의사항

##### `number` 자료형에서 `error`가 발생하는 이유

`number` 자료형 변수에 `false`를 기입하면 `0`이 아닌 `error`가 나오는 이유가 궁금하실 수 있습니다. 이는 `Codraft`가 `number` 자료형을 해석하는데 [`math-expression-evaluator`](https://github.com/bugwheels94/math-expression-evaluator) 라이브러리에 의존하기 때문입니다. `number` 자료형은 `math-expression-evaluator`을 통한 수식 계산을 하기 때문에, 수식이 아닌 문자열은 오류로 표기됩니다.

##### `dynamic` 자료형

`dynamic` 자료형은 마법처럼 보일 수 있습니다. 하지만 모든 자료형을 확인하기 때문에 다른 자료형에 비해 성능이 느립니다. `dynamic` 자료형은 `math-expression-evaluator` 라이브러리와 `JSON.parse` 함수를 이용해서 자료형을 파악합니다. 따라서 `array`, `object` 등의 자료형도 파악할 수 있습니다만 권장되지는 않습니다. `dynamic` 자료형은 사용자가 어떤 자료형을 기입할지 모르는 상황에서 사용되어야 합니다.

### 명령어의 `fn` 함수

명령어의 `fn` 함수는 `@codraft/core`에서 콜백함수로 실제 작동합니다.

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
    type: 'number',
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

**stop**: (reason?: `any`) => `void`

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
