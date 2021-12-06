import React, { useMemo, useContext, useCallback } from 'react'
import { useMutation } from 'react-apollo'
import MutationUpdateOrderFormProfile from 'vtex.checkout-resources/MutationUpdateOrderFormProfile'
import MutationUpdateClientPreferencesData from 'vtex.checkout-resources/MutationUpdateClientPreferencesData'
import { OrderQueue, OrderForm } from 'vtex.order-manager'

import {
  UserProfileInput,
  ClientPreferencesDataInput,
  OrderForm as CheckoutOrderForm,
} from '../typings/index'
import { useLogger } from '../utils/logger'
import {
  createOrderProfileProvider,
  useOrderProfile,
} from './createOrderProfileProvider'

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

const { useOrderForm } = OrderForm
const { useOrderQueue, useQueueStatus } = OrderQueue

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
