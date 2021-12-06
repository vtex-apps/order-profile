import React, { FC, useMemo, useContext, useCallback } from 'react'
import {
  OrderFormContext,
  OrderQueueContext,
  OrderForm,
} from '@vtex/order-manager'

import { UseLogger } from '../utils/logger'
import {
  UserProfileInput,
  ClientPreferencesDataInput,
  OrderForm as CheckoutOrderForm,
} from '../typings/index'

export const QueueStatus = {
  PENDING: 'Pending',
  FULFILLED: 'Fulfilled',
} as const

interface ProfileContext {
  setOrderProfile: (profile: UserProfileInput) => Promise<{ success: boolean }>
  setClientPreferencesData: (
    clientPreferences: ClientPreferencesDataInput
  ) => Promise<{ success: boolean }>
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

interface CreateOrderProfileProvider<O extends OrderForm> {
  useLogger: UseLogger
  useOrderQueue: () => OrderQueueContext<O>
  useOrderForm: () => OrderFormContext<O>
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
}: CreateOrderProfileProvider<CheckoutOrderForm>) {
  const OrderProfileProvider: FC = ({ children }) => {
    const { enqueue, listen } = useOrderQueue()
    const { setOrderForm, orderForm } = useOrderForm()
    const { updateOrderFormProfile } = useUpdateOrderFormProfile()
    const { updateClientPreferencesData } = useUpdateClientPreferencesData()
    const { log } = useLogger()

    const queueStatusRef = useQueueStatus(listen)
    const { id } = orderForm

    const setOrderProfile = useCallback(
      async (profile: UserProfileInput) => {
        const task = async () => {
          const updatedOrderForm = await updateOrderFormProfile(profile, id)

          return updatedOrderForm
        }

        try {
          const newOrderForm = await enqueue(task, SET_PROFILE_TASK)

          if (queueStatusRef.current === QueueStatus.FULFILLED) {
            setOrderForm(newOrderForm)
          }

          return { success: true }
        } catch (err) {
          if (!err || err.code !== 'TASK_CANCELLED') {
            throw err
          }

          return { success: false }
        }
      },
      [updateOrderFormProfile, enqueue, queueStatusRef, setOrderForm, id]
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
          return { success: false }
        }
      },
      [enqueue, queueStatusRef, setOrderForm, updateClientPreferencesData, id]
    )

    const value = useMemo(
      () => ({ setOrderProfile, setClientPreferencesData }),
      [setOrderProfile, setClientPreferencesData]
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
