import React, { FC } from 'react'
import { renderHook, act } from '@testing-library/react-hooks'
import {
  useOrderForm,
  useOrderQueue,
  useQueueStatus,
  OrderQueueProvider,
} from '@vtex/order-manager'

import { mockOrderForm } from '../__fixtures__/orderForm'
import { OrderFormProvider } from '../__fixtures__/OrderFormProvider'
import {
  createOrderProfileProvider,
  useOrderProfile,
} from '../components/createOrderProfileProvider'
import { LogParams } from '../utils/logger'

const mockProfileData = {
  firstName: 'Fulano ',
  lastName: 'DiTal',
  phone: '+55(12) 3 1231-223',
  documentType: 'cpf',
  document: '123.456.789-09',
  email: 'fulano@detal.com',
}

const mockLog = jest.fn()

function useLogger() {
  const log = ({
    type,
    level,
    event,
    workflowType,
    workflowInstance,
  }: LogParams) => {
    mockLog({
      type,
      level,
      event,
      workflowType,
      workflowInstance,
    })
  }

  return { log }
}

const mockUseUpdateOrderFormProfile = jest.fn().mockResolvedValue(true)
const mockUseUpdateClientPreferencesData = jest.fn().mockResolvedValue(true)

const createWrapperOrderProviders = () => {
  const useUpdateOrderFormProfile = () => ({
    updateOrderFormProfile: mockUseUpdateOrderFormProfile,
  })

  const useUpdateClientPreferencesData = () => ({
    updateClientPreferencesData: mockUseUpdateClientPreferencesData,
  })

  const { OrderProfileProvider } = createOrderProfileProvider({
    useLogger,
    useOrderQueue,
    useOrderForm,
    useUpdateOrderFormProfile,
    useUpdateClientPreferencesData,
    useQueueStatus,
  })

  const Wrapper: FC = ({ children }) => {
    return (
      <OrderQueueProvider>
        <OrderFormProvider>
          <OrderProfileProvider>{children}</OrderProfileProvider>
        </OrderFormProvider>
      </OrderQueueProvider>
    )
  }

  return { Wrapper }
}

describe('OrderProfile', () => {
  it('should throw an error if theres no OrderPaymentProvider on the tree', () => {
    const {
      result: { error },
    } = renderHook(() => useOrderProfile())

    expect(error).not.toBeNull()
    expect(error?.message).toEqual(
      'useOrderProfile must be used within an <OrderProfile />'
    )
    expect(mockUseUpdateOrderFormProfile).not.toHaveBeenCalled()
  })
})
