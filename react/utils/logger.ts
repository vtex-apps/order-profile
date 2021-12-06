interface LogParams {
  type: 'Error'
  level: 'Critical'
  event: unknown
  workflowType: 'OrderItems'
  workflowInstance: string
}

export function useLogger() {
  const log = ({
    type,
    level,
    event,
    workflowType,
    workflowInstance,
  }: LogParams) => {
    // eslint-disable-next-line no-console
    console.log({ type, level, event, workflowType, workflowInstance })
  }

  return { log }
}
