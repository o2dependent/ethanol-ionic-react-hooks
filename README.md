# @ethanol/ionic-react-hooks

> Ionic react hooks by Ethan Olsen

**_This library is not still being developed and is not to be used in applications till done._**

[![NPM](https://img.shields.io/npm/v/@ethanol/ionic-react-hooks.svg)](https://www.npmjs.com/package/@ethanol/ionic-react-hooks) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @ethanol/ionic-react-hooks
```

## Usage

#### useAudioPlayer

```tsx
import React from 'react'

import { useAudioPlayer } from '@ethanol/ionic-react-hooks'

interface Props {
  audioUrl: string
}

export const AudioComponent = ({ audioUrl }: Props) => {
  // ---- hooks ----
  // > refs
  const progressRef = useRef<HTMLInputElement>(null!)

  // > player
  const {
    curTime,
    duration,
    isLoading,
    isPaused,
    seekTo,
    skip,
    togglePlayPause
  } = useAudioPlayer({
    audioUrl: audioUrl,
    progressRef: progressRef
  })

  return (
    <div>
      {/* Display current time and duration */}
      <p>
        {curTime}/{duration}
      </p>
      {/* Progress slider */}
      <input
        type='range'
        ref={progressRef}
        onChange={(e) => seekTo(parseInt(e?.target?.value ?? curTime))}
      />
      {/* Play pause */}
      <button onClick={togglePlayPause}>{isPaused ? 'Play' : 'Pause'}</button>
      {/* Skip 15 seconds forward and backwards */}
      <button onClick={() => skip(15)}>Skip +15</button>
      <button onClick={() => skip(-15)}>Skip -15</button>
    </div>
  )
}
```

## License

MIT © [o2dependent](https://github.com/o2dependent)
