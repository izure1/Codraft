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

#### Node.js

```javascript
import '@codraft/canvas'
```

#### Browser

```html
<script src="https://cdn.jsdelivr.net/npm/@codraft/canvas@latest/dist/codraft-canvas.min.js"></script>
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

하지만 `codraft-canvas` 엘리먼트로부터 직접 컴포넌트 함수를 불러올 수도 있습니다. `element.codraft` 네임스페이스를 참조하세요. 이는 이벤트를 얻어내기 어려운 환경에서 사용하기에 적합합니다.

```html
<codraft-canvas id="codraft-canvas" style="all:initial;">
```

```javascript
const canvas = document.querySelector('#codraft-canvas')

const {
  save,
  load,
  setEventCommands,
  setConditionCommands,
  setActionCommands
} = canvas.codraft
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

## 명령어(Command)

[명령어 README](../command/)를 참조하십시오.

## 라이프사이클

`Codraft`의 명령어는 `이벤트`, `조건`, `행동` 3가지 종류의 명령어들이 합쳐져 하나의 `박스`를 이룹니다. 또한 `박스`는 또 다른 `박스`와 연결될 수 있습니다. 이러한 연결을 `스트림`이라고 부릅니다.

### 라이프사이클 용어 설명

#### `이벤트(Event)`

박스가 실행될 시점을 지정합니다. 기본적으로 1개의 `이벤트` 명령어가 필요합니다. 하지만 여러 개의 `이벤트` 명령어를 담을 수 있는데, 이 경우 1개의 `이벤트`만으로도 박스가 실행됩니다.

#### `조건(Condition)`

`이벤트`가 발생하였지만, `행동`으로 이어지기 전의 조건을 분류합니다. `조건`은 나열된 모든 명령어가 만족해야만 `행동`을 실행시킵니다.

#### `행동(Action)`

실제로 작동할 내용의 명령어 모음입니다. `행동` 명령어가 모두 완료되면, 해당 `박스`와 연결되어 있는 다음 `박스`를 실행시킵니다.

### 라이프사이클 주의사항

`박스`는 `이벤트` 명령어로 실행됩니다. 하지만 `스트림`으로 연결된 경우, 해당 `박스`는 `이벤트`가 없더라도 실행될 수 있습니다. 반대로 `박스`에 `이벤트`가 있다고 하더라도, `스트림`으로 인해 `박스`가 실행되었을 경우, 해당 `박스`의 `이벤트` 정보는 이전 `스트림`의 `이벤트` 정보를 상속받습니다.

간단한 예를 들어볼까요?

박스 `A`와 `B`가 있습니다. 그리고 `A` 종료 시, `B`가 실행될 수 있도록 `스트림`으로 연결되어 있습니다.

#### `B`에 `이벤트`가 없을 경우

이 경우, `A`가 종료되었을 때, `B`는 `A`의 `이벤트`를 상속받아 실행됩니다.

#### `B`에 `이벤트`가 있을 경우

이 경우, `박스`의 실행이 어느 곳에서 실행되었는지가 중요합니다. 가령 `A`의 `이벤트`는 `키보드` 이벤트이고, `B`의 `이벤트`는 마우스 이벤트라고 가정해봅시다.

키보드로 인해 `A`가 실행되었다면, `B` 박스는 `A` 박스의 이벤트를 상속받아 키보드 이벤트를 가지고 있습니다.

하지만 마우스로 인해 `B` 박스가 자체적으로 실행되었다면, 마우스 이벤트를 가지게 됩니다.

### 라이프사이클 내 지역 변수의 생명 주기

지역변수는 `스트림`을 따라 `이벤트`와 함께 다른 박스에게 상속됩니다. 그리고 `스트림`이 종료된 시점에서 삭제됩니다.

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
