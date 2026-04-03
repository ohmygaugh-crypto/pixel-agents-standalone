import type { ReactNode } from 'react'
import type { SceneId, SharedSceneState } from './types.js'
import { StreetScene } from './StreetScene.js'

interface SceneManagerProps {
  activeScene: SceneId
  sharedState: SharedSceneState
  onRequestSceneChange: (scene: SceneId) => void
  cafeScene: ReactNode
}

/**
 * Minimal scene router that keeps future Pixi scene transitions centralized.
 * Cafe remains the default home base while Street can evolve independently.
 */
export function SceneManager({ activeScene, sharedState, onRequestSceneChange, cafeScene }: SceneManagerProps) {
  if (activeScene === 'street') {
    return <StreetScene sharedState={sharedState} onRequestSceneChange={onRequestSceneChange} />
  }

  return (
    <>
      {cafeScene}

      <div style={{ position: 'absolute', right: 12, bottom: 12, zIndex: 'var(--pixel-controls-z)' }}>
        <button
          onClick={() => onRequestSceneChange('street')}
          style={{
            padding: '6px 12px',
            fontSize: 22,
            color: 'var(--pixel-neon-cyan)',
            background: 'rgba(10, 6, 24, 0.8)',
            border: '2px solid var(--pixel-neon-magenta)',
            borderRadius: 0,
            cursor: 'pointer',
            boxShadow: 'var(--pixel-shadow)',
          }}
          title="Exit to neon street"
        >
          EXIT ▸ STREET
        </button>
      </div>
    </>
  )
}
