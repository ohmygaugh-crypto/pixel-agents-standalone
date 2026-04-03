import type { SceneId, SharedSceneState } from './types.js'

interface StreetSceneProps {
  sharedState: SharedSceneState
  onRequestSceneChange: (scene: SceneId) => void
}

/**
 * StreetScene is an MVP placeholder for the future Pixi skate world.
 * We keep it as a dedicated scene component now so we can evolve it
 * independently without changing App-level wiring.
 */
export function StreetScene({ sharedState, onRequestSceneChange }: StreetSceneProps) {
  const agentCount = sharedState.officeState.characters.size

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
        background:
          'radial-gradient(circle at 20% 20%, rgba(85, 18, 126, 0.7) 0%, rgba(9, 6, 19, 1) 45%), linear-gradient(180deg, #14091f 0%, #07040f 100%)',
        color: 'var(--pixel-text)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(90deg, rgba(0, 255, 255, 0.06) 0 1px, transparent 1px 28px), repeating-linear-gradient(0deg, rgba(255, 0, 255, 0.05) 0 1px, transparent 1px 28px)',
        }}
      />

      <h1 style={{ margin: 0, fontSize: 48, color: 'var(--pixel-neon-cyan)' }}>
        Neon Street
      </h1>
      <p style={{ margin: 0, fontSize: 24, color: 'var(--pixel-text-dim)' }}>
        Skate scene coming next. Shared agents live count: {agentCount}
      </p>

      <button
        onClick={() => onRequestSceneChange('cafe')}
        style={{
          padding: '8px 14px',
          fontSize: 24,
          color: 'var(--pixel-agent-text)',
          background: 'var(--pixel-agent-bg)',
          border: '2px solid var(--pixel-agent-border)',
          borderRadius: 0,
          cursor: 'pointer',
          boxShadow: 'var(--pixel-shadow)',
        }}
        title="Return to Cyber Cafe interior"
      >
        ENTER CAFE
      </button>
    </div>
  )
}
