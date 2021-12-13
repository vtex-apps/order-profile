/* eslint-disable import/export */

declare module 'vtex.order-manager/OrderQueue' {
  export * from 'vtex.order-manager/react/OrderQueue'
  export { default } from 'vtex.order-manager/react/OrderQueue'

  export const QueueStatus = {
    PENDING: 'Pending',
    FULFILLED: 'Fulfilled',
  } as const
}

declare module 'vtex.order-manager/OrderForm' {
  export * from 'vtex.order-manager/react/OrderForm'
  export { default } from 'vtex.order-manager/react/OrderForm'
}

declare module 'vtex.order-manager/constants' {
  export * from 'vtex.order-manager/react/constants'
}
