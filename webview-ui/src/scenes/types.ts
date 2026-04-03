import type { OfficeState } from '../office/engine/officeState.js'
import type { EditorState } from '../office/editor/editorState.js'
import type { WorkspaceFolder } from '../hooks/useExtensionMessages.js'

export type SceneId = 'cafe' | 'street'

export interface SharedSceneState {
  officeState: OfficeState
  editorState: EditorState
  workspaceFolders: WorkspaceFolder[]
}
