export interface LogParams {
  type: 'Error'
  level: 'Critical'
  event: unknown
  workflowType?: 'OrderProfile'
  workflowInstance: string
}

export type LogFn = (params: LogParams) => void

export type UseLogger = () => { log: LogFn }

const log = ({
  type,
  level,
  event,
  workflowType,
  workflowInstance,
}: LogParams) => {
  // eslint-disable-next-line no-console
  console.log({
    type,
    level,
    event,
    workflowInstance,
    workflowType: workflowType || 'OrderProfile',
  })
}

export function useLogger() {
  return { log }
}
