import React, { useMemo, useContext, useCallback } from 'react'
import { useMutation } from 'react-apollo'
import MutationUpdateOrderFormProfile from 'vtex.checkout-resources/MutationUpdateOrderFormProfile'
import {
  useOrderQueue,
  useQueueStatus,
  QueueStatus,
} from 'vtex.order-manager/OrderQueue'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { OrderForm, UserProfileInput } from 'vtex.checkout-graphql'

interface ProfileContext {
  setOrderProfile: (profile: UserProfileInput) => Promise<{ success: boolean }>
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

const SET_PROFILE_TASK = 'SetProfileTask'

export const OrderProfileProvider: React.FC = ({ children }) => {
  const { enqueue, listen } = useOrderQueue()
  const { setOrderForm } = useOrderForm()

  const queueStatusRef = useQueueStatus(listen)

  const [updateOrderFormProfile] = useMutation<
    UpdateOrderFormProfileMutation,
    UpdateOrderFormProfileMutationVariables
  >(MutationUpdateOrderFormProfile)

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

  const value = useMemo(() => ({ setOrderProfile }), [setOrderProfile])

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
