import React, { FC, useMemo, useContext, useCallback } from 'react'
import { OrderQueueContext } from '@vtex/order-manager'
import {
  UserProfileInput,
  ClientPreferencesDataInput,
  OrderForm as CheckoutOrderForm,
} from '@vtex/checkout-types'

import { UseLogger } from '../utils/logger'

export const QueueStatus = {
  PENDING: 'Pending',
  FULFILLED: 'Fulfilled',
} as const

interface ProfileContext {
  setOrderProfile: (profile: UserProfileInput) => Promise<{ success: boolean }>
  setClientPreferencesData: (
    clientPreferences: ClientPreferencesDataInput
  ) => Promise<{ success: boolean }>
  clientProfileData: CheckoutOrderForm['clientProfileData']
}

const OrderProfileContext = React.createContext<ProfileContext | undefined>(
  undefined
)

type UseUpdateOrderFormProfile = () => {
  updateOrderFormProfile: (
    profile: UserProfileInput,
    orderFormId?: string
  ) => Promise<CheckoutOrderForm>
}

type UseUpdateClientPreferencesData = () => {
  updateClientPreferencesData: (
    clientPreferences: ClientPreferencesDataInput,
    orderFormId?: string
  ) => Promise<CheckoutOrderForm>
}

type ListenFunction = (event: any, callback: () => void) => () => void
interface QueueContext {
  enqueue: (task: () => Promise<CheckoutOrderForm>, id?: string) => any
  listen: ListenFunction
  isWaiting: (id: string) => boolean
}
declare type OrderFormUpdate<O> =
  | Partial<O>
  | ((prevOrderForm: O) => Partial<O>)

interface OrderContext<O extends CheckoutOrderForm> {
  loading: boolean
  setOrderForm: (nextValue: OrderFormUpdate<O>) => void
  error: any | undefined
  orderForm: O
}

interface CreateOrderProfileProvider<O extends CheckoutOrderForm> {
  useLogger: UseLogger
  useOrderQueue: () => QueueContext
  useOrderForm: () => OrderContext<O>
  useUpdateClientPreferencesData: UseUpdateClientPreferencesData
  useUpdateOrderFormProfile: UseUpdateOrderFormProfile
  useQueueStatus: (listen: OrderQueueContext<O>['listen']) => any
}

const SET_PROFILE_TASK = 'SetProfileTask'
const SET_CLIENT_PREFERENCES_TASK = 'SetClientPreferencesTask'

export function createOrderProfileProvider({
  useLogger,
  useOrderQueue,
  useUpdateClientPreferencesData,
  useUpdateOrderFormProfile,
  useOrderForm,
  useQueueStatus,
}: CreateOrderProfileProvider<CheckoutOrderForm>): {
  OrderProfileProvider: FC
} {
  const OrderProfileProvider: FC = ({ children }) => {
    const { enqueue, listen } = useOrderQueue()
    const { setOrderForm, orderForm } = useOrderForm()
    const { updateOrderFormProfile } = useUpdateOrderFormProfile()
    const { updateClientPreferencesData } = useUpdateClientPreferencesData()
    const { log } = useLogger()

    const queueStatusRef = useQueueStatus(listen)
    const { id, clientProfileData } = orderForm

    const setOrderProfile = useCallback(
      async (profile: UserProfileInput) => {
        try {
          const task = async () => {
            const updatedOrderForm = await updateOrderFormProfile(profile, id)

            return updatedOrderForm
          }

          const newOrderForm = await enqueue(task, SET_PROFILE_TASK)

          if (queueStatusRef.current === QueueStatus.FULFILLED) {
            setOrderForm(newOrderForm)
          }

          return { success: true }
        } catch (err) {
          log({
            type: 'Error',
            level: 'Critical',
            event: {
              error: err,
              orderFormId: id,
            },
            workflowInstance: 'client-profile-not-updated',
          })

          if (!err || err.code !== 'TASK_CANCELLED') {
            throw err
          }

          return { success: false }
        }
      },
      [enqueue, queueStatusRef, updateOrderFormProfile, id, setOrderForm, log]
    )

    const setClientPreferencesData = useCallback(
      async (clientPreferences: ClientPreferencesDataInput) => {
        const task = async () => {
          const updatedOrderForm = await updateClientPreferencesData(
            clientPreferences,
            id
          )

          return updatedOrderForm
        }

        try {
          const newOrderForm = await enqueue(task, SET_CLIENT_PREFERENCES_TASK)

          if (queueStatusRef.current === QueueStatus.FULFILLED) {
            setOrderForm(newOrderForm)
          }

          return { success: true }
        } catch (err) {
          log({
            type: 'Error',
            level: 'Critical',
            event: {
              error: err,
              orderFormId: id,
            },
            workflowInstance: 'client-preferences-data-not-updated',
          })

          return { success: false }
        }
      },
      [
        updateClientPreferencesData,
        id,
        enqueue,
        queueStatusRef,
        setOrderForm,
        log,
      ]
    )

    const value = useMemo(
      () => ({ setOrderProfile, setClientPreferencesData, clientProfileData }),
      [setOrderProfile, setClientPreferencesData, clientProfileData]
    )

    return (
      <OrderProfileContext.Provider value={value}>
        {children}
      </OrderProfileContext.Provider>
    )
  }

  return { OrderProfileProvider }
}

export const useOrderProfile = () => {
  const context = useContext(OrderProfileContext)

  if (context === undefined) {
    throw new Error('useOrderProfile must be used within an <OrderProfile />')
  }

  return context
}

export default { createOrderProfileProvider, useOrderProfile }
