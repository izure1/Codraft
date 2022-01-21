# Codraft/core

`@codraft/canvas`로 작성한 코드를 실행하세요. 브라우저와 Node.js 모든 환경에서 동작합니다.

## 설치

```bash
npm install @codraft/core
```

## 사용법

`@codraft/core`을 실행하기 위해선 두 가지 정보가 필요합니다.

### 명령어

사용된 모든 명령어가 필요합니다.

### 저장 데이터

`@codraft/canvas`에서 `save` 함수로 얻어올 수 있습니다.

```javascript
import { Runner } from '@codraft/core'

const runner = new Runner(eventCommands, conditionCommands, actionCommands, saveData)

runner.init() // 코드를 실행합니다.
```
