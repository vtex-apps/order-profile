import React, { useMemo, useContext, useCallback } from 'react'
import { useMutation } from 'react-apollo'
import MutationUpdateOrderFormProfile from 'vtex.checkout-resources/MutationUpdateOrderFormProfile'
import MutationUpdateClientPreferencesData from 'vtex.checkout-resources/MutationUpdateClientPreferencesData'
import {
  useOrderQueue,
  useQueueStatus,
  QueueStatus,
} from 'vtex.order-manager/OrderQueue'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import {
  OrderForm,
  UserProfileInput,
  ClientPreferencesDataInput,
} from 'vtex.checkout-graphql'

interface ProfileContext {
  setOrderProfile: (profile: UserProfileInput) => Promise<{ success: boolean }>
  setClientPreferencesData: (
    clientPreferences: ClientPreferencesDataInput
  ) => Promise<{ success: boolean }>
}

const OrderProfileContext = React.createContext<ProfileContext | undefined>(
  undefined
)

interface UpdateOrderFormProfileMutation {
  updateOrderFormProfile: OrderForm
}

interface UpdateOrderFormProfileMutationVariables {
  profile: UserProfileInput
}

interface UpdateClientPreferencesDataMutation {
  updateClientPreferencesData: OrderForm
}

interface UpdateClientPreferencesDataMutationVariables {
  clientPreferences: ClientPreferencesDataInput
}

const SET_PROFILE_TASK = 'SetProfileTask'
const SET_CLIENT_PREFERENCES_TASK = 'SetClientPreferencesTask'

export const OrderProfileProvider: React.FC = ({ children }) => {
  const { enqueue, listen } = useOrderQueue()
  const { setOrderForm } = useOrderForm()

  const queueStatusRef = useQueueStatus(listen)

  const [updateOrderFormProfile] = useMutation<
    UpdateOrderFormProfileMutation,
    UpdateOrderFormProfileMutationVariables
  >(MutationUpdateOrderFormProfile)
  const [updateClientPreferencesData] = useMutation<
    UpdateClientPreferencesDataMutation,
    UpdateClientPreferencesDataMutationVariables
  >(MutationUpdateClientPreferencesData)

  const setOrderProfile = useCallback(
    async (profile: UserProfileInput) => {
      const task = async () => {
        const { data } = await updateOrderFormProfile({
          variables: { profile },
        })

        const orderForm = data!.updateOrderFormProfile

        return orderForm
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
    [updateOrderFormProfile, enqueue, queueStatusRef, setOrderForm]
  )

  const setClientPreferencesData = useCallback(
    async (clientPreferences: ClientPreferencesDataInput) => {
      const task = async () => {
        const { data } = await updateClientPreferencesData({
          variables: { clientPreferences },
        })

        const orderForm = data!.updateClientPreferencesData

        return orderForm
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
    [enqueue, queueStatusRef, setOrderForm, updateClientPreferencesData]
  )

  const value = useMemo(() => ({ setOrderProfile, setClientPreferencesData }), [
    setOrderProfile,
    setClientPreferencesData,
  ])

  return (
    <OrderProfileContext.Provider value={value}>
      {children}
    </OrderProfileContext.Provider>
  )
}

export const useOrderProfile = () => {
  const context = useContext(OrderProfileContext)

  if (context === undefined) {
    throw new Error('useOrderProfile must be used within an <OrderProfile />')
  }

  return context
}

export default { OrderProfileProvider, useOrderProfile }
