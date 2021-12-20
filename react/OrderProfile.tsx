import { useCallback } from 'react'
import { useMutation } from 'react-apollo'
import MutationUpdateOrderFormProfile from 'vtex.checkout-resources/MutationUpdateOrderFormProfile'
import MutationUpdateClientPreferencesData from 'vtex.checkout-resources/MutationUpdateClientPreferencesData'
import { useOrderForm } from 'vtex.order-manager/OrderForm'
import { useQueueStatus, useOrderQueue } from 'vtex.order-manager/OrderQueue'
import {
  UserProfileInput,
  ClientPreferencesDataInput,
  OrderForm as CheckoutOrderForm,
} from '@vtex/checkout-types'

import { useLogger } from './utils/logger'
import {
  createOrderProfileProvider,
  useOrderProfile,
} from './components/createOrderProfileProvider'

interface UpdateOrderFormProfileMutation {
  updateOrderFormProfile: CheckoutOrderForm
}

interface UpdateOrderFormProfileMutationVariables {
  profile: UserProfileInput
}

interface UpdateClientPreferencesDataMutation {
  updateClientPreferencesData: CheckoutOrderForm
}

interface UpdateClientPreferencesDataMutationVariables {
  clientPreferences: ClientPreferencesDataInput
}

function useUpdateOrderFormProfile() {
  const [updateOrderFormProfile] = useMutation<
    UpdateOrderFormProfileMutation,
    UpdateOrderFormProfileMutationVariables
  >(MutationUpdateOrderFormProfile)

  return {
    updateOrderFormProfile: useCallback(
      async (profile: UserProfileInput) => {
        const { data } = await updateOrderFormProfile({
          variables: { profile },
        })

        const newOrderForm = data!.updateOrderFormProfile

        return newOrderForm
      },
      [updateOrderFormProfile]
    ),
  }
}

function useUpdateClientPreferencesData() {
  const [updateClientPreferencesData] = useMutation<
    UpdateClientPreferencesDataMutation,
    UpdateClientPreferencesDataMutationVariables
  >(MutationUpdateClientPreferencesData)

  return {
    updateClientPreferencesData: useCallback(
      async (clientPreferences: ClientPreferencesDataInput) => {
        const { data } = await updateClientPreferencesData({
          variables: { clientPreferences },
        })

        const newOrderForm = data!.updateClientPreferencesData

        return newOrderForm
      },
      [updateClientPreferencesData]
    ),
  }
}

const { OrderProfileProvider } = createOrderProfileProvider({
  useOrderQueue,
  useOrderForm,
  useQueueStatus,
  useLogger,
  useUpdateOrderFormProfile,
  useUpdateClientPreferencesData,
})

export { OrderProfileProvider, useOrderProfile }
export default { OrderProfileProvider, useOrderProfile }
